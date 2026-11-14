"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, ProductVariant } from "@/types";
import { initialProducts } from "@/lib/mockData";

export interface CartItem {
  variantId: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  isWholesaleTierApplied: boolean;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (variantId: string, quantity: number) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeFromCart: (variantId: string) => void;
  clearCart: () => void;
  subtotal: number;
  totalGst: number;
  grandTotal: number;
  itemCount: number;
  hasWholesaleItems: boolean;
  isWholesaleCustomer: boolean;
  setIsWholesaleCustomer: (val: boolean) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isWholesaleCustomer, setIsWholesaleCustomer] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Compute unit price based on user status and quantity breaks
  const computeUnitPrice = (variant: ProductVariant, qty: number, isWholesale: boolean) => {
    if (isWholesale && variant.wholesaleTiers && variant.wholesaleTiers.length > 0) {
      // Find matching tier
      const matchedTier = [...variant.wholesaleTiers]
        .sort((a, b) => b.minQty - a.minQty)
        .find((tier) => qty >= tier.minQty);

      if (matchedTier) {
        return { price: matchedTier.pricePerUnit, isTier: true };
      }
    }
    return { price: variant.retailPrice, isTier: false };
  };

  const addToCart = (variantId: string, quantity: number) => {
    // Find product and variant from catalog
    let foundProduct: Product | undefined;
    let foundVariant: ProductVariant | undefined;

    for (const prod of initialProducts) {
      const v = prod.variants.find((item) => item.id === variantId);
      if (v) {
        foundProduct = prod;
        foundVariant = v;
        break;
      }
    }

    if (!foundProduct || !foundVariant) return;

    setItems((prev) => {
      const existing = prev.find((item) => item.variantId === variantId);
      const newQty = existing ? existing.quantity + quantity : quantity;
      const { price, isTier } = computeUnitPrice(foundVariant!, newQty, isWholesaleCustomer);

      if (existing) {
        return prev.map((item) =>
          item.variantId === variantId
            ? {
                ...item,
                quantity: newQty,
                unitPrice: price,
                totalPrice: price * newQty,
                isWholesaleTierApplied: isTier,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          variantId,
          product: foundProduct!,
          variant: foundVariant!,
          quantity: newQty,
          unitPrice: price,
          totalPrice: price * newQty,
          isWholesaleTierApplied: isTier,
        },
      ];
    });
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.variantId === variantId) {
          const { price, isTier } = computeUnitPrice(
            item.variant,
            quantity,
            isWholesaleCustomer
          );
          return {
            ...item,
            quantity,
            unitPrice: price,
            totalPrice: price * quantity,
            isWholesaleTierApplied: isTier,
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (variantId: string) => {
    setItems((prev) => prev.filter((item) => item.variantId !== variantId));
  };

  const clearCart = () => {
    setItems([]);
  };

  // Recalculate prices if user toggles Wholesale mode
  useEffect(() => {
    setItems((prev) =>
      prev.map((item) => {
        const { price, isTier } = computeUnitPrice(
          item.variant,
          item.quantity,
          isWholesaleCustomer
        );
        return {
          ...item,
          unitPrice: price,
          totalPrice: price * item.quantity,
          isWholesaleTierApplied: isTier,
        };
      })
    );
  }, [isWholesaleCustomer]);

  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
  // Estimate GST (e.g. standard 12% on pouches / 5% on cotton thellas)
  const totalGst = Math.round(
    items.reduce(
      (acc, item) => acc + (item.totalPrice * (item.product.gstRatePercent || 12)) / 100,
      0
    )
  );
  const grandTotal = subtotal + totalGst;
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const hasWholesaleItems = isWholesaleCustomer || items.some((i) => i.isWholesaleTierApplied || i.quantity >= 50);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        totalGst,
        grandTotal,
        itemCount,
        hasWholesaleItems,
        isWholesaleCustomer,
        setIsWholesaleCustomer,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
