import { Search } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { db } from "@/lib/db";
import { toCard } from "@/lib/catalog";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? "").trim().slice(0, 100);

  const products = q
    ? await db.product.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { categories: { some: { name: { contains: q, mode: "insensitive" } } } },
          ],
        },
        orderBy: { createdAt: "desc" },
        include: { sizes: { orderBy: { id: "asc" } } },
      })
    : [];

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-6xl">
      <h1 className="text-4xl font-display font-black uppercase tracking-tight mb-6">Search</h1>
      <form action="/search" className="flex max-w-xl mb-10">
        <input
          name="q"
          defaultValue={q}
          autoFocus
          placeholder="Search products"
          className="flex-grow border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black bg-white text-black"
        />
        <button aria-label="Search" className="bg-black text-white px-5 hover:bg-gray-800 transition-colors">
          <Search size={20} />
        </button>
      </form>

      {q && (
        <p className="text-sm text-gray-500 mb-6">
          {products.length} result{products.length === 1 ? "" : "s"} for &ldquo;{q}&rdquo;
        </p>
      )}
      {products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {products.map((p) => (
            <ProductCard key={p.id} product={toCard(p)} />
          ))}
        </div>
      )}
    </div>
  );
}
