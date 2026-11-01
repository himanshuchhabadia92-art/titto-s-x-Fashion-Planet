"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "@/components/StoreProvider";
import ProductCard from "@/components/ProductCard";
import type { ProductCardData } from "@/lib/catalog";

export default function Wishlist() {
  const { wishlist, ready } = useStore();
  const [products, setProducts] = useState<ProductCardData[] | null>(null);
  const ids = wishlist.join(",");

  useEffect(() => {
    if (!ready) return;
    if (!ids) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProducts([]);
      return;
    }
    let cancelled = false;
    fetch(`/api/products?ids=${ids}`)
      .then((r) => r.json())
      .then((data: ProductCardData[]) => !cancelled && setProducts(data))
      .catch(() => !cancelled && setProducts([]));
    return () => {
      cancelled = true;
    };
  }, [ready, ids]);

  // Items removed from the wishlist disappear immediately, before any refetch.
  const shown = (products ?? []).filter((p) => wishlist.includes(p.id));

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-6xl">
      <h1 className="text-4xl font-display font-black uppercase tracking-tight mb-10">Wishlist</h1>
      {products === null ? (
        <p className="text-gray-500">Loading…</p>
      ) : shown.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-gray-500 mb-6">Your wishlist is empty.</p>
          <Link href="/collections/all" className="inline-block bg-black text-white px-8 py-3 font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {shown.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
