export const SITE_NAME = "Titto's X Fashion Planet";
export const INSTAGRAM_URL = "https://www.instagram.com/fashion_planet92";
export const INSTAGRAM_HANDLE = "@fashion_planet92";
export const PHONE_DISPLAY = "+91 97996 38289";
export const PHONE_TEL = "+919799638289";
export const WHATSAPP_URL = "https://wa.me/919799638289";

export const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36"];

export const formatPrice = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
