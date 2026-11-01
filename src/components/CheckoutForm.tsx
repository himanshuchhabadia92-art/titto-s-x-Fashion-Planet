"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useStore } from "@/components/StoreProvider";
import { useCartItems } from "@/components/useCartItems";
import { formatPrice } from "@/lib/site";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void; on: (event: string, cb: () => void) => void };
  }
}

const input = "w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black bg-white text-black";

export type Prefill = { name: string; email: string; phone: string };

export default function CheckoutForm({ prefill }: { prefill?: Prefill }) {
  const router = useRouter();
  const { clearCart } = useStore();
  const { loading, items, subtotal, hasProblems } = useCartItems();
  const [method, setMethod] = useState<"ONLINE" | "COD">("ONLINE");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "");
    setBusy(true);
    setError("");

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map(({ line }) => ({ productId: line.productId, size: line.size, quantity: line.quantity })),
        customer: { name: get("name"), email: get("email"), phone: get("phone") },
        address: { line: get("line"), city: get("city"), state: get("state"), pincode: get("pincode") },
        paymentMethod: method,
      }),
    }).catch(() => null);
    const data = await res?.json().catch(() => null);

    if (!res?.ok || !data) {
      setError(data?.error ?? "Something went wrong. Please try again.");
      setBusy(false);
      return;
    }

    const done = (publicId: string) => {
      setPlaced(true);
      clearCart();
      router.push(`/order/${publicId}`);
    };

    if (!data.razorpay) return done(data.publicId);

    if (!window.Razorpay) {
      setError("Payment window could not load. Please refresh and try again.");
      setBusy(false);
      return;
    }
    const rzp = new window.Razorpay({
      key: data.razorpay.keyId,
      order_id: data.razorpay.orderId,
      amount: data.razorpay.amount,
      currency: "INR",
      name: "Titto's X Fashion Planet",
      prefill: { name: get("name"), email: get("email"), contact: get("phone") },
      theme: { color: "#000000" },
      handler: async (response: { razorpay_payment_id: string; razorpay_signature: string }) => {
        const v = await fetch("/api/checkout/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId: data.publicId, ...response }),
        }).catch(() => null);
        if (v?.ok) return done(data.publicId);
        setError("We could not verify your payment. If money was deducted, please contact us with your order details.");
        setBusy(false);
      },
      modal: { ondismiss: () => setBusy(false) },
    });
    rzp.on("payment.failed", () => setError("Payment failed. Please try again."));
    rzp.open();
  }

  if (loading || placed) return <div className="container mx-auto px-4 py-16">{placed ? "Order placed, redirecting…" : "Loading…"}</div>;

  if (items.length === 0 || hasProblems) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-6">{items.length === 0 ? "Your cart is empty." : "Some items in your cart are unavailable."}</p>
        <Link href="/cart" className="inline-block bg-black text-white px-8 py-3 font-bold uppercase tracking-wider">
          Back to cart
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-6xl">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <h1 className="text-4xl font-display font-black uppercase tracking-tight mb-10">Checkout</h1>

      <form onSubmit={submit} className="flex flex-col lg:flex-row gap-12">
        <div className="flex-grow space-y-8">
          <section className="space-y-4">
            <h2 className="font-bold uppercase tracking-wider">Contact</h2>
            <input name="name" required defaultValue={prefill?.name} placeholder="Full name" autoComplete="name" className={input} />
            <div className="grid sm:grid-cols-2 gap-4">
              <input name="email" type="email" required defaultValue={prefill?.email} readOnly={!!prefill} placeholder="Email" autoComplete="email" className={input} />
              <input name="phone" type="tel" required defaultValue={prefill?.phone} placeholder="Phone (10 digits)" autoComplete="tel" className={input} />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-bold uppercase tracking-wider">Shipping address</h2>
            <input name="line" required placeholder="Address" autoComplete="street-address" className={input} />
            <div className="grid sm:grid-cols-3 gap-4">
              <input name="city" required placeholder="City" autoComplete="address-level2" className={input} />
              <input name="state" required placeholder="State" autoComplete="address-level1" className={input} />
              <input name="pincode" required inputMode="numeric" maxLength={6} placeholder="Pincode" autoComplete="postal-code" className={input} />
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-bold uppercase tracking-wider">Payment</h2>
            <label className="flex items-start gap-3 border border-gray-300 p-4 cursor-pointer has-[:checked]:border-black">
              <input type="radio" name="method" checked={method === "ONLINE"} onChange={() => setMethod("ONLINE")} className="mt-1 accent-black" />
              <span>
                <span className="font-bold block">Pay online</span>
                <span className="text-sm text-gray-500">UPI, Credit / Debit cards, Netbanking (Razorpay)</span>
              </span>
            </label>
            <label className="flex items-start gap-3 border border-gray-300 p-4 cursor-pointer has-[:checked]:border-black">
              <input type="radio" name="method" checked={method === "COD"} onChange={() => setMethod("COD")} className="mt-1 accent-black" />
              <span>
                <span className="font-bold block">Cash on delivery</span>
                <span className="text-sm text-gray-500">Pay when your order arrives</span>
              </span>
            </label>
          </section>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-gray-50 p-8 border border-gray-200 text-black">
            <h2 className="text-lg font-bold uppercase tracking-wider mb-6 border-b border-gray-200 pb-4">Order Summary</h2>
            <ul className="space-y-3 text-sm mb-6">
              {items.map(({ line, product }) => (
                <li key={line.productId + line.size} className="flex justify-between gap-4">
                  <span>
                    {product!.name} ({line.size}) × {line.quantity}
                  </span>
                  <span className="font-medium">{formatPrice(product!.price * line.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t border-gray-200 pt-4 mb-6 flex justify-between items-center">
              <span className="font-bold uppercase tracking-wider">Total</span>
              <span className="text-xl font-medium">{formatPrice(subtotal)}</span>
            </div>
            {error && <p className="text-red-600 text-sm font-bold mb-4">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-black text-white py-4 uppercase tracking-widest text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {busy ? "Please wait…" : method === "COD" ? "Place order" : "Pay now"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
