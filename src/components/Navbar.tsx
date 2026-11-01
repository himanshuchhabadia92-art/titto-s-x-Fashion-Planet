"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Heart, Menu, Search, User, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useStore } from "@/components/StoreProvider";

type NavCategory = { name: string; slug: string };

export default function Navbar({ categories }: { categories: NavCategory[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { cartCount, wishlist } = useStore();
  const links = [...categories, { name: "New Arrivals", slug: "new-arrivals" }];
  const shopLinks = categories.filter((c) => c.slug !== "bestsellers");

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
                width={200}
                height={80}
                className="h-12 sm:h-14 md:h-18 lg:h-20 w-auto object-contain drop-shadow-xl"
                priority
              />
            </Link>
          </div>

          {/* Center: Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <nav className="flex space-x-8 items-center text-white font-bold text-sm tracking-widest uppercase">
              <div className="relative group">
                <Link href="/collections/all" className="hover:text-gray-300 drop-shadow-md inline-flex items-center gap-1 py-2">
                  Shop <ChevronDown size={14} />
                </Link>
                <div className="absolute left-1/2 -translate-x-1/2 top-full hidden group-hover:block group-focus-within:block pt-2 z-50">
                  <div className="bg-black border border-gray-800 min-w-[200px] py-2 shadow-2xl">
                    <Link href="/collections/all" className="block px-5 py-2.5 text-xs hover:bg-gray-900">All Products</Link>
                    {shopLinks.map((l) => (
                      <Link key={l.slug} href={`/collections/${l.slug}`} className="block px-5 py-2.5 text-xs hover:bg-gray-900">{l.name}</Link>
                    ))}
                  </div>
                </div>
              </div>
              <Link href="/collections/new-arrivals" className="hover:text-gray-300 drop-shadow-md">New Arrivals</Link>
              {categories.some((c) => c.slug === "bestsellers") && (
                <Link href="/collections/bestsellers" className="hover:text-gray-300 drop-shadow-md">Bestsellers</Link>
              )}
            </nav>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center space-x-4 md:space-x-6 text-white">
            <Link href="/search" aria-label="Search" className="hover:text-gray-300 drop-shadow-md transition-colors">
              <Search size={22} />
            </Link>
            <Link href="/account" aria-label="Account" className="hover:text-gray-300 drop-shadow-md transition-colors">
              <User size={22} />
            </Link>
            <Link href="/wishlist" aria-label="Wishlist" className="hover:text-gray-300 drop-shadow-md transition-colors relative">
              <Heart size={22} />
              {wishlist.length > 0 && (
                <span className="absolute -bottom-2 -right-2 bg-white text-black text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">{wishlist.length}</span>
              )}
            </Link>
            <Link href="/cart" aria-label="Cart" className="hover:text-gray-300 drop-shadow-md transition-colors relative">
              <ShoppingBag size={22} />
              <span className="absolute -bottom-2 -right-2 bg-white text-black text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">{cartCount}</span>
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
      <div className={`fixed top-0 left-0 h-full w-[320px] max-w-[85vw] bg-black z-[110] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-800">
          <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center">
            <Image
              src="/logo-white.png"
              alt="Titto's X Fashion Planet"
              width={160}
              height={65}
              className="h-14 md:h-16 w-auto object-contain"
            />
          </Link>
          <button onClick={() => setIsOpen(false)} aria-label="Close Menu" className="text-white hover:text-gray-400 transition-colors">
            <X size={28} />
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex flex-col px-6 py-8 space-y-6">
          {links.map((l) => (
            <Link key={l.slug} href={`/collections/${l.slug}`} onClick={() => setIsOpen(false)} className="text-2xl font-display font-black uppercase tracking-wider text-white hover:text-gray-400 transition-colors">{l.name}</Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 w-full px-6 py-8 border-t border-gray-800 space-y-4">
          <Link href="/account" onClick={() => setIsOpen(false)} className="block text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">My Account</Link>
          <Link href="/search" onClick={() => setIsOpen(false)} className="block text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Search</Link>
          <Link href="/wishlist" onClick={() => setIsOpen(false)} className="block text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Wishlist ({wishlist.length})</Link>
          <Link href="/cart" onClick={() => setIsOpen(false)} className="block text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Cart ({cartCount})</Link>
          <p className="text-xs text-gray-600 mt-4">© {new Date().getFullYear()} Titto&apos;s X Fashion Planet</p>
        </div>
      </div>
    </header>
  );
}
