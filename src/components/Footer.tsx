import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Phone } from "lucide-react";
import InstagramIcon from "@/components/InstagramIcon";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, PHONE_DISPLAY, PHONE_TEL, WHATSAPP_URL } from "@/lib/site";

const linkCls = "text-gray-400 hover:text-white transition-colors text-sm";

export default function Footer({ categories }: { categories: { name: string; slug: string }[] }) {
  return (
    <footer className="bg-foreground text-background border-t border-gray-800">
      <div className="container mx-auto px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image src="/logo-white.png" alt="Titto's X Fashion Planet" width={160} height={65} className="h-14 w-auto object-contain" />
            </Link>
            <p className="text-gray-400 text-sm max-w-xs">Men&apos;s streetwear and everyday essentials. Premium fabrics, bold fits.</p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-4 text-gray-300">Shop</h3>
            <ul className="space-y-2">
              <li><Link href="/collections/all" className={linkCls}>All Products</Link></li>
              <li><Link href="/collections/new-arrivals" className={linkCls}>New Arrivals</Link></li>
              {categories.map((c) => (
                <li key={c.slug}><Link href={`/collections/${c.slug}`} className={linkCls}>{c.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-4 text-gray-300">My Account</h3>
            <ul className="space-y-2">
              <li><Link href="/account" className={linkCls}>Account &amp; Orders</Link></li>
              <li><Link href="/wishlist" className={linkCls}>Wishlist</Link></li>
              <li><Link href="/cart" className={linkCls}>Cart</Link></li>
              <li><Link href="/search" className={linkCls}>Search</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-4 text-gray-300">Contact</h3>
            <ul className="space-y-3">
              <li><a href={`tel:${PHONE_TEL}`} className={`${linkCls} flex items-center gap-2`}><Phone size={16} /> {PHONE_DISPLAY}</a></li>
              <li><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className={`${linkCls} flex items-center gap-2`}><MessageCircle size={16} /> WhatsApp us</a></li>
              <li><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className={`${linkCls} flex items-center gap-2`}><InstagramIcon size={16} /> {INSTAGRAM_HANDLE}</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Titto&apos;s X Fashion Planet. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
