"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSession, destroySession, requireAdmin } from "@/lib/session";
import { SIZE_OPTIONS, slugify } from "@/lib/site";
import { sendOrderStatusEmail } from "@/lib/email";
import { OrderStatus } from "@/generated/prisma/client";

export type FormState = { error?: string } | undefined;

const text = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

/* ---------- auth ---------- */

export async function login(_: FormState, form: FormData): Promise<FormState> {
  const email = text(form, "email").toLowerCase();
  const admin = await db.admin.findUnique({ where: { email } });
  if (!admin || !(await bcrypt.compare(String(form.get("password") ?? ""), admin.passwordHash))) {
    return { error: "Invalid email or password" };
  }
  await createSession(admin.id);
  redirect("/admin/orders");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

/* ---------- products ---------- */

async function uniqueSlug(name: string, ignoreId?: string) {
  const base = slugify(name) || "product";
  for (let n = 0; ; n++) {
    const slug = n === 0 ? base : `${base}-${n + 1}`;
    const clash = await db.product.findUnique({ where: { slug } });
    if (!clash || clash.id === ignoreId) return slug;
  }
}

export async function saveProduct(id: string | null, _: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();

  const name = text(form, "name");
  const price = Number(text(form, "price"));
  if (!name) return { error: "Name is required" };
  if (!Number.isInteger(price) || price < 1) return { error: "Price must be a whole number of rupees" };

  const images = form.getAll("images").map(String).filter(Boolean);
  const sizes = SIZE_OPTIONS.flatMap((size) => {
    const raw = text(form, `stock_${size}`);
    if (raw === "") return [];
    const stock = Number(raw);
    return Number.isInteger(stock) && stock >= 0 ? [{ size, stock }] : [];
  });
  if (sizes.length === 0) return { error: "Add stock for at least one size" };

  const data = {
    name,
    price,
    description: text(form, "description"),
    images,
    categories: { set: form.getAll("categories").map((cid) => ({ id: String(cid) })) },
  };

  if (id) {
    await db.$transaction([
      db.product.update({ where: { id }, data: { ...data, slug: await uniqueSlug(name, id) } }),
      db.productSize.deleteMany({ where: { productId: id, size: { notIn: sizes.map((s) => s.size) } } }),
      ...sizes.map((s) =>
        db.productSize.upsert({
          where: { productId_size: { productId: id, size: s.size } },
          update: { stock: s.stock },
          create: { productId: id, ...s },
        }),
      ),
    ]);
  } else {
    await db.product.create({
      data: { ...data, slug: await uniqueSlug(name), categories: { connect: data.categories.set }, sizes: { create: sizes } },
    });
  }
  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await db.product.delete({ where: { id } });
  revalidatePath("/", "layout");
}

/* ---------- categories ---------- */

export async function saveCategory(id: string | null, _: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const name = text(form, "name");
  if (!name) return { error: "Name is required" };
  const slug = slugify(name);
  const clash = await db.category.findUnique({ where: { slug } });
  if (clash && clash.id !== id) return { error: "A category with this name already exists" };

  const data = { name, slug, image: text(form, "image") || null, sortOrder: Number(text(form, "sortOrder")) || 0 };
  if (id) await db.category.update({ where: { id }, data });
  else await db.category.create({ data });
  revalidatePath("/", "layout");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  await db.category.delete({ where: { id } });
  revalidatePath("/", "layout");
}

/* ---------- orders ---------- */

export async function updateOrderStatus(id: number, form: FormData) {
  await requireAdmin();
  const status = text(form, "status") as OrderStatus;
  if (!Object.values(OrderStatus).includes(status)) return;

  const before = await db.order.findUnique({ where: { id } });
  if (!before || before.status === status) return;

  const order = await db.order.update({
    where: { id },
    data: { status },
    include: { customer: true, items: true },
  });
  // Stock was taken when the order was confirmed (COD) or paid (online), so give it back on cancel.
  const stockWasTaken = order.paymentMethod === "COD" || order.paymentStatus === "PAID";
  if (status === "CANCELLED" && stockWasTaken) {
    for (const i of order.items) {
      if (!i.productId) continue;
      await db.productSize.updateMany({
        where: { productId: i.productId, size: i.size },
        data: { stock: { increment: i.quantity } },
      });
    }
  }
  await sendOrderStatusEmail(order);
  revalidatePath("/admin/orders");
}
