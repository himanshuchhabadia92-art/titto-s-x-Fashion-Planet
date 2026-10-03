"use client";

import { useState } from "react";

interface FilterBarProps {
  productCount: number;
}

export default function FilterBar({ productCount }: FilterBarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggle = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <div className="bg-black border-y border-gray-800 py-3 px-4 sticky top-[60px] z-40 relative">
      <div className="container mx-auto max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[#8cc665] text-xs font-black uppercase tracking-widest">Filter:</span>
          
          {/* Availability */}
          <div className="relative">
            <button 
              onClick={() => toggle("availability")}
              className={`flex items-center gap-2 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-colors border ${openDropdown === "availability" ? "bg-[#8cc665] text-black border-[#8cc665]" : "bg-gray-800/80 hover:bg-gray-700 border-gray-700"}`}
            >
              Availability <span className={openDropdown === "availability" ? "text-black/50" : "text-gray-500"}>▾</span>
            </button>
            {openDropdown === "availability" && (
              <div className="absolute top-full left-0 mt-2 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-2xl min-w-[180px] py-2 z-50">
                <label className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800 cursor-pointer transition-colors">
                  <input type="checkbox" defaultChecked className="accent-[#8cc665] w-4 h-4" />
                  <span className="text-white text-xs font-bold uppercase tracking-wider">In Stock</span>
                </label>
                <label className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800 cursor-pointer transition-colors">
                  <input type="checkbox" className="accent-[#8cc665] w-4 h-4" />
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Out of Stock</span>
                </label>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="relative">
            <button 
              onClick={() => toggle("price")}
              className={`flex items-center gap-2 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-colors border ${openDropdown === "price" ? "bg-[#8cc665] text-black border-[#8cc665]" : "bg-gray-800/80 hover:bg-gray-700 border-gray-700"}`}
            >
              Price <span className={openDropdown === "price" ? "text-black/50" : "text-gray-500"}>▾</span>
            </button>
            {openDropdown === "price" && (
              <div className="absolute top-full left-0 mt-2 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-2xl min-w-[180px] py-2 z-50">
                <button className="w-full text-left px-4 py-2.5 hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider transition-colors">Under ₹500</button>
                <button className="w-full text-left px-4 py-2.5 hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider transition-colors">₹500 — ₹1,000</button>
                <button className="w-full text-left px-4 py-2.5 hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider transition-colors">₹1,000 — ₹1,500</button>
                <button className="w-full text-left px-4 py-2.5 hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider transition-colors">₹1,500 — ₹2,000</button>
                <button className="w-full text-left px-4 py-2.5 hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider transition-colors">Above ₹2,000</button>
              </div>
            )}
          </div>

          {/* Size */}
          <div className="relative">
            <button 
              onClick={() => toggle("size")}
              className={`flex items-center gap-2 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-colors border ${openDropdown === "size" ? "bg-[#8cc665] text-black border-[#8cc665]" : "bg-gray-800/80 hover:bg-gray-700 border-gray-700"}`}
            >
              Size <span className={openDropdown === "size" ? "text-black/50" : "text-gray-500"}>▾</span>
            </button>
            {openDropdown === "size" && (
              <div className="absolute top-full left-0 mt-2 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-2xl min-w-[180px] py-2 z-50">
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                  <label key={size} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800 cursor-pointer transition-colors">
                    <input type="checkbox" className="accent-[#8cc665] w-4 h-4" />
                    <span className="text-white text-xs font-bold uppercase tracking-wider">{size}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Sort */}
          <div className="relative">
            <div className="flex items-center gap-2">
              <span className="text-[#8cc665] text-xs font-black uppercase tracking-widest">Sort:</span>
              <button 
                onClick={() => toggle("sort")}
                className={`flex items-center gap-2 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-colors border ${openDropdown === "sort" ? "bg-[#8cc665] text-black border-[#8cc665]" : "bg-gray-800/80 hover:bg-gray-700 border-gray-700"}`}
              >
                Best selling <span className={openDropdown === "sort" ? "text-black/50" : "text-gray-500"}>▾</span>
              </button>
            </div>
            {openDropdown === "sort" && (
              <div className="absolute top-full right-0 mt-2 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-2xl min-w-[200px] py-2 z-50">
                <button className="w-full text-left px-4 py-2.5 hover:bg-gray-800 text-[#8cc665] text-xs font-bold uppercase tracking-wider transition-colors">Best Selling</button>
                <button className="w-full text-left px-4 py-2.5 hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider transition-colors">Price: Low → High</button>
                <button className="w-full text-left px-4 py-2.5 hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider transition-colors">Price: High → Low</button>
                <button className="w-full text-left px-4 py-2.5 hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider transition-colors">Newest First</button>
                <button className="w-full text-left px-4 py-2.5 hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider transition-colors">A — Z</button>
                <button className="w-full text-left px-4 py-2.5 hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider transition-colors">Z — A</button>
              </div>
            )}
          </div>

          <span className="text-gray-500 text-xs font-bold uppercase tracking-widest hidden md:block">{productCount} products</span>
        </div>
      </div>

      {/* Click outside to close */}
      {openDropdown && (
        <div className="fixed inset-0 z-30" onClick={() => setOpenDropdown(null)} />
      )}
    </div>
  );
}
