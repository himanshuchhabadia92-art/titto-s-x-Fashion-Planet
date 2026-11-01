import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/site";
import { STATUS_STYLE, cardCls, dateFmt, tdCls, thCls } from "@/app/admin/ui";

export default async function AdminCustomer({ params }: { params: Promise<{ id: string }> }) {
  const customer = await db.customer.findUnique({
    where: { id: (await params).id },
    include: { orders: { orderBy: { createdAt: "desc" }, include: { items: true } } },
  });
  if (!customer) notFound();

  return (
    <>
      <Link href="/admin/customers" className="text-sm underline">
        ← Customers
      </Link>
      <h1 className="text-2xl font-bold mt-3 mb-1">{customer.name}</h1>
      <p className="text-sm text-gray-600 mb-6">
        {customer.email} · {customer.phone}
      </p>

      <h2 className="font-semibold mb-3">Purchase history</h2>
      <div className={cardCls}>
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr>
              <th className={thCls}>Order</th>
              <th className={thCls}>Date</th>
              <th className={thCls}>Items</th>
              <th className={thCls}>Total</th>
              <th className={thCls}>Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {customer.orders.map((o) => (
              <tr key={o.id}>
                <td className={tdCls}>
                  <Link href={`/admin/orders/${o.id}`} className="font-semibold underline">
                    #{o.id}
                  </Link>
                </td>
                <td className={`${tdCls} whitespace-nowrap`}>{dateFmt(o.createdAt)}</td>
                <td className={tdCls}>{o.items.map((i) => `${i.name} (${i.size}) × ${i.quantity}`).join(", ")}</td>
                <td className={tdCls}>{formatPrice(o.total)}</td>
                <td className={tdCls}>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLE[o.status]}`}>{o.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
