"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { cartService } from "@/services/cartService";
import { useAuth } from "@/store/auth";

const CartContext = createContext(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart phải nằm trong <CartProvider>");
  return ctx;
}

export function CartProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [cartSummary, setCartSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      setCartSummary(null);
      setHydrated(true);
      return;
    }

    try {
      setLoading(true);
      const res = await cartService.getCart();
      const cartData = res?.data || {};
      setItems(cartData.items || []);
      setCartSummary({
        total_quantity: cartData.total_quantity || 0,
        total_rental_fee: cartData.total_rental_fee || 0,
        total_deposit_fee: cartData.total_deposit_fee || 0,
        grand_total: cartData.grand_total || 0,
      });
    } catch (error) {
      console.error("Lỗi khi tải giỏ hàng từ server:", error);
    } finally {
      setLoading(false);
      setHydrated(true);
    }
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    if (authLoading) return;

    if (!user) {
      return;
    }

    cartService.getCart()
      .then((res) => {
        if (!cancelled && res?.data) {
          const cartData = res.data;
          setItems(cartData.items || []);
          setCartSummary({
            total_quantity: cartData.total_quantity || 0,
            total_rental_fee: cartData.total_rental_fee || 0,
            total_deposit_fee: cartData.total_deposit_fee || 0,
            grand_total: cartData.grand_total || 0,
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải giỏ hàng từ server:", error);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
          setHydrated(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  const quote = useMemo(() => {
    const subtotalRental = cartSummary?.total_rental_fee ?? items.reduce((sum, it) => sum + (it.rental_total || 0), 0);
    const totalDeposit = cartSummary?.total_deposit_fee ?? items.reduce((sum, it) => sum + (it.deposit_total || 0), 0);
    const grandTotal = cartSummary?.grand_total ?? (subtotalRental + totalDeposit);

    return {
      subtotalRental,
      totalDeposit,
      grandTotal,
      dueNow: grandTotal,
      discount: 0,
      discountLabel: null,
      shippingFee: 0,
      shippingWaived: false,
      fullPaymentDiscount: 0,
    };
  }, [items, cartSummary]);

  const addLine = useCallback(
    async (input) => {
      if (!user) {
        throw new Error("unauthenticated");
      }

      setLoading(true);
      try {
        await cartService.addToCart(input);
        await refreshCart();
        return { ok: true };
      } catch (error) {
        console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [user, refreshCart],
  );

  const updateLine = useCallback(
    async (id, patch) => {
      if (!user) return;
      try {
        await cartService.updateCartItem(id, patch);
        await refreshCart();
      } catch (error) {
        console.error("Lỗi khi cập nhật giỏ hàng:", error);
      }
    },
    [user, refreshCart],
  );

  const removeLine = useCallback(
    async (id) => {
      if (!user) return;
      try {
        await cartService.removeCartItem(id);
        await refreshCart();
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
      }
    },
    [user, refreshCart],
  );

  const clear = useCallback(async () => {
    if (!user) {
      setItems([]);
      setCartSummary(null);
      return;
    }

    try {
      await cartService.clearCart();
      setItems([]);
      setCartSummary(null);
    } catch (error) {
      console.error("Lỗi khi dọn giỏ hàng:", error);
    }
  }, [user]);

  const value = {
    items,
    lines: items,
    detailed: items,
    hydrated: hydrated || !user,
    loading,
    refreshCart,
    count: cartSummary?.total_quantity ?? items.reduce((sum, l) => sum + (l.quantity || 0), 0),
    quote,
    promotion: null,
    promotionError: null,
    holdExpiresAt: null,
    hasExpiredHold: false,
    addLine,
    updateLine,
    removeLine,
    clear,
    renewHolds: () => {},
    applyPromotion: () => ({ ok: false }),
    clearPromotion: () => {},
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
