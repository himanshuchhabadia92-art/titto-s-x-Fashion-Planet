import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { SIZE_OPTIONS } from "@/lib/site";
import ProductDetail from "@/components/ProductDetail";

async function getProduct(slug: string) {
  return db.product.findUnique({ where: { slug }, include: { sizes: true } });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  return { title: product ? `${product.name} - Titto's X Fashion Planet` : "Product not found" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();

  const sizes = [...product.sizes]
    .sort((a, b) => SIZE_OPTIONS.indexOf(a.size) - SIZE_OPTIONS.indexOf(b.size))
    .map((s) => ({ size: s.size, stock: s.stock }));

  return (
    <ProductDetail
      product={{
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.images,
        sizes,
      }}
    />
  );
}
