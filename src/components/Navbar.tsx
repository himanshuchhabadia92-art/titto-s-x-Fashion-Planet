"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Search, Zap, Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  // On home page, navbar is transparent and absolute. On other pages, it's black.
  const isHome = pathname === "/";

  return (
    <header className={clsx(
      "w-full z-50 transition-colors duration-300",
      isHome ? "absolute top-0 left-0 bg-transparent pt-6" : "sticky top-0 bg-black border-b border-gray-800 py-4"
    )}>
      <div className="container mx-auto px-4 md:px-12">
        <div className="flex items-center justify-between">
          {/* Left: Hamburger Menu & Logo */}
          <div className="flex items-center space-x-3 md:space-x-4">
            <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu" className="text-white p-2 -ml-2 hover:text-gray-300 transition-colors drop-shadow-md">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
            <Link href="/" className="flex items-center">
              <Image 
                src="/logo-white.png" 
                alt="Titto's X Fashion Planet" 
                width={240} 
                height={90} 
                className="h-12 sm:h-14 md:h-16 lg:h-20 w-auto object-contain drop-shadow-xl"
                priority
              />
            </Link>
          </div>

          {/* Center: Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <nav className="flex space-x-8 items-center text-white font-bold text-sm tracking-widest uppercase">
              <Link href="/collections/tshirts" className="hover:text-gray-300 drop-shadow-md">T-SHIRTS</Link>
              <Link href="/collections/hoodies" className="hover:text-gray-300 drop-shadow-md">HOODIES</Link>
              <Link href="/collections/jeans" className="hover:text-gray-300 drop-shadow-md">JEANS</Link>
              <Link href="/collections/bestsellers" className="hover:text-gray-300 drop-shadow-md">BESTSELLERS</Link>
              <Link href="/collections/new-arrivals" className="hover:text-gray-300 drop-shadow-md">NEW ARRIVALS</Link>
            </nav>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center space-x-4 md:space-x-6 text-white">
            <button className="hover:text-gray-300 drop-shadow-md transition-colors">
              <Search size={22} />
            </button>
            <button className="text-yellow-500 hover:text-yellow-400 drop-shadow-md transition-colors">
              <Zap size={22} className="fill-yellow-500" />
            </button>
            <Link href="/cart" className="hover:text-gray-300 drop-shadow-md transition-colors relative">
              <ShoppingBag size={22} />
              <span className="absolute -bottom-2 -right-2 bg-white text-black text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">0</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Sidebar Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)}>
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        </div>
      )}
      <div className={`fixed top-0 left-0 h-full w-[320px] bg-black z-[110] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-800">
          <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center">
            <Image 
              src="/logo-white.png" 
              alt="Titto's X Fashion Planet" 
              width={200} 
              height={75} 
              className="h-14 md:h-16 w-auto object-contain"
            />
          </Link>
          <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-400 transition-colors">
            <X size={28} />
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex flex-col px-6 py-8 space-y-6">
          <Link href="/collections/tshirts" onClick={() => setIsOpen(false)} className="text-2xl font-display font-black uppercase tracking-wider text-white hover:text-gray-400 transition-colors">T-Shirts</Link>
          <Link href="/collections/hoodies" onClick={() => setIsOpen(false)} className="text-2xl font-display font-black uppercase tracking-wider text-white hover:text-gray-400 transition-colors">Hoodies</Link>
          <Link href="/collections/jeans" onClick={() => setIsOpen(false)} className="text-2xl font-display font-black uppercase tracking-wider text-white hover:text-gray-400 transition-colors">Jeans</Link>
          <Link href="/collections/bestsellers" onClick={() => setIsOpen(false)} className="text-2xl font-display font-black uppercase tracking-wider text-white hover:text-gray-400 transition-colors">Bestsellers</Link>
          <Link href="/collections/new-arrivals" onClick={() => setIsOpen(false)} className="text-2xl font-display font-black uppercase tracking-wider text-white hover:text-gray-400 transition-colors">New Arrivals</Link>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 w-full px-6 py-8 border-t border-gray-800 space-y-4">
          <Link href="/account" onClick={() => setIsOpen(false)} className="block text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">My Account</Link>
          <Link href="/cart" onClick={() => setIsOpen(false)} className="block text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Cart (0)</Link>
          <p className="text-xs text-gray-600 mt-4">© 2024 Titto's X Fashion Planet</p>
        </div>
      </div>
    </header>
  );
}
