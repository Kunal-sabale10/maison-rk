'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { OrderItem, Product } from '@/types';

interface CartContextType {
  cartItems: OrderItem[];
  cartCount: number;
  cartSubtotal: number;
  shippingFee: number;
  discount: number;
  cartTotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  couponApplied: string | null;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  couponError: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponApplied, setCouponApplied] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Restore cart on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('rk_cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      const savedCoupon = localStorage.getItem('rk_coupon');
      if (savedCoupon) {
        setCouponApplied(savedCoupon);
      }
    } catch (e) {
      console.error("Failed to restore cart state:", e);
    }
  }, []);

  // Save cart changes
  const saveCart = (items: OrderItem[]) => {
    setCartItems(items);
    localStorage.setItem('rk_cart', JSON.stringify(items));
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    const existingIndex = cartItems.findIndex(item => item.product.id === product.id);
    const updated = [...cartItems];

    if (existingIndex > -1) {
      updated[existingIndex].quantity += quantity;
      updated[existingIndex].price = updated[existingIndex].product.price * updated[existingIndex].quantity;
    } else {
      updated.push({
        id: `cart-item-${Date.now()}-${product.id}`,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0]
        },
        quantity,
        price: product.price * quantity
      });
    }
    saveCart(updated);
    setIsCartOpen(true); // Auto-open cart drawer for superb interactive micro-interaction
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const updated = cartItems.map(item => {
      if (item.product.id === productId) {
        return {
          ...item,
          quantity,
          price: item.product.price * quantity
        };
      }
      return item;
    });
    saveCart(updated);
  };

  const removeFromCart = (productId: string) => {
    const updated = cartItems.filter(item => item.product.id !== productId);
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
    setCouponApplied(null);
    setCouponError(null);
    localStorage.removeItem('rk_coupon');
  };

  const applyCoupon = (code: string): boolean => {
    setCouponError(null);
    const upperCode = code.toUpperCase();
    if (upperCode === 'WELCOME10' || upperCode === 'MAISONRK') {
      setCouponApplied(upperCode);
      localStorage.setItem('rk_coupon', upperCode);
      return true;
    } else {
      setCouponError('Invalid coupon code');
      return false;
    }
  };

  // Calculations
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  
  // High-end shipping rules: Free shipping above $300, else flat $20
  const shippingFee = cartSubtotal > 300 || cartSubtotal === 0 ? 0 : 20;
  
  // High-end discount rules
  let discount = 0;
  if (couponApplied === 'WELCOME10') {
    discount = cartSubtotal * 0.1; // 10% off
  } else if (couponApplied === 'MAISONRK') {
    discount = cartSubtotal * 0.2; // 20% off
  }

  const cartTotal = Math.max(0, cartSubtotal + shippingFee - discount);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartSubtotal,
        shippingFee,
        discount,
        cartTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        couponApplied,
        isCartOpen,
        setIsCartOpen,
        couponError
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
