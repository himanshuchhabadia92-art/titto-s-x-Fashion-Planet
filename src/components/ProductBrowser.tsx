"use client";

import { useMemo, useState } from "react";
import type { ProductCardData } from "@/lib/catalog";
import { SIZE_OPTIONS } from "@/lib/site";
import ProductCard from "@/components/ProductCard";

const PRICE_RANGES = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 — ₹1,000", min: 500, max: 1000 },
  { label: "₹1,000 — ₹1,500", min: 1000, max: 1500 },
  { label: "₹1,500 — ₹2,000", min: 1500, max: 2000 },
  { label: "Above ₹2,000", min: 2000, max: Infinity },
];

const SORTS = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "name-asc", label: "A — Z" },
  { value: "name-desc", label: "Z — A" },
];

const pill = (open: boolean) =>
  `flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-colors border whitespace-nowrap ${
    open ? "bg-black text-white border-black" : "text-black bg-white hover:border-black border-gray-300"
  }`;
const panel = "absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl min-w-[190px] py-2 z-50";
const row = "flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-black text-xs font-bold uppercase tracking-wider";

export default function ProductBrowser({ products }: { products: ProductCardData[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const [availability, setAvailability] = useState<{ in: boolean; out: boolean }>({ in: false, out: false });
  const [priceIdx, setPriceIdx] = useState<number[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [sort, setSort] = useState("newest");

  const availableSizes = useMemo(() => {
    const present = new Set(products.flatMap((p) => p.sizes.map((s) => s.size)));
    return SIZE_OPTIONS.filter((s) => present.has(s));
  }, [products]);

  const visible = useMemo(() => {
    const list = products.filter((p) => {
      if (availability.in !== availability.out && (availability.in ? !p.inStock : p.inStock)) return false;
      if (priceIdx.length && !priceIdx.some((i) => p.price >= PRICE_RANGES[i].min && p.price < PRICE_RANGES[i].max)) return false;
      if (sizes.length && !p.sizes.some((s) => s.stock > 0 && sizes.includes(s.size))) return false;
      return true;
    });
    const sorters: Record<string, (a: ProductCardData, b: ProductCardData) => number> = {
      newest: (a, b) => b.createdAt - a.createdAt,
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      "name-asc": (a, b) => a.name.localeCompare(b.name),
      "name-desc": (a, b) => b.name.localeCompare(a.name),
    };
    return [...list].sort(sorters[sort]);
  }, [products, availability, priceIdx, sizes, sort]);

  const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const sortLabel = SORTS.find((s) => s.value === sort)?.label;

  return (
    <>
      <div className="bg-white border-b border-gray-200 py-3 px-4 relative z-30">
        <div className="container mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-gray-500 text-xs font-black uppercase tracking-widest">Filter:</span>

            <div className="relative">
              <button onClick={() => setOpen(open === "availability" ? null : "availability")} className={pill(open === "availability")}>
                Availability ▾
              </button>
              {open === "availability" && (
                <div className={`${panel} left-0`}>
                  <label className={row}>
                    <input type="checkbox" className="accent-black w-4 h-4" checked={availability.in} onChange={() => setAvailability((a) => ({ ...a, in: !a.in }))} />
                    In Stock
                  </label>
                  <label className={row}>
                    <input type="checkbox" className="accent-black w-4 h-4" checked={availability.out} onChange={() => setAvailability((a) => ({ ...a, out: !a.out }))} />
                    Out of Stock
                  </label>
                </div>
              )}
            </div>

            <div className="relative">
              <button onClick={() => setOpen(open === "price" ? null : "price")} className={pill(open === "price")}>
                Price ▾
              </button>
              {open === "price" && (
                <div className={`${panel} left-0`}>
                  {PRICE_RANGES.map((r, i) => (
                    <label key={r.label} className={row}>
                      <input type="checkbox" className="accent-black w-4 h-4" checked={priceIdx.includes(i)} onChange={() => setPriceIdx((p) => toggle(p, i))} />
                      {r.label}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {availableSizes.length > 0 && (
              <div className="relative">
                <button onClick={() => setOpen(open === "size" ? null : "size")} className={pill(open === "size")}>
                  Size ▾
                </button>
                {open === "size" && (
                  <div className={`${panel} left-0`}>
                    {availableSizes.map((s) => (
                      <label key={s} className={row}>
                        <input type="checkbox" className="accent-black w-4 h-4" checked={sizes.includes(s)} onChange={() => setSizes((x) => toggle(x, s))} />
                        {s}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-xs font-black uppercase tracking-widest">Sort:</span>
            <div className="relative">
              <button onClick={() => setOpen(open === "sort" ? null : "sort")} className={pill(open === "sort")}>
                {sortLabel} ▾
              </button>
              {open === "sort" && (
                <div className={`${panel} right-0`}>
                  {SORTS.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => {
                        setSort(s.value);
                        setOpen(null);
                      }}
                      className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 text-xs font-bold uppercase tracking-wider ${sort === s.value ? "text-black underline" : "text-gray-600"}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className="text-gray-500 text-xs font-bold uppercase tracking-widest hidden md:block">{visible.length} products</span>
          </div>
        </div>
        {open && <div className="fixed inset-0 z-[-1]" onClick={() => setOpen(null)} />}
      </div>

      <div className="bg-white">
        <div className="container mx-auto max-w-7xl px-4 py-12 md:py-16 min-h-[40vh]">
          {visible.length === 0 ? (
            <p className="text-center text-gray-500 font-bold uppercase tracking-widest">No products match your filters.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {visible.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
