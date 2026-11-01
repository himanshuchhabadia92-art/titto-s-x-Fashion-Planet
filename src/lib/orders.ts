import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { sendOrderConfirmation } from "@/lib/email";

export class OrderError extends Error {}

export type CheckoutInput = {
  items: { productId: string; size: string; quantity: number }[];
  customer: { name: string; email: string; phone: string };
  address: { line: string; city: string; state: string; pincode: string };
  paymentMethod: "ONLINE" | "COD";
};

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** Validates untrusted JSON from the checkout form. Throws OrderError with a user-facing message. */
export function parseCheckout(body: unknown): CheckoutInput {
  const b = (body ?? {}) as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  const customer = {
    name: str(b.customer?.name),
    email: str(b.customer?.email).toLowerCase(),
    phone: str(b.customer?.phone).replace(/\D/g, "").slice(-10),
  };
  const address = {
    line: str(b.address?.line),
    city: str(b.address?.city),
    state: str(b.address?.state),
    pincode: str(b.address?.pincode),
  };

  if (customer.name.length < 2) throw new OrderError("Please enter your name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) throw new OrderError("Please enter a valid email");
  if (!/^\d{10}$/.test(customer.phone)) throw new OrderError("Please enter a valid 10-digit phone number");
  if (address.line.length < 5) throw new OrderError("Please enter your full address");
  if (!address.city || !address.state) throw new OrderError("Please enter your city and state");
  if (!/^\d{6}$/.test(address.pincode)) throw new OrderError("Please enter a valid 6-digit pincode");
  if (b.paymentMethod !== "ONLINE" && b.paymentMethod !== "COD") throw new OrderError("Please choose a payment method");

  if (!Array.isArray(b.items) || b.items.length === 0 || b.items.length > 50) throw new OrderError("Your cart is empty");
  const merged = new Map<string, { productId: string; size: string; quantity: number }>();
  for (const i of b.items) {
    const productId = str(i?.productId);
    const size = str(i?.size);
    const quantity = Number(i?.quantity);
    if (!productId || !size || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      throw new OrderError("Invalid cart item");
    }
    const key = productId + "|" + size;
    const prev = merged.get(key);
    merged.set(key, { productId, size, quantity: (prev?.quantity ?? 0) + quantity });
  }

  return { items: [...merged.values()], customer, address, paymentMethod: b.paymentMethod };
}

/** Takes stock for each line; returns false if any line cannot be fully covered. */
async function takeStock(
  tx: Prisma.TransactionClient,
  items: { productId: string | null; size: string; quantity: number }[],
) {
  for (const i of items) {
    if (!i.productId) continue;
    const r = await tx.productSize.updateMany({
      where: { productId: i.productId, size: i.size, stock: { gte: i.quantity } },
      data: { stock: { decrement: i.quantity } },
    });
    if (r.count === 0) return false;
  }
  return true;
}

/** Re-prices the cart from the database and creates the order. */
export async function createOrder(input: CheckoutInput, loggedInCustomerId?: string | null) {
  const products = await db.product.findMany({
    where: { id: { in: input.items.map((i) => i.productId) } },
    include: { sizes: true },
  });

  const lines = input.items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    const stock = product?.sizes.find((s) => s.size === item.size)?.stock ?? 0;
    if (!product || stock < 1) throw new OrderError(`${product?.name ?? "An item"} (${item.size}) is no longer available`);
    if (stock < item.quantity) throw new OrderError(`Only ${stock} left of ${product.name} (${item.size})`);
    return {
      productId: product.id,
      name: product.name,
      image: product.images[0] ?? null,
      size: item.size,
      price: product.price,
      quantity: item.quantity,
    };
  });
  const total = lines.reduce((n, l) => n + l.price * l.quantity, 0);

  return db.$transaction(async (tx) => {
    // Logged-in customers order under their own account. Guests are matched by email, but a guest
    // can never overwrite the details of someone who has registered with that email.
    const known = loggedInCustomerId
      ? await tx.customer.findUnique({ where: { id: loggedInCustomerId } })
      : await tx.customer.findUnique({ where: { email: input.customer.email } });
    const customer = known
      ? known.passwordHash && !loggedInCustomerId
        ? known
        : await tx.customer.update({ where: { id: known.id }, data: { name: input.customer.name, phone: input.customer.phone } })
      : await tx.customer.create({ data: input.customer });
    const order = await tx.order.create({
      data: {
        customerId: customer.id,
        paymentMethod: input.paymentMethod,
        total,
        shipName: input.customer.name,
        shipPhone: input.customer.phone,
        shipAddress: input.address.line,
        shipCity: input.address.city,
        shipState: input.address.state,
        shipPincode: input.address.pincode,
        items: { create: lines },
      },
    });
    // Cash on delivery is confirmed immediately; online orders take stock once payment is verified.
    if (input.paymentMethod === "COD" && !(await takeStock(tx, lines))) {
      throw new OrderError("Some items just sold out. Please review your cart.");
    }
    return order;
  });
}

export async function sendConfirmationFor(orderId: number) {
  const order = await db.order.findUnique({ where: { id: orderId }, include: { customer: true, items: true } });
  if (order) await sendOrderConfirmation(order);
}

/** Idempotent: safe to call twice for the same payment. */
export async function markPaid(orderId: number, razorpayPaymentId: string) {
  const first = await db.$transaction(async (tx) => {
    const r = await tx.order.updateMany({
      where: { id: orderId, paymentStatus: { not: "PAID" } },
      data: { paymentStatus: "PAID", razorpayPaymentId },
    });
    if (r.count === 0) return false;
    const items = await tx.orderItem.findMany({ where: { orderId } });
    // The customer has already paid, so never fail here: clamp stock at zero if it ran out meanwhile.
    for (const i of items) {
      if (!i.productId) continue;
      if (!(await takeStock(tx, [i]))) {
        await tx.productSize.updateMany({ where: { productId: i.productId, size: i.size }, data: { stock: 0 } });
      }
    }
    return true;
  });
  if (first) await sendConfirmationFor(orderId);
}
