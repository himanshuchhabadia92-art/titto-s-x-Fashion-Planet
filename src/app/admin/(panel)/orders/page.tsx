import Link from "next/link";
import { db } from "@/lib/db";
import { OrderStatus } from "@/generated/prisma/client";
import { formatPrice } from "@/lib/site";
import { STATUS_STYLE, cardCls, dateFmt, tdCls, thCls } from "@/app/admin/ui";

export default async function AdminOrders({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const filter = Object.values(OrderStatus).find((s) => s === status);

  const orders = await db.order.findMany({
    where: filter ? { status: filter } : undefined,
    orderBy: { createdAt: "desc" },
    include: { customer: true },
  });

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <div className="flex flex-wrap gap-2 mb-6 text-sm">
        {[undefined, ...Object.values(OrderStatus)].map((s) => (
          <Link
            key={s ?? "all"}
            href={s ? `/admin/orders?status=${s}` : "/admin/orders"}
            className={`px-3 py-1 rounded-full border ${filter === s ? "bg-black text-white border-black" : "border-gray-300 bg-white"}`}
          >
            {s ?? "All"}
          </Link>
        ))}
      </div>

      <div className={cardCls}>
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr>
              <th className={thCls}>Order</th>
              <th className={thCls}>Date</th>
              <th className={thCls}>Customer</th>
              <th className={thCls}>Total</th>
              <th className={thCls}>Payment</th>
              <th className={thCls}>Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className={tdCls}>
                  <Link href={`/admin/orders/${o.id}`} className="font-semibold underline">
                    #{o.id}
                  </Link>
                </td>
                <td className={`${tdCls} whitespace-nowrap`}>{dateFmt(o.createdAt)}</td>
                <td className={tdCls}>{o.customer.name}</td>
                <td className={tdCls}>{formatPrice(o.total)}</td>
                <td className={tdCls}>
                  {o.paymentMethod === "COD" ? "COD" : "Online"}
                  {o.paymentMethod === "ONLINE" && (
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${STATUS_STYLE[o.paymentStatus] ?? "bg-gray-100"}`}>
                      {o.paymentStatus === "PENDING" ? "UNPAID" : o.paymentStatus}
                    </span>
                  )}
                </td>
                <td className={tdCls}>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLE[o.status]}`}>{o.status}</span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
