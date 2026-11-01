"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, ArrowRight } from "lucide-react";
import { useStore } from "@/components/StoreProvider";
import { useCartItems } from "@/components/useCartItems";
import { formatPrice } from "@/lib/site";

export default function Cart() {
  const { setQuantity, removeFromCart } = useStore();
  const { loading, items, subtotal, hasProblems } = useCartItems();

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-6xl">
      <h1 className="text-4xl font-display font-black uppercase tracking-tight mb-10">Your Cart</h1>

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : items.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-gray-500 mb-6">Your cart is empty.</p>
          <Link href="/collections/all" className="inline-block bg-black text-white px-8 py-3 font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-grow">
            {items.map(({ line, product, available }) => {
              const unavailable = !product || available <= 0;
              return (
                <div key={line.productId + line.size} className="py-6 border-b border-gray-200 flex gap-4">
                  <div className="relative w-24 h-32 bg-gray-200 flex-shrink-0 overflow-hidden">
                    {product?.image && <Image src={product.image} alt={product.name} fill sizes="96px" className="object-cover" />}
                  </div>
                  <div className="flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="font-bold uppercase tracking-wider text-sm">{product?.name ?? "Product no longer available"}</h3>
                      <p className="text-gray-500 text-sm mt-1">Size: {line.size}</p>
                      {product && <p className="font-medium text-sm mt-1">{formatPrice(product.price)}</p>}
                      {unavailable && <p className="text-red-600 text-sm font-bold mt-1">Out of stock - remove to continue</p>}
                      {!unavailable && line.quantity > available && (
                        <p className="text-red-600 text-sm font-bold mt-1">Only {available} left</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      {!unavailable ? (
                        <div className="flex items-center border border-gray-300">
                          <button aria-label="Decrease quantity" onClick={() => setQuantity(line.productId, line.size, line.quantity - 1)} className="px-3 py-1 hover:bg-gray-100">-</button>
                          <span className="px-3 text-sm font-medium">{Math.min(line.quantity, available)}</span>
                          <button
                            aria-label="Increase quantity"
                            disabled={line.quantity >= available}
                            onClick={() => setQuantity(line.productId, line.size, line.quantity + 1)}
                            className="px-3 py-1 hover:bg-gray-100 disabled:opacity-30"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <span />
                      )}
                      <button aria-label="Remove item" onClick={() => removeFromCart(line.productId, line.size)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:w-1/3">
            <div className="bg-gray-50 p-8 border border-gray-200">
              <h2 className="text-lg font-bold uppercase tracking-wider mb-6 border-b border-gray-200 pb-4">Order Summary</h2>
              <div className="space-y-4 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4 mb-8 flex justify-between items-center">
                <span className="font-bold uppercase tracking-wider">Total</span>
                <span className="text-xl font-medium">{formatPrice(subtotal)}</span>
              </div>

              {hasProblems ? (
                <p className="text-red-600 text-sm font-bold text-center">Remove unavailable items to checkout.</p>
              ) : (
                <Link href="/checkout" className="w-full bg-foreground text-background py-4 flex items-center justify-center gap-2 uppercase tracking-widest text-sm font-semibold hover:bg-gray-800 transition-colors">
                  Checkout <ArrowRight size={18} />
                </Link>
              )}
              <div className="mt-4 text-center">
                <Link href="/collections/all" className="text-xs text-gray-500 uppercase tracking-widest hover:text-foreground underline-offset-4 hover:underline">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
