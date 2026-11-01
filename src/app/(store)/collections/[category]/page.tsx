import { notFound } from "next/navigation";
import ProductBrowser from "@/components/ProductBrowser";
import { getCollection } from "@/lib/catalog";

export default async function CollectionPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const data = await getCollection(category);
  if (!data) notFound();

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-50 border-b border-gray-200 py-10 md:py-14 px-4 text-center">
        <p className="text-gray-500 text-[11px] uppercase tracking-[0.35em] font-bold mb-3">Collection</p>
        <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight">{data.title}</h1>
      </div>
      <ProductBrowser products={data.products} />
    </div>
  );
}
