"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { usePersistentState } from "@/hooks";

const WishlistContext = createContext(null);

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist phải nằm trong <WishlistProvider>");
  return ctx;
}

export function WishlistProvider({ children }) {
  const [slugs, setSlugs, hydrated] = usePersistentState("stylerent.wishlist.v1", []);

  const has = useCallback((slug) => slugs.includes(slug), [slugs]);

  const toggle = useCallback(
    (slug) => {
      const next = !slugs.includes(slug);
      setSlugs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
      return next;
    },
    [slugs, setSlugs],
  );

  const remove = useCallback((slug) => setSlugs((prev) => prev.filter((s) => s !== slug)), [setSlugs]);
  const clear = useCallback(() => setSlugs([]), [setSlugs]);

  const value = useMemo(
    () => ({ slugs, hydrated, has, toggle, remove, clear, count: slugs.length }),
    [slugs, hydrated, has, toggle, remove, clear],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
