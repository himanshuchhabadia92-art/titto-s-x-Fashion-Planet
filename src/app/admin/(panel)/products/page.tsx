import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/site";
import { deleteProduct } from "@/app/admin/actions";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { btnCls, cardCls, tdCls, thCls } from "@/app/admin/ui";

export default async function AdminProducts() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { categories: true, sizes: true },
  });

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/products/new" className={btnCls}>
          Add product
        </Link>
      </div>

      <div className={cardCls}>
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr>
              <th className={thCls}>Product</th>
              <th className={thCls}>Price</th>
              <th className={thCls}>Categories</th>
              <th className={thCls}>Stock</th>
              <th className={thCls}></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p.id}>
                <td className={tdCls}>
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-11 bg-gray-100 shrink-0 overflow-hidden rounded">
                      {p.images[0] && <Image src={p.images[0]} alt="" fill sizes="44px" className="object-cover" />}
                    </div>
                    <span className="font-semibold">{p.name}</span>
                  </div>
                </td>
                <td className={tdCls}>{formatPrice(p.price)}</td>
                <td className={tdCls}>{p.categories.map((c) => c.name).join(", ") || "-"}</td>
                <td className={tdCls}>{p.sizes.reduce((n, s) => n + s.stock, 0)}</td>
                <td className={`${tdCls} text-right whitespace-nowrap`}>
                  <Link href={`/admin/products/${p.id}`} className="font-semibold underline mr-4">
                    Edit
                  </Link>
                  <form action={deleteProduct.bind(null, p.id)} className="inline">
                    <ConfirmButton message={`Delete "${p.name}"?`} className="text-red-600 font-semibold underline">
                      Delete
                    </ConfirmButton>
                  </form>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
