import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import RotatingImages from "@/components/RotatingImages";

export default function Home() {
  const newArrivals = [
    {
      id: 1,
      name: "MICKEY X GOOFY HOODIE",
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1664&auto=format&fit=crop",
      price: "₹1499"
    },
    {
      id: 2,
      name: "SNOOPY LIVE LAUGH LOVE",
      image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1587&auto=format&fit=crop",
      price: "₹1299"
    },
    {
      id: 3,
      name: "MICKEY BUTTON-UP SHIRT",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1600&auto=format&fit=crop",
      price: "₹1099"
    },
    {
      id: 4,
      name: "SNOOPY MULTI-PANEL JACKET",
      image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1740&auto=format&fit=crop",
      price: "₹1899"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[100svh] w-full flex flex-col justify-between overflow-hidden bg-black pt-6">
        {/* Background Image: Mobile 9:16 vs Desktop 16:9 */}
        <div className="absolute inset-0 z-0 w-full h-full">
           {/* Mobile Portrait Hero Background */}
           <Image 
             src="/hero-bg-mobile.jpg" 
             alt="Titto's Streetwear Models and Porsche Mobile" 
             fill 
             sizes="100vw"
             className="block md:hidden object-cover object-top animate-slow-zoom"
             priority
           />
           {/* Desktop Widescreen Hero Background */}
           <Image 
             src="/hero-bg-animated.jpg" 
             alt="Diverse Streetwear Models with Vintage Porsche and Titto's Wall" 
             fill 
             sizes="100vw"
             className="hidden md:block object-cover object-center animate-slow-zoom"
             priority
           />
           <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none z-10" />
        </div>

        {/* The top navigation is handled by Navbar component */}
        
        {/* Center Hero Headline Overlay */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 pt-24 sm:pt-28 md:pt-36">
          <span className="text-[#8cc665] text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] mb-3 bg-black/70 px-4 py-1.5 rounded-full border border-[#8cc665]/40 backdrop-blur-sm">
            Urban Streetwear 2024
          </span>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-black text-white uppercase tracking-tighter drop-shadow-[0_5px_15px_rgba(0,0,0,0.9)] italic -skew-x-6">
            TITTO'S
          </h1>
          <p className="text-white/90 text-xs sm:text-sm md:text-lg font-bold uppercase tracking-widest mt-3 max-w-md drop-shadow-md">
            Anime • Mythology • Graphic Culture
          </p>
        </div>

        {/* Spacer to push the button down */}
        <div className="flex-grow pointer-events-none"></div>

        {/* Shop Now Button */}
        <div className="relative z-20 flex justify-center pb-8 sm:pb-12 md:pb-16">
           <Link 
              href="/collections/all" 
              className="bg-[#8cc665] text-black px-10 py-3.5 sm:px-12 sm:py-4 text-base sm:text-lg md:text-xl font-bold hover:bg-[#7ab056] transition-colors shadow-lg uppercase tracking-widest border border-black rounded-none"
            >
              Shop now
            </Link>
        </div>

        {/* Bottom Marquee Banner */}
        <div className="relative z-20 bg-black text-white py-3 border-t border-gray-800 overflow-hidden flex whitespace-nowrap text-sm md:text-base font-bold tracking-widest uppercase">
          <div className="animate-marquee flex gap-8 items-center">
            <span>✨ FREE DELIVERY</span>
            <span>💳 CASH ON DELIVERY AVAILABLE</span>
            <span>🎁 EXCLUSIVE DISCOUNTS ON YOUR FAVORITE</span>
            <span>✨ FREE DELIVERY</span>
            <span>💳 CASH ON DELIVERY AVAILABLE</span>
            <span>🎁 EXCLUSIVE DISCOUNTS ON YOUR FAVORITE</span>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <div className="bg-foreground text-background py-6 border-b border-gray-800">
        <div className="container mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16 text-xs md:text-sm font-bold tracking-widest uppercase text-center">
          <div className="flex items-center gap-2"><Star size={16} /> Premium 240 GSM Cotton</div>
          <div className="flex items-center gap-2"><Star size={16} /> DTF High Quality Print</div>
          <div className="flex items-center gap-2"><Star size={16} /> Oversized Drop-Shoulder Fit</div>
        </div>
      </div>

      {/* New Arrivals Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 container mx-auto">
        <div className="mb-8 sm:mb-12 border-b-4 border-foreground pb-4 flex justify-between items-end">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-foreground uppercase">New Arrivals</h2>
          <Link href="/collections/all" className="hidden md:flex text-sm font-bold uppercase tracking-widest items-center hover:underline">
            View All <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {newArrivals.map((item) => (
            <Link href={`/collections/all/${item.id}`} key={item.id} className="group cursor-pointer block">
              <div className="relative aspect-[3/4] bg-gray-100 mb-3 sm:mb-4 overflow-hidden border border-gray-200">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white text-black px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-black tracking-widest uppercase border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  SALE
                </div>
              </div>
              <h3 className="text-xs sm:text-sm md:text-base font-display font-bold text-foreground uppercase tracking-wide leading-tight">{item.name}</h3>
              <p className="text-gray-600 font-bold mt-1 text-xs sm:text-sm">{item.price}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 container mx-auto border-t border-gray-100">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground mb-8 sm:mb-12">Collections</h2>
        
        {/* Top Row: 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Collection 1: T-Shirts */}
          <Link href="/collections/tshirts" className="group cursor-pointer block">
            <div className="relative aspect-square bg-gray-900 mb-4 sm:mb-6 overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1600&auto=format&fit=crop" 
                alt="Unisex T-Shirts" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700" 
              />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-foreground flex items-center hover:underline">
              Unisex T-Shirts <ArrowRight size={20} className="ml-2" />
            </h3>
          </Link>

          {/* Collection 2: Hoodies */}
          <Link href="/collections/hoodies" className="group cursor-pointer block">
            <div className="relative aspect-square bg-gray-900 mb-4 sm:mb-6 overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1587&auto=format&fit=crop" 
                alt="Unisex Hoodies" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700" 
              />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-foreground flex items-center hover:underline">
              Unisex Hoodies <ArrowRight size={20} className="ml-2" />
            </h3>
          </Link>

          {/* Collection 3: Jeans */}
          <Link href="/collections/jeans" className="group cursor-pointer block">
            <div className="relative aspect-square bg-gray-900 mb-4 sm:mb-6 overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1542272604-780c8d47b096?q=80&w=1736&auto=format&fit=crop" 
                alt="Unisex Jeans" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700" 
              />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-foreground flex items-center hover:underline">
              Unisex Jeans <ArrowRight size={20} className="ml-2" />
            </h3>
          </Link>
        </div>

        {/* Bottom Row: 2 columns (wider cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Collection 4: Bestsellers */}
          <Link href="/collections/bestsellers" className="group cursor-pointer block">
            <div className="relative aspect-[16/9] bg-gray-900 mb-4 sm:mb-6 overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop" 
                alt="Bestsellers" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-black/40 flex items-end p-4 sm:p-8">
                <span className="text-white text-xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight">Bestsellers 🔥</span>
              </div>
            </div>
          </Link>

          {/* Collection 5: New Arrivals */}
          <Link href="/collections/new-arrivals" className="group cursor-pointer block">
            <div className="relative aspect-[16/9] bg-gray-900 mb-4 sm:mb-6 overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=1600&auto=format&fit=crop" 
                alt="New Arrivals" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-black/40 flex items-end p-4 sm:p-8">
                <span className="text-white text-xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight">New Arrivals ✨</span>
              </div>
            </div>
          </Link>
        </div>
      </section>
      
      {/* Moving Reels Section */}
      <section className="py-24 bg-[#111111] overflow-hidden flex flex-col items-center border-t border-gray-800">
        <div className="mb-12">
          <Link href="/instagram" className="bg-white text-red-600 font-bold uppercase tracking-widest px-8 py-3 text-sm hover:bg-gray-200 transition-colors">
            View all
          </Link>
        </div>
        
        {/* Infinite Horizontal Scroll */}
        <div className="flex w-full overflow-hidden relative group">
           {/* Fade edges */}
           <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#111111] to-transparent z-10 pointer-events-none" />
           <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#111111] to-transparent z-10 pointer-events-none" />
           
           {/* Marquee Tracks */}
           <div className="flex flex-nowrap gap-4 px-2 animate-marquee shrink-0 min-w-full group-hover:[animation-play-state:paused] transition-all duration-300" style={{ animationDuration: '40s' }}>
             {[
               "https://images.unsplash.com/photo-1515347619362-e6741b0b30ce?q=80&w=1587&auto=format&fit=crop",
               "https://images.unsplash.com/photo-1617387411603-5d45d7f763bd?q=80&w=1587&auto=format&fit=crop",
               "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1587&auto=format&fit=crop",
               "https://images.unsplash.com/photo-1602810316428-565406085a81?q=80&w=1587&auto=format&fit=crop",
               "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1587&auto=format&fit=crop",
               "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1587&auto=format&fit=crop",
               "https://images.unsplash.com/photo-1512353087810-258cb4492ca5?q=80&w=1587&auto=format&fit=crop"
             ].map((img, i) => (
               <div key={`reel1-${i}`} className="relative w-[180px] md:w-[280px] h-[320px] md:h-[500px] shrink-0 bg-gray-900 overflow-hidden cursor-pointer group/reel">
                 <Image src={img} alt="Streetwear Reel" fill className="object-cover group-hover/reel:scale-105 transition-transform duration-500" />
                 {/* Reel UI Overlay */}
                 <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-20">
                    <div className="flex flex-col gap-2">
                       <span className="text-white font-bold text-sm drop-shadow-md">@tittos_fashion</span>
                       <span className="text-white/80 text-xs drop-shadow-md line-clamp-1">New Drop out now 🔥</span>
                    </div>
                 </div>
                 {/* Play Icon Overlay */}
                 <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/reel:opacity-100 transition-opacity z-10">
                   <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                     <div className="w-0 h-0 border-t-[10px] border-b-[10px] border-l-[16px] border-t-transparent border-b-transparent border-l-white ml-2"></div>
                   </div>
                 </div>
               </div>
             ))}
           </div>
           
           <div className="flex flex-nowrap gap-4 px-2 animate-marquee shrink-0 min-w-full group-hover:[animation-play-state:paused] transition-all duration-300" aria-hidden="true" style={{ animationDuration: '40s' }}>
             {[
               "https://images.unsplash.com/photo-1515347619362-e6741b0b30ce?q=80&w=1587&auto=format&fit=crop",
               "https://images.unsplash.com/photo-1617387411603-5d45d7f763bd?q=80&w=1587&auto=format&fit=crop",
               "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1587&auto=format&fit=crop",
               "https://images.unsplash.com/photo-1602810316428-565406085a81?q=80&w=1587&auto=format&fit=crop",
               "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1587&auto=format&fit=crop",
               "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1587&auto=format&fit=crop",
               "https://images.unsplash.com/photo-1512353087810-258cb4492ca5?q=80&w=1587&auto=format&fit=crop"
             ].map((img, i) => (
               <div key={`reel2-${i}`} className="relative w-[180px] md:w-[280px] h-[320px] md:h-[500px] shrink-0 bg-gray-900 overflow-hidden cursor-pointer group/reel">
                 <Image src={img} alt="Streetwear Reel" fill className="object-cover group-hover/reel:scale-105 transition-transform duration-500" />
                 {/* Reel UI Overlay */}
                 <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-20">
                    <div className="flex flex-col gap-2">
                       <span className="text-white font-bold text-sm drop-shadow-md">@tittos_fashion</span>
                       <span className="text-white/80 text-xs drop-shadow-md line-clamp-1">New Drop out now 🔥</span>
                    </div>
                 </div>
                 {/* Play Icon Overlay */}
                 <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/reel:opacity-100 transition-opacity z-10">
                   <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                     <div className="w-0 h-0 border-t-[10px] border-b-[10px] border-l-[16px] border-t-transparent border-b-transparent border-l-white ml-2"></div>
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* 50/50 Video Split Section */}
      <section className="flex flex-col md:flex-row w-full bg-[#f3f2ef] overflow-hidden">
        {/* Left Side: Text Content */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16 lg:p-24">
          <h2 className="text-4xl md:text-6xl font-black text-black uppercase mb-4 tracking-tighter leading-none">
            FUNKY LOOK <br/>= TITTO'S
          </h2>
          
          <p className="text-black text-lg md:text-2xl font-medium mb-6 mt-4">
            Oversized T-Shirts &<br />
            Graphic Streetwear
          </p>
          
          <p className="text-black text-lg md:text-2xl font-medium mb-10">
            Anime • Mythology • Graphic<br />
            Culture
          </p>
          
          <div>
            <Link 
              href="/collections/all" 
              className="bg-[#8cc665] text-black border border-black px-8 py-3 text-sm md:text-base font-bold hover:bg-[#7ab056] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest inline-block"
            >
              Shop Now
            </Link>
          </div>
        </div>

        {/* Right Side: 3 Moving Images */}
        <RotatingImages />
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-foreground text-background border-t-8 border-gray-900">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-5xl font-display font-black mb-4 uppercase tracking-tighter">Join The Cult</h2>
          <p className="text-gray-400 mb-8 font-medium">Subscribe to receive early access to new drops and exclusive deals.</p>
          <form className="flex flex-col sm:flex-row gap-0">
            <input 
              type="email" 
              placeholder="ENTER YOUR EMAIL" 
              className="flex-grow bg-transparent border-2 border-white px-4 py-4 text-white focus:outline-none placeholder-gray-500 font-bold uppercase tracking-widest"
              required
            />
            <button 
              type="submit" 
              className="bg-white text-black px-8 py-4 uppercase tracking-widest text-sm font-black hover:bg-gray-200 transition-colors mt-2 sm:mt-0"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
