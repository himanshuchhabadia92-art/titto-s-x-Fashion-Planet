"use client";

import { useActionState } from "react";
import Link from "next/link";
import { saveProduct } from "@/app/admin/actions";
import { btnCls, btnGhostCls, inputCls } from "@/app/admin/ui";
import { SIZE_OPTIONS } from "@/lib/site";
import ImageUploader from "@/components/admin/ImageUploader";

type Props = {
  product?: {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    categoryIds: string[];
    stock: Record<string, number>;
  };
  categories: { id: string; name: string }[];
};

export default function ProductForm({ product, categories }: Props) {
  const [state, action, pending] = useActionState(saveProduct.bind(null, product?.id ?? null), undefined);

  return (
    <form action={action} className="bg-white border border-gray-200 rounded-lg p-6 space-y-6 max-w-2xl">
      <label className="block">
        <span className="text-sm font-semibold">Name</span>
        <input name="name" required defaultValue={product?.name} className={`${inputCls} mt-1`} />
      </label>

      <label className="block">
        <span className="text-sm font-semibold">Price (₹)</span>
        <input name="price" type="number" min={1} step={1} required defaultValue={product?.price} className={`${inputCls} mt-1`} />
      </label>

      <label className="block">
        <span className="text-sm font-semibold">Description</span>
        <textarea name="description" rows={4} defaultValue={product?.description} className={`${inputCls} mt-1`} />
      </label>

      <div>
        <span className="text-sm font-semibold block mb-2">Images</span>
        <ImageUploader name="images" initial={product?.images ?? []} multiple />
      </div>

      <div>
        <span className="text-sm font-semibold block mb-2">Categories</span>
        <div className="flex flex-wrap gap-4">
          {categories.map((c) => (
            <label key={c.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="categories" value={c.id} defaultChecked={product?.categoryIds.includes(c.id)} />
              {c.name}
            </label>
          ))}
          {categories.length === 0 && <p className="text-sm text-gray-500">Create a category first.</p>}
        </div>
      </div>

      <div>
        <span className="text-sm font-semibold block">Stock per size</span>
        <p className="text-xs text-gray-500 mb-3">Leave a size empty if you don&apos;t sell it. Enter 0 for sold out.</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {SIZE_OPTIONS.map((size) => (
            <label key={size} className="text-sm">
              <span className="font-semibold">{size}</span>
              <input
                name={`stock_${size}`}
                type="number"
                min={0}
                step={1}
                defaultValue={product?.stock[size]}
                className={`${inputCls} mt-1`}
              />
            </label>
          ))}
        </div>
      </div>

      {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}
      <div className="flex gap-3">
        <button disabled={pending} className={btnCls}>
          {pending ? "Saving…" : "Save product"}
        </button>
        <Link href="/admin/products" className={btnGhostCls}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
