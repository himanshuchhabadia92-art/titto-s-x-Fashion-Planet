import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Banknote, CreditCard, MessageCircle, Phone, Shirt, Sparkles } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import InstagramIcon from "@/components/InstagramIcon";
import { getCategories, getCollection, getNewArrivals } from "@/lib/catalog";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, PHONE_DISPLAY, PHONE_TEL, WHATSAPP_URL } from "@/lib/site";

const badges = [
  { icon: Sparkles, title: "Premium Fabric", text: "240 GSM heavyweight cotton" },
  { icon: Shirt, title: "Perfect Fit", text: "Oversized, drop-shoulder cuts" },
  { icon: CreditCard, title: "Secure Payments", text: "UPI, cards & netbanking" },
  { icon: Banknote, title: "Cash on Delivery", text: "Pay when it arrives" },
];

function SectionHeading({ title, href, cta = "View all" }: { title: string; href?: string; cta?: string }) {
  return (
    <div className="mb-8 sm:mb-10 flex justify-between items-end gap-4">
      <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight uppercase">{title}</h2>
      {href && (
        <Link href={href} className="flex shrink-0 text-xs sm:text-sm font-bold uppercase tracking-widest items-center hover:underline">
          {cta} <ArrowRight size={16} className="ml-2" />
        </Link>
      )}
    </div>
  );
}

export default async function Home() {
  const [newArrivals, categories, bestsellers] = await Promise.all([
    getNewArrivals(8),
    getCategories(),
    getCollection("bestsellers"),
  ]);
  const shopCategories = categories.filter((c) => c.slug !== "bestsellers");
  const topSellers = bestsellers?.products.slice(0, 4) ?? [];
  const lookbook = [...newArrivals, ...(bestsellers?.products ?? [])].filter((p) => p.image).slice(0, 8);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero */}
      <section className="relative h-[100svh] w-full flex flex-col justify-between overflow-hidden bg-black pt-6">
        <div className="absolute inset-0 z-0 w-full h-full">
          <Image src="/hero-bg-mobile.jpg" alt="Titto's streetwear models" fill sizes="100vw" className="block md:hidden object-cover object-top animate-slow-zoom" priority />
          <Image src="/hero-bg-animated.jpg" alt="Titto's streetwear models with a vintage Porsche" fill sizes="100vw" className="hidden md:block object-cover object-center animate-slow-zoom" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none z-10" />
        </div>

        <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 pt-24 sm:pt-28 md:pt-36">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-black text-white uppercase tracking-tighter drop-shadow-[0_5px_15px_rgba(0,0,0,0.9)] italic -skew-x-6">
            TITTO&apos;S
          </h1>
          <p className="text-white/90 text-xs sm:text-sm md:text-lg font-bold uppercase tracking-widest mt-3 max-w-md drop-shadow-md">
            Anime • Mythology • Graphic Culture
          </p>
        </div>

        <div className="flex-grow pointer-events-none" />

        <div className="relative z-20 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 pb-8 sm:pb-12 md:pb-16 px-4">
          <Link href="/collections/all" className="bg-[#8cc665] text-black px-10 py-3.5 sm:px-12 sm:py-4 text-base sm:text-lg font-bold hover:bg-[#7ab056] transition-colors shadow-lg uppercase tracking-widest">
            Shop now
          </Link>
          <Link href="/collections/new-arrivals" className="border border-white text-white px-10 py-3.5 sm:px-12 sm:py-4 text-base sm:text-lg font-bold hover:bg-white hover:text-black transition-colors uppercase tracking-widest">
            New arrivals
          </Link>
        </div>

        <div className="relative z-20 bg-black text-white py-3 border-t border-gray-800 overflow-hidden flex whitespace-nowrap text-sm font-bold tracking-widest uppercase">
          <div className="animate-marquee flex gap-8 items-center">
            {[0, 1].map((i) => (
              <span key={i} className="flex gap-8">
                <span>✨ FREE DELIVERY</span>
                <span>💳 CASH ON DELIVERY AVAILABLE</span>
                <span>🎁 EXCLUSIVE DISCOUNTS ON YOUR FAVORITE</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Trust badges */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3 sm:gap-4">
              <div className="h-11 w-11 shrink-0 rounded-full bg-black text-white flex items-center justify-center">
                <Icon size={20} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-black uppercase tracking-wider">{title}</p>
                <p className="text-xs sm:text-sm text-gray-500">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Shop by category */}
      {shopCategories.length > 0 && (
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 container mx-auto">
          <SectionHeading title="Shop by category" href="/collections/all" cta="All products" />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {shopCategories.map((c) => (
              <Link key={c.id} href={`/collections/${c.slug}`} className="group relative block aspect-[4/5] bg-gray-100 overflow-hidden">
                {c.image && (
                  <Image src={c.image} alt={c.name} fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                )}
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 bg-gradient-to-t from-black/70 to-transparent">
                  <span className="text-white text-lg sm:text-2xl font-display font-black uppercase tracking-wide flex items-center">
                    {c.name} <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 4. New arrivals */}
      {newArrivals.length > 0 && (
        <section className="pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 container mx-auto">
          <SectionHeading title="New arrivals" href="/collections/new-arrivals" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-5 md:gap-x-6">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 5. Feature banner */}
      <section className="bg-[#111111] text-white">
        <div className="grid md:grid-cols-2">
          <div className="relative min-h-[320px] md:min-h-[480px]">
            <Image src="/hero-bg-widescreen.jpg" alt="Titto's streetwear campaign" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
            <p className="text-[#8cc665] text-xs font-black uppercase tracking-[0.3em] mb-4">The Titto&apos;s look</p>
            <h2 className="text-4xl sm:text-5xl font-display font-black uppercase tracking-tight leading-none mb-5">
              Oversized fits.
              <br />
              Everyday attitude.
            </h2>
            <p className="text-gray-300 max-w-md mb-8">
              From heavyweight tees and hoodies to jackets, jeans and trousers, build your fit with pieces made to be worn hard and layered easy.
            </p>
            <div>
              <Link href="/collections/tshirts" className="inline-block bg-[#8cc665] text-black px-8 py-3.5 text-sm font-bold hover:bg-[#7ab056] transition-colors uppercase tracking-widest">
                Shop t-shirts
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Bestsellers */}
      {topSellers.length > 0 && (
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 container mx-auto">
          <SectionHeading title="Bestsellers" href="/collections/bestsellers" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-5 md:gap-x-6">
            {topSellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 7. Lookbook */}
      {lookbook.length > 0 && (
        <section className="py-14 sm:py-20 bg-gray-50 border-y border-gray-200 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title="Lookbook" />
          </div>
          <div className="flex gap-3 sm:gap-4 overflow-x-auto px-4 sm:px-6 lg:px-[max(2rem,calc((100vw-80rem)/2))] pb-4 snap-x">
            {lookbook.map((p) => (
              <Link key={p.id} href={`/products/${p.slug}`} className="group relative shrink-0 snap-start w-[200px] sm:w-[260px] aspect-[3/4] bg-gray-200 overflow-hidden">
                <Image src={p.image!} alt={p.name} fill sizes="260px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white text-xs font-bold uppercase tracking-wider">{p.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 8. Follow + contact */}
      <section className="py-14 sm:py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight mb-3">Stay in the loop</h2>
          <p className="text-gray-600 mb-8">Follow us for new drops and styling ideas, or message us anytime for help with an order.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 bg-black text-white px-7 py-3.5 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
              <InstagramIcon size={18} /> {INSTAGRAM_HANDLE}
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 border border-black px-7 py-3.5 text-sm font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors">
              <MessageCircle size={18} /> WhatsApp
            </a>
            <a href={`tel:${PHONE_TEL}`} className="inline-flex items-center justify-center gap-2 border border-black px-7 py-3.5 text-sm font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors">
              <Phone size={18} /> {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
