import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/site";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const order = await db.order.findUnique({ where: { publicId: (await params).id }, include: { items: true } });
  if (!order) notFound();

  const unpaid = order.paymentMethod === "ONLINE" && order.paymentStatus !== "PAID";

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <h1 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tight mb-2">
        {unpaid ? "Payment pending" : "Thank you!"}
      </h1>
      <p className="text-gray-600 mb-8">
        {unpaid
          ? `Order #${order.id} is waiting for payment.`
          : `Your order #${order.id} is confirmed. A confirmation email is on its way.`}
      </p>

      <div className="border border-gray-200 p-6 space-y-3 text-sm">
        {order.items.map((i) => (
          <div key={i.id} className="flex justify-between gap-4">
            <span>
              {i.name} ({i.size}) × {i.quantity}
            </span>
            <span className="font-medium">{formatPrice(i.price * i.quantity)}</span>
          </div>
        ))}
        <div className="border-t border-gray-200 pt-3 flex justify-between font-bold">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
        <p className="text-gray-600 pt-2">{order.paymentMethod === "COD" ? "Cash on delivery" : "Paid online"}</p>
        <p className="text-gray-600">
          Shipping to {order.shipName}, {order.shipAddress}, {order.shipCity}, {order.shipState} {order.shipPincode}
        </p>
      </div>

      <Link href="/collections/all" className="mt-8 inline-block bg-black text-white px-8 py-3 font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors">
        Continue Shopping
      </Link>
    </div>
  );
}
