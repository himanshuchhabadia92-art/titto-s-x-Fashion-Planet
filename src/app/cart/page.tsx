import Link from "next/link";
import { Trash2, ArrowRight } from "lucide-react";

export default function Cart() {
  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 max-w-6xl">
      <h1 className="text-4xl font-serif font-bold tracking-tight mb-12">Your Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="flex-grow">
          <div className="border-b border-gray-200 pb-4 mb-6 hidden md:grid grid-cols-6 text-sm font-semibold uppercase tracking-wider text-gray-500">
            <div className="col-span-3">Product</div>
            <div className="text-center">Quantity</div>
            <div className="text-right">Total</div>
            <div></div>
          </div>

          {/* Sample Item 1 */}
          <div className="py-6 border-b border-gray-200 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
            <div className="col-span-3 flex gap-4">
              <div className="w-24 h-32 bg-gray-200 flex-shrink-0" />
              <div className="flex flex-col justify-center">
                <h3 className="font-bold uppercase tracking-wider text-sm">Monochrome Blazer</h3>
                <p className="text-gray-500 text-sm mt-1">Size: M | Color: Black</p>
                <p className="font-medium text-sm mt-2 md:hidden">$120.00</p>
              </div>
            </div>
            
            <div className="flex items-center md:justify-center">
              <div className="flex items-center border border-gray-300">
                <button className="px-3 py-1 hover:bg-gray-100 transition-colors">-</button>
                <span className="px-3 text-sm font-medium">1</span>
                <button className="px-3 py-1 hover:bg-gray-100 transition-colors">+</button>
              </div>
            </div>

            <div className="hidden md:block text-right font-medium text-sm">
              $120.00
            </div>

            <div className="text-right">
              <button className="text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          
          {/* Sample Item 2 */}
          <div className="py-6 border-b border-gray-200 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
            <div className="col-span-3 flex gap-4">
              <div className="w-24 h-32 bg-gray-200 flex-shrink-0" />
              <div className="flex flex-col justify-center">
                <h3 className="font-bold uppercase tracking-wider text-sm">Tailored Trousers</h3>
                <p className="text-gray-500 text-sm mt-1">Size: 32 | Color: Black</p>
                <p className="font-medium text-sm mt-2 md:hidden">$95.00</p>
              </div>
            </div>
            
            <div className="flex items-center md:justify-center">
              <div className="flex items-center border border-gray-300">
                <button className="px-3 py-1 hover:bg-gray-100 transition-colors">-</button>
                <span className="px-3 text-sm font-medium">1</span>
                <button className="px-3 py-1 hover:bg-gray-100 transition-colors">+</button>
              </div>
            </div>

            <div className="hidden md:block text-right font-medium text-sm">
              $95.00
            </div>

            <div className="text-right">
              <button className="text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-gray-50 p-8 border border-gray-200 sticky top-24">
            <h2 className="text-lg font-bold uppercase tracking-wider mb-6 border-b border-gray-200 pb-4">Order Summary</h2>
            
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">$215.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-gray-500">Calculated at checkout</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes</span>
                <span className="font-medium text-gray-500">Calculated at checkout</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="font-bold uppercase tracking-wider">Estimated Total</span>
                <span className="text-xl font-medium">$215.00</span>
              </div>
            </div>

            <button className="w-full bg-foreground text-background py-4 flex items-center justify-center gap-2 uppercase tracking-widest text-sm font-semibold hover:bg-gray-800 transition-colors">
              Checkout <ArrowRight size={18} />
            </button>
            
            <div className="mt-4 text-center">
              <Link href="/collections/all" className="text-xs text-gray-500 uppercase tracking-widest hover:text-foreground transition-colors underline-offset-4 hover:underline">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
