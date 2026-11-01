import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/site";
import type { ProductCardData } from "@/lib/catalog";
import WishlistButton from "@/components/WishlistButton";

export default function ProductCard({ product, dark = false }: { product: ProductCardData; dark?: boolean }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className={`relative aspect-[3/4] mb-3 overflow-hidden ${dark ? "bg-gray-900" : "bg-gray-100"}`}>
        {product.image && (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        )}
        {!product.inStock && (
          <span className="absolute top-3 left-3 bg-white text-black text-[10px] md:text-xs font-black px-3 py-1 uppercase tracking-wider">
            Sold out
          </span>
        )}
        <WishlistButton productId={product.id} className="absolute top-3 right-3 h-9 w-9" />
      </div>
      <h3
        className={`text-xs md:text-sm font-display font-black uppercase tracking-wider mb-1 transition-colors group-hover:text-[#8cc665] ${dark ? "text-white" : "text-foreground"}`}
      >
        {product.name}
      </h3>
      <span className={`text-sm md:text-base font-bold ${dark ? "text-gray-400" : "text-gray-600"}`}>
        {formatPrice(product.price)}
      </span>
    </Link>
  );
}
