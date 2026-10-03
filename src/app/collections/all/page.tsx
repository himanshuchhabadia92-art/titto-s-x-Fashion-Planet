import Link from "next/link";
import Image from "next/image";

export default function CollectionsAll() {
  const products = [
    { id: 1, name: "Monochrome Blazer", price: "$120.00", category: "Outerwear" },
    { id: 2, name: "Essential Silk Blouse", price: "$85.00", category: "Tops" },
    { id: 3, name: "Tailored Trousers", price: "$95.00", category: "Bottoms" },
    { id: 4, name: "Structured Midi Dress", price: "$150.00", category: "Dresses" },
    { id: 5, name: "Classic Trench Coat", price: "$180.00", category: "Outerwear" },
    { id: 6, name: "Minimalist Leather Tote", price: "$210.00", category: "Accessories" },
  ];

  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-4xl font-serif font-bold tracking-tight mb-2">The Collection</h1>
          <p className="text-gray-500">Explore our full range of premium monochrome pieces.</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-4 text-sm font-medium">
          <span className="uppercase tracking-wider cursor-pointer border-b border-foreground">All</span>
          <span className="text-gray-400 hover:text-foreground uppercase tracking-wider cursor-pointer transition-colors">Outerwear</span>
          <span className="text-gray-400 hover:text-foreground uppercase tracking-wider cursor-pointer transition-colors">Tops</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {products.map((product) => (
          <div key={product.id} className="group">
            <Link href={`/collections/all/${product.id}`} className="block">
              <div className="relative aspect-[3/4] bg-gray-100 mb-4 overflow-hidden">
                {/* Image placeholder */}
                <div className="absolute inset-0 bg-gray-200 transition-transform duration-700 group-hover:scale-105" />
                
                {/* Hover overlay for 'Add to Cart' */}
                <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button className="w-full bg-foreground text-background py-3 text-sm font-semibold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider">{product.name}</h3>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{product.category}</p>
                </div>
                <span className="text-sm font-medium">{product.price}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
