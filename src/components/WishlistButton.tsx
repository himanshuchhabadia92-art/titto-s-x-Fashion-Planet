"use client";

import { Heart } from "lucide-react";
import clsx from "clsx";
import { useStore } from "@/components/StoreProvider";

export default function WishlistButton({ productId, className }: { productId: string; className?: string }) {
  const { wishlist, toggleWishlist } = useStore();
  const active = wishlist.includes(productId);
  return (
    <button
      type="button"
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(productId);
      }}
      className={clsx("flex items-center justify-center rounded-full bg-white/90 text-black transition-colors hover:bg-white", className)}
    >
      <Heart size={18} className={active ? "fill-red-500 text-red-500" : ""} />
    </button>
  );
}
