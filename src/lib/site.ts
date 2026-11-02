export const SITE_NAME = "Titto's X Fashion Planet";
export const INSTAGRAM_URL = "https://www.instagram.com/fashion_planet92";
export const INSTAGRAM_HANDLE = "@fashion_planet92";
export const PHONE_DISPLAY = "+91 97996 38289";
export const PHONE_TEL = "+919799638289";
export const WHATSAPP_URL = "https://wa.me/919799638289";

// Business details used on the Contact page and in the policies.
// TODO(client): fill these in. Email and address are hidden on the site while empty,
// but Razorpay expects both to be visible before it activates the account.
export const BUSINESS_NAME = "Titto’s X Fashion Planet";
export const CONTACT_EMAIL = "";
export const BUSINESS_ADDRESS = "";

// Policy values. TODO(client): confirm these before launch.
export const POLICY_UPDATED = "2 November 2026";
export const RETURN_WINDOW_DAYS = 7;
export const DISPATCH_DAYS = "1–2";
export const DELIVERY_DAYS = "4–7";
export const REFUND_DAYS = "5–7";

export const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36"];

export const formatPrice = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
