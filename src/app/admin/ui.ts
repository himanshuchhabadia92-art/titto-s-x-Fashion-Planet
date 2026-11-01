export const inputCls =
  "w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-black focus:outline-none focus:border-black";
export const btnCls =
  "inline-flex items-center justify-center rounded-md bg-black text-white px-4 py-2 text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50";
export const btnGhostCls =
  "inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-100 transition-colors";
export const thCls = "text-left text-xs font-semibold uppercase tracking-wider text-gray-500 px-4 py-3";
export const tdCls = "px-4 py-3 text-sm";
export const cardCls = "bg-white border border-gray-200 rounded-lg overflow-x-auto";

export const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  PAID: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
};

export const dateFmt = (d: Date) =>
  d.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
