import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import { logout } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const nav = [
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/customers", label: "Customers" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <header className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="font-bold">Titto&apos;s Admin</span>
          <nav className="flex gap-4 text-sm flex-1">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="text-gray-300 hover:text-white">
                {n.label}
              </Link>
            ))}
          </nav>
          <Link href="/" target="_blank" className="text-sm text-gray-300 hover:text-white">
            View site
          </Link>
          <form action={logout}>
            <button className="text-sm text-gray-300 hover:text-white">Log out</button>
          </form>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
