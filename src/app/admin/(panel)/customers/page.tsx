import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/site";
import { cardCls, dateFmt, tdCls, thCls } from "@/app/admin/ui";

export default async function AdminCustomers() {
  const customers = await db.customer.findMany({
    orderBy: { createdAt: "desc" },
    include: { orders: { where: { status: { not: "CANCELLED" } }, select: { total: true } } },
  });

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Customers</h1>
      <div className={cardCls}>
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr>
              <th className={thCls}>Name</th>
              <th className={thCls}>Email</th>
              <th className={thCls}>Phone</th>
              <th className={thCls}>Orders</th>
              <th className={thCls}>Spent</th>
              <th className={thCls}>Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className={tdCls}>
                  <Link href={`/admin/customers/${c.id}`} className="font-semibold underline">
                    {c.name}
                  </Link>
                </td>
                <td className={tdCls}>{c.email}</td>
                <td className={tdCls}>{c.phone}</td>
                <td className={tdCls}>{c.orders.length}</td>
                <td className={tdCls}>{formatPrice(c.orders.reduce((n, o) => n + o.total, 0))}</td>
                <td className={`${tdCls} whitespace-nowrap`}>{dateFmt(c.createdAt)}</td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                  No customers yet. They appear here when someone places an order.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
