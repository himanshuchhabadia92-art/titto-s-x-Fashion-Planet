import Link from "next/link";
import { db } from "@/lib/db";
import { deleteCategory } from "@/app/admin/actions";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { btnCls, cardCls, tdCls, thCls } from "@/app/admin/ui";

export default async function AdminCategories() {
  const categories = await db.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Link href="/admin/categories/new" className={btnCls}>
          Add category
        </Link>
      </div>

      <div className={cardCls}>
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr>
              <th className={thCls}>Name</th>
              <th className={thCls}>Order</th>
              <th className={thCls}>Products</th>
              <th className={thCls}></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((c) => (
              <tr key={c.id}>
                <td className={`${tdCls} font-semibold`}>{c.name}</td>
                <td className={tdCls}>{c.sortOrder}</td>
                <td className={tdCls}>{c._count.products}</td>
                <td className={`${tdCls} text-right whitespace-nowrap`}>
                  <Link href={`/admin/categories/${c.id}`} className="font-semibold underline mr-4">
                    Edit
                  </Link>
                  <form action={deleteCategory.bind(null, c.id)} className="inline">
                    <ConfirmButton message={`Delete "${c.name}"? Its products are kept.`} className="text-red-600 font-semibold underline">
                      Delete
                    </ConfirmButton>
                  </form>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">
                  No categories yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
