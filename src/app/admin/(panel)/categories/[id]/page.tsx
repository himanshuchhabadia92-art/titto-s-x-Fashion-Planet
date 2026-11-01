import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import CategoryForm from "@/components/admin/CategoryForm";

export default async function EditCategory({ params }: { params: Promise<{ id: string }> }) {
  const category = await db.category.findUnique({ where: { id: (await params).id } });
  if (!category) notFound();

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Edit category</h1>
      <CategoryForm category={category} />
    </>
  );
}
