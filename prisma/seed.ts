import "dotenv/config";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.TITTOS_DATABASE_URL }),
});

type Catalog = {
  categories: { name: string; slug: string; image: string | null; sortOrder: number }[];
  products: {
    name: string;
    slug: string;
    price: number;
    description: string;
    images: string[];
    categories: string[];
    sizes: string[];
  }[];
};

async function main() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env");
  await db.admin.upsert({
    where: { email },
    update: { passwordHash: await bcrypt.hash(password, 10) },
    create: { email, passwordHash: await bcrypt.hash(password, 10) },
  });

  // Demo catalog (men's wear, images hosted on Cloudinary): only inserted into an empty database.
  if ((await db.product.count()) > 0) return;
  const catalog: Catalog = JSON.parse(fs.readFileSync(path.join(__dirname, "demo-catalog.json"), "utf8"));

  for (const c of catalog.categories) await db.category.upsert({ where: { slug: c.slug }, update: {}, create: c });

  // create round-robin across categories so "New arrivals" shows a mix
  const byCat = new Map<string, Catalog["products"]>();
  for (const p of catalog.products) byCat.set(p.categories[0], [...(byCat.get(p.categories[0]) ?? []), p]);
  const lists = [...byCat.values()];
  const ordered: Catalog["products"] = [];
  for (let i = 0; ordered.length < catalog.products.length; i++) for (const l of lists) if (l[i]) ordered.push(l[i]);

  let n = 0;
  for (const p of ordered) {
    n++;
    await db.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        price: p.price,
        description: p.description,
        images: p.images,
        categories: { connect: p.categories.map((slug) => ({ slug })) },
        sizes: {
          create: p.sizes.map((size, i) => ({
            size,
            // a few sizes (and one whole product) are sold out so the availability filter has something to show
            stock: n === 11 ? 0 : (i + n) % 5 === 0 ? 0 : 4 + ((i * n) % 9),
          })),
        },
      },
    });
  }
}

main().finally(() => db.$disconnect());
