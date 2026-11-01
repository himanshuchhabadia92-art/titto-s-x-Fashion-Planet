"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import clsx from "clsx";
import { useStore } from "@/components/StoreProvider";
import { formatPrice } from "@/lib/site";

type Props = {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    sizes: { size: string; stock: number }[];
  };
};

export default function ProductDetail({ product }: Props) {
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const [active, setActive] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  const inStock = product.sizes.some((s) => s.stock > 0);
  const wished = wishlist.includes(product.id);

  function handleAdd() {
    if (!size) {
      setError("Please select a size");
      return;
    }
    addToCart(product.id, size);
    setError("");
    setAdded(true);
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-14 max-w-6xl grid md:grid-cols-2 gap-8 md:gap-14">
      <div>
        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
          {product.images[active] && (
            <Image src={product.images[active]} alt={product.name} fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          )}
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-3 mt-3 overflow-x-auto">
            {product.images.map((img, i) => (
              <button
                key={img}
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1}`}
                className={clsx("relative h-24 w-20 shrink-0 border-2 overflow-hidden", i === active ? "border-foreground" : "border-transparent")}
              >
                <Image src={img} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <h1 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tight">{product.name}</h1>
        <p className="text-2xl font-bold mt-3">{formatPrice(product.price)}</p>

        <div className="mt-8">
          <p className="text-xs font-black uppercase tracking-widest mb-3">Size</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s.size}
                disabled={s.stock <= 0}
                onClick={() => {
                  setSize(s.size);
                  setError("");
                  setAdded(false);
                }}
                className={clsx(
                  "min-w-12 px-4 py-2.5 border text-sm font-bold uppercase transition-colors",
                  s.stock <= 0 && "opacity-30 line-through cursor-not-allowed",
                  size === s.size ? "bg-foreground text-background border-foreground" : "border-gray-400 hover:border-foreground",
                )}
              >
                {s.size}
              </button>
            ))}
          </div>
          {error && <p className="text-red-600 text-sm font-bold mt-3">{error}</p>}
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={handleAdd}
            disabled={!inStock}
            className="flex-1 bg-[#8cc665] text-black border border-black py-4 font-black uppercase tracking-widest hover:bg-[#7ab056] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {inStock ? "Add to cart" : "Sold out"}
          </button>
          <button
            onClick={() => toggleWishlist(product.id)}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            className="w-14 border border-black flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <Heart size={22} className={wished ? "fill-red-500 text-red-500" : ""} />
          </button>
        </div>

        {added && (
          <p className="mt-4 text-sm font-bold">
            Added to cart.{" "}
            <Link href="/cart" className="underline">
              View cart
            </Link>
          </p>
        )}

        {product.description && <p className="mt-10 text-gray-700 leading-relaxed whitespace-pre-line">{product.description}</p>}
      </div>
    </div>
  );
}
