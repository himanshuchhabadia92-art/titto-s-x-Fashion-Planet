import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCategories } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();
  const links = categories.map((c) => ({ name: c.name, slug: c.slug }));

  return (
    <>
      {/* Top Marquee */}
      <div className="bg-foreground text-background overflow-hidden py-2 border-b border-gray-800 flex whitespace-nowrap text-xs font-bold tracking-widest uppercase">
        <div className="animate-marquee">
          <span>✦ FREE SHIPPING ON PREPAID ORDERS ✦ PREMIUM OVERSIZED TEES ✦ 240 GSM HEAVYWEIGHT COTTON ✦ NO COMPROMISE ON QUALITY </span>
          <span>✦ FREE SHIPPING ON PREPAID ORDERS ✦ PREMIUM OVERSIZED TEES ✦ 240 GSM HEAVYWEIGHT COTTON ✦ NO COMPROMISE ON QUALITY </span>
        </div>
      </div>
      <Navbar categories={links} />
      <main className="flex-grow">{children}</main>
      <Footer categories={links} />
    </>
  );
}
