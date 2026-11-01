"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type CartLine = { productId: string; size: string; quantity: number };

type StoreContext = {
  ready: boolean;
  cart: CartLine[];
  cartCount: number;
  addToCart: (productId: string, size: string, quantity?: number) => void;
  setQuantity: (productId: string, size: string, quantity: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
};

const Ctx = createContext<StoreContext | null>(null);
const CART_KEY = "tfp_cart";
const WISHLIST_KEY = "tfp_wishlist";

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    // localStorage is only available in the browser, so state is hydrated after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCart(load<CartLine[]>(CART_KEY, []));
    setWishlist(load<string[]>(WISHLIST_KEY, []));
    setReady(true);
  }, []);

  const updateCart = useCallback((fn: (c: CartLine[]) => CartLine[]) => {
    setCart((prev) => {
      const next = fn(prev);
      save(CART_KEY, next);
      return next;
    });
  }, []);

  const addToCart = useCallback(
    (productId: string, size: string, quantity = 1) =>
      updateCart((c) => {
        const existing = c.find((l) => l.productId === productId && l.size === size);
        if (existing) {
          return c.map((l) => (l === existing ? { ...l, quantity: l.quantity + quantity } : l));
        }
        return [...c, { productId, size, quantity }];
      }),
    [updateCart],
  );

  const setQuantity = useCallback(
    (productId: string, size: string, quantity: number) =>
      updateCart((c) =>
        c.map((l) => (l.productId === productId && l.size === size ? { ...l, quantity: Math.max(1, quantity) } : l)),
      ),
    [updateCart],
  );

  const removeFromCart = useCallback(
    (productId: string, size: string) =>
      updateCart((c) => c.filter((l) => !(l.productId === productId && l.size === size))),
    [updateCart],
  );

  const clearCart = useCallback(() => updateCart(() => []), [updateCart]);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) => {
      const next = prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId];
      save(WISHLIST_KEY, next);
      return next;
    });
  }, []);

  return (
    <Ctx.Provider
      value={{
        ready,
        cart,
        cartCount: cart.reduce((n, l) => n + l.quantity, 0),
        addToCart,
        setQuantity,
        removeFromCart,
        clearCart,
        wishlist,
        toggleWishlist,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
