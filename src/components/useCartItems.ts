"use client";

import { useEffect, useState } from "react";
import { useStore, type CartLine } from "@/components/StoreProvider";
import type { ProductCardData } from "@/lib/catalog";

export type CartItem = {
  line: CartLine;
  product: ProductCardData | null;
  /** units available for this size (0 when the product or size no longer exists) */
  available: number;
};

/** Joins the visitor's cart with fresh product data from the server. */
export function useCartItems() {
  const { cart, ready } = useStore();
  const [products, setProducts] = useState<ProductCardData[] | null>(null);
  const ids = [...new Set(cart.map((l) => l.productId))].sort().join(",");

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

  const loading = !ready || products === null;
  const items: CartItem[] = loading
    ? []
    : cart.map((line) => {
        const product = products.find((p) => p.id === line.productId) ?? null;
        const available = product?.sizes.find((s) => s.size === line.size)?.stock ?? 0;
        return { line, product, available };
      });
  const valid = items.filter((i) => i.product && i.available > 0);
  const subtotal = valid.reduce((n, i) => n + i.product!.price * Math.min(i.line.quantity, i.available), 0);

  return { loading, items, subtotal, hasProblems: valid.length !== items.length };
}
