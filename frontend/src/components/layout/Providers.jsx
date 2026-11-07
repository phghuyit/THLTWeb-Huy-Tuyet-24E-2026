"use client";

import { AuthProvider } from "@/store/auth";
import { ToastProvider } from "@/components/ui/Toast";
import { CartProvider } from "@/store/cart";
import { RentalDatesProvider } from "@/store/rentalDates";
import { WishlistProvider } from "@/store/wishlist";

export function Providers({ children }) {
  return (
    <ToastProvider>
      <RentalDatesProvider>
        <WishlistProvider>
          <AuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AuthProvider>
        </WishlistProvider>
      </RentalDatesProvider>
    </ToastProvider>
  );
}
