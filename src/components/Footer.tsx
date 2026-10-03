import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background border-t border-gray-800">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Image 
                src="/logo-wide-white.png" 
                alt="Titto's X Fashion Planet" 
                width={260} 
                height={75} 
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-gray-400 text-sm max-w-sm">
              Elevating everyday essentials. A premium destination for curated fashion in monochrome elegance.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link href="/collections/all" className="text-gray-400 hover:text-white transition-colors text-sm">All Products</Link></li>
              <li><Link href="/collections/new" className="text-gray-400 hover:text-white transition-colors text-sm">New Arrivals</Link></li>
              <li><Link href="/collections/bestsellers" className="text-gray-400 hover:text-white transition-colors text-sm">Bestsellers</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">FAQ</Link></li>
              <li><Link href="/shipping" className="text-gray-400 hover:text-white transition-colors text-sm">Shipping & Returns</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Titto's X Fashion Planet. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {/* Social Icons could go here */}
            <span className="text-gray-500 text-sm">Instagram</span>
            <span className="text-gray-500 text-sm">Twitter</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
