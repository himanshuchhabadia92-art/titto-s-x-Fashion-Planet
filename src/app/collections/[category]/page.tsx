import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import FilterBar from "@/components/FilterBar";

const categoryHeroImages: Record<string, string> = {
  tshirts: "https://images.unsplash.com/photo-1489987707025-afc232f7ab38?q=80&w=2000&auto=format&fit=crop",
  hoodies: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=2000&auto=format&fit=crop",
  jeans: "https://images.unsplash.com/photo-1542272604-780c8d47b096?q=80&w=2000&auto=format&fit=crop",
  bestsellers: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop",
  "new-arrivals": "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=2000&auto=format&fit=crop",
};

const categoryData: Record<string, {
  title: string;
  description: string;
  products: { id: number; name: string; price: string; image: string; badge?: string }[];
}> = {
  tshirts: {
    title: "Unisex T-Shirts",
    description: "Oversized graphic tees with anime, mythology & street culture prints.",
    products: [
      { id: 1, name: "MICKEY X GOOFY TEE", price: "₹899", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop" },
      { id: 2, name: "SNOOPY VINTAGE TEE", price: "₹799", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop" },
      { id: 3, name: "DRAGON BALL Z OVERSIZED", price: "₹999", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop", badge: "NEW" },
      { id: 4, name: "NARUTO SHIPPUDEN TEE", price: "₹899", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop" },
      { id: 5, name: "ONE PIECE GRAPHIC TEE", price: "₹949", image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop", badge: "TRENDING" },
      { id: 6, name: "MYTHOLOGY SHIVA TEE", price: "₹1,099", image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=800&auto=format&fit=crop" },
      { id: 7, name: "CLASSIC BLACK OVERSIZED", price: "₹699", image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=800&auto=format&fit=crop" },
      { id: 8, name: "ANIME FUSION TEE", price: "₹849", image: "https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=800&auto=format&fit=crop", badge: "BESTSELLER" },
    ],
  },
  hoodies: {
    title: "Unisex Hoodies",
    description: "Premium heavyweight hoodies with bold graphic prints.",
    products: [
      { id: 1, name: "URBAN NINJA HOODIE", price: "₹1,499", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop" },
      { id: 2, name: "DRAGON GRAPHIC HOODIE", price: "₹1,699", image: "https://images.unsplash.com/photo-1578768079470-26fcef2af08e?q=80&w=800&auto=format&fit=crop", badge: "NEW" },
      { id: 3, name: "MINIMAL BLACK HOODIE", price: "₹1,299", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop" },
      { id: 4, name: "ANIME ART HOODIE", price: "₹1,599", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop", badge: "TRENDING" },
      { id: 5, name: "SAMURAI CULTURE HOODIE", price: "₹1,799", image: "https://images.unsplash.com/photo-1542406775-ade58c52d2e4?q=80&w=800&auto=format&fit=crop" },
      { id: 6, name: "ACID WASH HOODIE", price: "₹1,399", image: "https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?q=80&w=800&auto=format&fit=crop", badge: "BESTSELLER" },
    ],
  },
  jeans: {
    title: "Unisex Jeans",
    description: "Relaxed fit, baggy & straight leg denim for every streetwear look.",
    products: [
      { id: 1, name: "BAGGY CARGO JEANS", price: "₹1,899", image: "https://images.unsplash.com/photo-1542272604-780c8d47b096?q=80&w=800&auto=format&fit=crop" },
      { id: 2, name: "STRAIGHT FIT BLACK", price: "₹1,599", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop", badge: "NEW" },
      { id: 3, name: "WIDE LEG WASHED DENIM", price: "₹1,799", image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?q=80&w=800&auto=format&fit=crop" },
      { id: 4, name: "RELAXED FIT BLUE", price: "₹1,499", image: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?q=80&w=800&auto=format&fit=crop", badge: "TRENDING" },
      { id: 5, name: "DISTRESSED GREY JEANS", price: "₹1,699", image: "https://images.unsplash.com/photo-1475178626620-a4d074967452?q=80&w=800&auto=format&fit=crop" },
      { id: 6, name: "CLASSIC INDIGO STRAIGHT", price: "₹1,399", image: "https://images.unsplash.com/photo-1565084888279-aca5ecc68fb6?q=80&w=800&auto=format&fit=crop", badge: "BESTSELLER" },
    ],
  },
  bestsellers: {
    title: "Bestsellers 🔥",
    description: "Our most loved pieces — the ones everyone's wearing right now.",
    products: [
      { id: 1, name: "MICKEY X GOOFY TEE", price: "₹899", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop", badge: "BESTSELLER" },
      { id: 2, name: "URBAN NINJA HOODIE", price: "₹1,499", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop", badge: "BESTSELLER" },
      { id: 3, name: "BAGGY CARGO JEANS", price: "₹1,899", image: "https://images.unsplash.com/photo-1542272604-780c8d47b096?q=80&w=800&auto=format&fit=crop", badge: "BESTSELLER" },
      { id: 4, name: "ANIME FUSION TEE", price: "₹849", image: "https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=800&auto=format&fit=crop", badge: "BESTSELLER" },
      { id: 5, name: "ACID WASH HOODIE", price: "₹1,399", image: "https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?q=80&w=800&auto=format&fit=crop", badge: "BESTSELLER" },
      { id: 6, name: "DISTRESSED GREY JEANS", price: "₹1,699", image: "https://images.unsplash.com/photo-1475178626620-a4d074967452?q=80&w=800&auto=format&fit=crop", badge: "BESTSELLER" },
    ],
  },
  "new-arrivals": {
    title: "New Arrivals ✨",
    description: "Fresh drops — just landed in the store.",
    products: [
      { id: 1, name: "DRAGON BALL Z OVERSIZED", price: "₹999", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop", badge: "NEW" },
      { id: 2, name: "DRAGON GRAPHIC HOODIE", price: "₹1,699", image: "https://images.unsplash.com/photo-1578768079470-26fcef2af08e?q=80&w=800&auto=format&fit=crop", badge: "NEW" },
      { id: 3, name: "STRAIGHT FIT BLACK", price: "₹1,599", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop", badge: "NEW" },
      { id: 4, name: "ONE PIECE GRAPHIC TEE", price: "₹949", image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop", badge: "NEW" },
      { id: 5, name: "SAMURAI CULTURE HOODIE", price: "₹1,799", image: "https://images.unsplash.com/photo-1542406775-ade58c52d2e4?q=80&w=800&auto=format&fit=crop", badge: "NEW" },
      { id: 6, name: "WIDE LEG WASHED DENIM", price: "₹1,799", image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?q=80&w=800&auto=format&fit=crop", badge: "NEW" },
    ],
  },
};

export default async function CollectionPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const data = categoryData[category];

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-black mb-4">404</h1>
          <p className="text-gray-500 text-lg">Collection not found.</p>
          <Link href="/" className="mt-6 inline-block bg-black text-white px-8 py-3 font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner - Text Only */}
      <div className="bg-black text-white py-12 md:py-16 px-4 border-b border-gray-800 relative overflow-hidden">
        {/* Large background watermark text */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 text-[120px] md:text-[200px] font-display font-black uppercase tracking-tighter text-white/[0.03] leading-none select-none pointer-events-none">
          {data.title.split(' ').pop()}
        </div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[#8cc665] text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold mb-4">— Collection</p>
              <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter text-white leading-[0.9]">
                {data.title}
              </h1>
              <div className="w-16 h-1 bg-[#8cc665] mt-4 mb-4" />
              <p className="text-gray-500 text-sm max-w-md">{data.description}</p>
            </div>
            <div className="hidden md:flex flex-col items-end gap-1">
              <span className="text-3xl font-display font-black text-white">{data.products.length}</span>
              <span className="text-gray-600 text-[10px] uppercase tracking-[0.3em] font-bold">Products</span>
            </div>
          </div>
        </div>
      </div>
      <FilterBar productCount={data.products.length} />

      {/* Product Grid */}
      <div className="bg-black">
        <div className="container mx-auto max-w-7xl px-4 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {data.products.map((product) => (
              <Link key={product.id} href={`/collections/${category}/${product.id}`} className="group block">
                <div className="relative aspect-[3/4] bg-gray-900 mb-4 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-[#8cc665] text-black text-[10px] md:text-xs font-black px-3 py-1 uppercase tracking-wider">
                      {product.badge}
                    </span>
                  )}
                  {/* Quick View overlay */}
                  <div className="absolute bottom-0 left-0 w-full p-3 md:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button className="w-full bg-white text-black py-2.5 md:py-3 text-xs md:text-sm font-black uppercase tracking-widest hover:bg-gray-200 transition-colors">
                      Quick View
                    </button>
                  </div>
                </div>
                <h3 className="text-xs md:text-sm font-display font-black uppercase tracking-wider mb-1 text-white group-hover:text-[#8cc665] transition-colors">{product.name}</h3>
                <span className="text-sm md:text-base font-bold text-gray-400">{product.price}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
