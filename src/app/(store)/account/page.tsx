import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentCustomer } from "@/lib/customer";
import { formatPrice } from "@/lib/site";
import { logoutCustomer } from "@/app/account/actions";

export default async function AccountPage() {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/account/login");

  const orders = await db.order.findMany({
    where: { customerId: customer.id, createdAt: { gte: customer.registeredAt ?? new Date() } },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="flex items-start justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-display font-black uppercase tracking-tight">My account</h1>
          <p className="text-gray-600 mt-2">{customer.name}</p>
          <p className="text-gray-600 text-sm">
            {customer.email} · {customer.phone}
          </p>
        </div>
        <form action={logoutCustomer}>
          <button className="border border-black px-5 py-2 text-sm font-bold uppercase tracking-wider hover:bg-gray-100 transition-colors">Log out</button>
        </form>
      </div>

      <h2 className="font-bold uppercase tracking-wider mb-4">Your orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">
          No orders yet.{" "}
          <Link href="/collections/all" className="underline font-bold">
            Start shopping
          </Link>
        </p>
      ) : (
        <ul className="space-y-4">
          {orders.map((o) => (
            <li key={o.id} className="border border-gray-200 p-5">
              <div className="flex justify-between gap-4 font-bold">
                <Link href={`/order/${o.publicId}`} className="underline">
                  Order #{o.id}
                </Link>
                <span>{formatPrice(o.total)}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {o.createdAt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} ·{" "}
                {o.paymentMethod === "ONLINE" && o.paymentStatus !== "PAID" ? "Awaiting payment" : o.status}
              </p>
              <p className="text-sm text-gray-700 mt-2">{o.items.map((i) => `${i.name} (${i.size}) × ${i.quantity}`).join(", ")}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
