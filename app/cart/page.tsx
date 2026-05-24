'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { 
  ShoppingBag, 
  Minus, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Lock, 
  Tag 
} from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { 
    cartItems, 
    cartCount, 
    cartSubtotal, 
    shippingFee, 
    discount, 
    cartTotal, 
    updateQuantity, 
    removeFromCart, 
    applyCoupon, 
    couponApplied,
    couponError
  } = useCart();

  const [couponCode, setCouponCode] = useState('');

  const handleCouponApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim()) {
      const success = applyCoupon(couponCode);
      if (success) {
        toast({
          title: 'Discount Applied',
          description: `Applied ${couponCode.toUpperCase()} promo discount.`,
          type: 'success'
        });
        setCouponCode('');
      } else {
        toast({
          title: 'Invalid Discount',
          description: 'This promo code does not exist.',
          type: 'error'
        });
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-1 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          
          <div className="border-b border-border/60 pb-6 mb-10">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground">YOUR SELECTION</span>
            <h1 className="font-serif text-3xl sm:text-4xl font-light text-foreground mt-2 uppercase tracking-wide">
              SHOPPING BAG ({cartCount})
            </h1>
          </div>

          {cartItems.length === 0 ? (
            /* Empty Basket State */
            <div className="flex flex-col items-center justify-center text-center py-24 border border-dashed border-border p-8 bg-card/10">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/30 stroke-[1] mb-6 animate-bounce" />
              <h2 className="font-serif text-2xl font-light text-foreground">Your bag is empty</h2>
              <p className="text-sm text-muted-foreground max-w-xs mt-3 leading-relaxed">
                You haven't selected any minimalist pieces yet. Explore our luxury collection.
              </p>
              <Link
                href="/products"
                className="mt-8 bg-foreground text-background text-xs uppercase tracking-widest px-8 py-4 font-bold transition-transform hover:scale-[1.02]"
              >
                RETURN TO SHOP
              </Link>
            </div>
          ) : (
            /* Cart Grid Layout */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Basket list (lg:span-8) */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                
                {/* Header row */}
                <div className="hidden md:grid grid-cols-12 text-[10px] font-bold tracking-widest uppercase text-muted-foreground border-b border-border/80 pb-3">
                  <div className="col-span-6">PRODUCT</div>
                  <div className="col-span-2 text-center">PRICE</div>
                  <div className="col-span-2 text-center">QUANTITY</div>
                  <div className="col-span-2 text-right">TOTAL</div>
                </div>

                {/* Items loop */}
                <div className="flex flex-col gap-6">
                  {cartItems.map((item) => (
                    <div 
                      key={item.id}
                      className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 border-b border-border/40 pb-6 last:border-b-0"
                    >
                      {/* Product column */}
                      <div className="col-span-1 md:col-span-6 flex gap-4">
                        <div 
                          className="h-28 w-20 bg-secondary border border-border/60 overflow-hidden cursor-pointer"
                          onClick={() => router.push(`/products/${item.product.id}`)}
                        >
                          <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <h4 
                            className="font-medium text-sm text-foreground hover:underline cursor-pointer"
                            onClick={() => router.push(`/products/${item.product.id}`)}
                          >
                            {item.product.name}
                          </h4>
                          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">PREMIUM SELECTION</p>
                          
                          {/* Mobile-only trash and price details */}
                          <div className="flex md:hidden items-center gap-4 mt-2">
                            <span className="font-semibold text-xs font-mono">${item.product.price}</span>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-red-500 hover:text-red-600 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Price column */}
                      <div className="hidden md:block col-span-2 text-center font-semibold text-sm font-mono text-foreground">
                        ${item.product.price}
                      </div>

                      {/* Quantity column */}
                      <div className="col-span-1 md:col-span-2 flex justify-center">
                        <div className="flex items-center border border-border bg-card">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 px-2.5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold text-foreground w-6 text-center select-none">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 px-2.5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      {/* Total column */}
                      <div className="col-span-1 md:col-span-2 text-right flex md:block items-center justify-between">
                        <span className="md:hidden text-xs text-muted-foreground uppercase tracking-wider">Item Total</span>
                        <div className="flex items-center justify-end gap-4">
                          <span className="font-semibold text-sm font-mono text-foreground">${item.price}</span>
                          
                          <button
                            onClick={() => {
                              removeFromCart(item.product.id);
                              toast({
                                title: 'Removed Item',
                                description: 'Piece removed from shopping bag.',
                                type: 'info'
                              });
                            }}
                            className="hidden md:block text-muted-foreground hover:text-red-500 cursor-pointer p-1 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

                {/* Back to Shop link */}
                <div className="pt-6">
                  <Link href="/products" className="text-xs font-semibold uppercase tracking-wider hover:text-muted-foreground flex items-center gap-2 underline underline-offset-4 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Totals Summary Card (lg:span-4) */}
              <div className="lg:col-span-4 bg-card border border-border p-6 shadow-sm">
                <h3 className="text-xs uppercase tracking-widest font-bold text-foreground border-b border-border pb-4 mb-6">
                  ORDER SUMMARY
                </h3>

                <div className="space-y-4 text-xs font-sans">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-semibold font-mono text-foreground">${cartSubtotal}</span>
                  </div>
                  
                  {/* Coupon Applied details */}
                  {couponApplied && (
                    <div className="flex justify-between text-green-500 font-medium items-center">
                      <span className="flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" /> Coupon Discount ({couponApplied})</span>
                      <span className="font-semibold font-mono">-${discount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping Fee</span>
                    <span className="font-semibold font-mono text-foreground">
                      {shippingFee === 0 ? 'FREE' : `$${shippingFee}`}
                    </span>
                  </div>

                  {shippingFee > 0 && (
                    <p className="text-[10px] text-muted-foreground leading-normal mt-1 border border-dashed border-border/80 p-2.5 bg-secondary/20">
                      💡 Add <span className="font-semibold text-foreground font-mono">${300 - cartSubtotal}</span> more to unlock **Free standard shipping**!
                    </p>
                  )}

                  <div className="h-px bg-border/80 w-full my-4" />

                  <div className="flex justify-between text-sm font-semibold text-foreground">
                    <span>Total Amount</span>
                    <span className="font-bold font-mono text-base">${cartTotal}</span>
                  </div>

                  {/* Coupon Input Field Form */}
                  <form onSubmit={handleCouponApply} className="flex gap-2 pt-6">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Promo Coupon"
                      className="flex-1 bg-background text-foreground text-xs border border-border focus:border-foreground outline-none px-3 py-2.5 uppercase font-semibold"
                    />
                    <button
                      type="submit"
                      className="bg-foreground text-background text-xs uppercase tracking-wider px-4 py-2.5 font-bold hover:opacity-90 cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                  {couponApplied && (
                    <p className="text-[10px] text-green-500 font-semibold mt-1">
                      ✓ Promo discount activated!
                    </p>
                  )}
                  {couponError && (
                    <p className="text-[10px] text-red-500 font-semibold mt-1">
                      ✗ {couponError}
                    </p>
                  )}

                  <div className="pt-6">
                    <button
                      onClick={() => router.push('/checkout')}
                      className="w-full bg-foreground text-background text-xs uppercase tracking-[0.2em] py-4 font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-md"
                    >
                      <Lock className="h-4 w-4" /> Checkout Securely
                    </button>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground text-[10px] tracking-wider uppercase mt-4">
                      <Lock className="h-3 w-3" /> SSL Secured & Encrypted Payments
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
