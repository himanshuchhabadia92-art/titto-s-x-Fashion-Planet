"use client";

import { useActionState } from "react";
import Link from "next/link";
import { saveCategory } from "@/app/admin/actions";
import { btnCls, btnGhostCls, inputCls } from "@/app/admin/ui";
import ImageUploader from "@/components/admin/ImageUploader";

type Props = { category?: { id: string; name: string; image: string | null; sortOrder: number } };

export default function CategoryForm({ category }: Props) {
  const [state, action, pending] = useActionState(saveCategory.bind(null, category?.id ?? null), undefined);

  return (
    <form action={action} className="bg-white border border-gray-200 rounded-lg p-6 space-y-6 max-w-xl">
      <label className="block">
        <span className="text-sm font-semibold">Name</span>
        <input name="name" required defaultValue={category?.name} className={`${inputCls} mt-1`} />
      </label>

      <label className="block">
        <span className="text-sm font-semibold">Display order</span>
        <input name="sortOrder" type="number" step={1} defaultValue={category?.sortOrder ?? 0} className={`${inputCls} mt-1`} />
        <span className="text-xs text-gray-500">Lower numbers appear first in the menu and on the homepage.</span>
      </label>

      <div>
        <span className="text-sm font-semibold block mb-2">Image (shown on the homepage)</span>
        <ImageUploader name="image" initial={category?.image ? [category.image] : []} />
      </div>

      {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}
      <div className="flex gap-3">
        <button disabled={pending} className={btnCls}>
          {pending ? "Saving…" : "Save category"}
        </button>
        <Link href="/admin/categories" className={btnGhostCls}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
