import { db } from "@/lib/db";

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  sizes: { size: string; stock: number }[];
  inStock: boolean;
  createdAt: number;
};

const cardInclude = { sizes: { orderBy: { id: "asc" } } } as const;

type ProductWithSizes = {
  id: string;
  slug: string;
  name: string;
  price: number;
  images: string[];
  createdAt: Date;
  sizes: { size: string; stock: number }[];
};

export function toCard(p: ProductWithSizes): ProductCardData {
  const sizes = p.sizes.map((s) => ({ size: s.size, stock: s.stock }));
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    image: p.images[0] ?? null,
    sizes,
    inStock: sizes.some((s) => s.stock > 0),
    createdAt: p.createdAt.getTime(),
  };
}

export const getCategories = () => db.category.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });

export async function getNewArrivals(take = 8) {
  const products = await db.product.findMany({ orderBy: { createdAt: "desc" }, take, include: cardInclude });
  return products.map(toCard);
}

/** `all` and `new-arrivals` are built-in collections, everything else is a category slug. */
export async function getCollection(slug: string) {
  if (slug === "all") {
    const products = await db.product.findMany({ orderBy: { createdAt: "desc" }, include: cardInclude });
    return { title: "All Products", products: products.map(toCard) };
  }
  if (slug === "new-arrivals") {
    return { title: "New Arrivals", products: await getNewArrivals(12) };
  }
  const category = await db.category.findUnique({
    where: { slug },
    include: { products: { orderBy: { createdAt: "desc" }, include: cardInclude } },
  });
  if (!category) return null;
  return { title: category.name, products: category.products.map(toCard) };
}
