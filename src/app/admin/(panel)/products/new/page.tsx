import { db } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProduct() {
  const categories = await db.category.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } });
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Add product</h1>
      <ProductForm categories={categories} />
    </>
  );
}
