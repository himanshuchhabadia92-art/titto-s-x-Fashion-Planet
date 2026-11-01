"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

/** Uploads to Cloudinary through /api/admin/upload and submits the resulting URLs as hidden inputs. */
export default function ImageUploader({
  name,
  initial,
  multiple = false,
}: {
  name: string;
  initial: string[];
  multiple?: boolean;
}) {
  const [urls, setUrls] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    setBusy(true);
    setError("");
    const added: string[] = [];
    for (const file of files) {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body }).catch(() => null);
      const data = await res?.json().catch(() => null);
      if (res?.ok && data?.url) added.push(data.url);
      else setError(data?.error ?? "Upload failed");
    }
    setUrls((u) => (multiple ? [...u, ...added] : added.length ? added : u));
    setBusy(false);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-3">
        {urls.map((url) => (
          <div key={url} className="relative h-28 w-24 border border-gray-200 rounded overflow-hidden">
            <Image src={url} alt="" fill sizes="96px" className="object-cover" />
            <button
              type="button"
              aria-label="Remove image"
              onClick={() => setUrls((u) => u.filter((x) => x !== url))}
              className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5"
            >
              <X size={14} />
            </button>
            <input type="hidden" name={name} value={url} />
          </div>
        ))}
      </div>
      <input type="file" accept="image/*" multiple={multiple} onChange={onFiles} disabled={busy} className="text-sm" />
      {busy && <p className="text-sm text-gray-500 mt-1">Uploading…</p>}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}
