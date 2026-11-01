import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { OrderStatus } from "@/generated/prisma/client";
import { formatPrice } from "@/lib/site";
import { updateOrderStatus } from "@/app/admin/actions";
import { STATUS_STYLE, btnCls, dateFmt, inputCls } from "@/app/admin/ui";

export default async function AdminOrder({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const order = await db.order.findUnique({ where: { id }, include: { customer: true, items: true } });
  if (!order) notFound();

  return (
    <>
      <Link href="/admin/orders" className="text-sm underline">
        ← Orders
      </Link>
      <div className="flex flex-wrap items-center gap-3 mt-3 mb-6">
        <h1 className="text-2xl font-bold">Order #{order.id}</h1>
        <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLE[order.status]}`}>{order.status}</span>
        <span className="text-sm text-gray-500">{dateFmt(order.createdAt)}</span>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="font-semibold mb-4">Items</h2>
          <ul className="divide-y divide-gray-100 text-sm">
            {order.items.map((i) => (
              <li key={i.id} className="py-3 flex justify-between gap-4">
                <span>
                  {i.name} <span className="text-gray-500">({i.size}) × {i.quantity}</span>
                </span>
                <span>{formatPrice(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-200 mt-2 pt-3 flex justify-between font-bold">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="space-y-6">
          <form
            action={updateOrderStatus.bind(null, order.id)}
            className="bg-white border border-gray-200 rounded-lg p-6 space-y-3"
          >
            <h2 className="font-semibold">Update status</h2>
            <select name="status" defaultValue={order.status} className={inputCls}>
              {Object.values(OrderStatus).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button className={`${btnCls} w-full`}>Save</button>
            <p className="text-xs text-gray-500">The customer is emailed when the status changes.</p>
          </form>

          <div className="bg-white border border-gray-200 rounded-lg p-6 text-sm space-y-1">
            <h2 className="font-semibold mb-2">Payment</h2>
            <p>{order.paymentMethod === "COD" ? "Cash on delivery" : "Online (Razorpay)"}</p>
            {order.paymentMethod === "ONLINE" && (
              <>
                <p>Status: {order.paymentStatus === "PENDING" ? "Awaiting payment" : order.paymentStatus}</p>
                {order.razorpayPaymentId && <p className="text-gray-500 break-all">Payment ID: {order.razorpayPaymentId}</p>}
              </>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 text-sm space-y-1">
            <h2 className="font-semibold mb-2">Customer</h2>
            <Link href={`/admin/customers/${order.customerId}`} className="underline font-semibold">
              {order.customer.name}
            </Link>
            <p>{order.customer.email}</p>
            <p>{order.shipPhone}</p>
            <h2 className="font-semibold mt-4 mb-2">Ship to</h2>
            <p>{order.shipName}</p>
            <p>{order.shipAddress}</p>
            <p>
              {order.shipCity}, {order.shipState} {order.shipPincode}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
