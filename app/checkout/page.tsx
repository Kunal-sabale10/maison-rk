'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { 
  Lock, 
  CreditCard, 
  Wallet, 
  Truck, 
  Loader2, 
  CheckCircle2, 
  ArrowLeft 
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { cartItems, cartSubtotal, shippingFee, discount, cartTotal, clearCart } = useCart();

  // Shipping form fields
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('United States');
  const [phone, setPhone] = useState('');

  // Payment Options
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'razorpay' | 'cod'>('stripe');

  // Checkout Status States
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [orderIdCreated, setOrderIdCreated] = useState('');

  // Auto-fill fields if user is logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      setName(user.name);
      if (user.address) {
        setStreet(user.address.street || '');
        setCity(user.address.city || '');
        setZip(user.address.zip || '');
        setCountry(user.address.country || 'United States');
      }
    }
  }, [user, isAuthenticated]);

  // Prevent accessing checkout with empty cart
  useEffect(() => {
    if (cartItems.length === 0 && !isCompleted) {
      router.push('/cart');
    }
  }, [cartItems, isCompleted, router]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !street || !city || !zip || !phone) {
      toast({
        title: 'Missing Details',
        description: 'Please populate all shipping information fields.',
        type: 'error'
      });
      return;
    }

    setIsProcessing(true);

    // 1. Simulate Stripe / Razorpay connecting and auth processing (2.5s)
    await new Promise((resolve) => setTimeout(resolve, 2500));

    try {
      // 2. Post Order to backend API
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user?.email || 'guest@example.com',
          userName: name,
          items: cartItems,
          subtotal: cartSubtotal,
          shippingFee,
          discount,
          total: cartTotal,
          paymentMethod: paymentMethod === 'stripe' ? 'Stripe (Card)' : paymentMethod === 'razorpay' ? 'Razorpay (UPI)' : 'Cash on Delivery',
          shippingAddress: { name, street, city, zip, country }
        })
      });

      if (!res.ok) {
        throw new Error('Database order creation failed');
      }

      const data = await res.json();
      setOrderIdCreated(data.id);
      
      // 3. Mark success states
      setIsProcessing(false);
      setIsCompleted(true);
      toast({
        title: 'Order Placed!',
        description: 'Your payment was approved and order is locked.',
        type: 'success'
      });

      // 4. Clear shopping cart
      clearCart();
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      toast({
        title: 'Order Error',
        description: 'Failed to create your order. Please try again.',
        type: 'error'
      });
    }
  };

  if (isCompleted) {
    /* Successful Payment Complete screen */
    return (
      <div className="flex flex-col min-h-screen bg-background justify-center">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20 px-4 font-sans text-center">
          <div className="max-w-md w-full bg-card border border-border p-8 md:p-10 shadow-2xl flex flex-col items-center gap-6 animate-fade-in">
            <CheckCircle2 className="h-16 w-16 text-green-500 animate-pulse" />
            <h1 className="font-serif text-3xl font-light text-foreground uppercase tracking-wide">
              ORDER COMPLETED
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed mt-1">
              Thank you for shopping at Maison RK. Your payment was processed successfully. A confirmation email has been dispatched, and your parcel details are registered.
            </p>
            <div className="border border-border/80 w-full p-4 bg-secondary/35 font-mono text-[10px] text-foreground tracking-widest uppercase">
              ORDER ID: {orderIdCreated}
            </div>
            <button
              onClick={() => router.push('/orders')}
              className="w-full bg-foreground text-background text-xs uppercase tracking-widest py-3.5 font-bold transition-transform hover:scale-[1.02] cursor-pointer"
            >
              TRACK ORDER TIMELINE
            </button>
            <button
              onClick={() => router.push('/products')}
              className="text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer underline underline-offset-2"
            >
              Back to Collections
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      {/* Processing Loader Modal */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center text-white font-sans text-center select-none">
          <div className="bg-card border border-border p-8 max-w-sm w-full mx-4 shadow-2xl flex flex-col items-center gap-4 text-foreground">
            <Loader2 className="h-12 w-12 text-foreground animate-spin stroke-[1.5]" />
            <h3 className="font-serif text-lg font-bold tracking-widest uppercase mt-2">PROCESSING PAYMENT</h3>
            <p className="text-[10px] text-muted-foreground leading-relaxed max-w-xs">
              Connecting with Stripe payment gateway. Encrypting transaction details. Do not refresh or exit.
            </p>
          </div>
        </div>
      )}

      <main className="flex-1 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          
          <div className="border-b border-border/60 pb-6 mb-10">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground">SECURE SHIPMENT</span>
            <h1 className="font-serif text-3xl sm:text-4xl font-light text-foreground mt-2 uppercase tracking-wide">
              CHECKOUT FLOW
            </h1>
          </div>

          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* 1. SHIPPING DETAILS & PAYMENTS (lg:span-8) */}
            <div className="lg:col-span-8 flex flex-col gap-10">
              
              {/* Shipping info */}
              <div className="flex flex-col gap-6">
                <h3 className="text-xs uppercase tracking-widest font-bold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
                  <Truck className="h-4 w-4" /> 1. SHIPPING ADDRESS
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                  {/* Full Name */}
                  <div className="sm:col-span-2 flex flex-col gap-2">
                    <label className="font-semibold text-muted-foreground uppercase tracking-wider">Recipient Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      required
                      className="bg-card text-foreground border border-border focus:border-foreground outline-none px-4 py-3 font-medium transition-colors"
                    />
                  </div>

                  {/* Street Address */}
                  <div className="sm:col-span-2 flex flex-col gap-2">
                    <label className="font-semibold text-muted-foreground uppercase tracking-wider">Street Address *</label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Apt, Suite, Building, Street Address"
                      required
                      className="bg-card text-foreground border border-border focus:border-foreground outline-none px-4 py-3 font-medium transition-colors"
                    />
                  </div>

                  {/* City */}
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-muted-foreground uppercase tracking-wider">City *</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      required
                      className="bg-card text-foreground border border-border focus:border-foreground outline-none px-4 py-3 font-medium transition-colors"
                    />
                  </div>

                  {/* ZIP */}
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-muted-foreground uppercase tracking-wider">ZIP / Postal Code *</label>
                    <input
                      type="text"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder="ZIP Code"
                      required
                      className="bg-card text-foreground border border-border focus:border-foreground outline-none px-4 py-3 font-medium transition-colors"
                    />
                  </div>

                  {/* Country */}
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-muted-foreground uppercase tracking-wider">Country *</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="bg-card text-foreground border border-border focus:border-foreground outline-none px-4 py-3 font-semibold transition-colors cursor-pointer"
                    >
                      <option value="United States">United States</option>
                      <option value="Japan">Japan</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Italy">Italy</option>
                      <option value="India">India</option>
                    </select>
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-muted-foreground uppercase tracking-wider">Contact Phone *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone Number"
                      required
                      className="bg-card text-foreground border border-border focus:border-foreground outline-none px-4 py-3 font-medium transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="flex flex-col gap-6">
                <h3 className="text-xs uppercase tracking-widest font-bold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" /> 2. PAYMENT SELECTION
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
                  
                  {/* Stripe Card */}
                  <div
                    onClick={() => setPaymentMethod('stripe')}
                    className={`border p-4 flex flex-col gap-2 cursor-pointer transition-all ${
                      paymentMethod === 'stripe' 
                        ? 'border-foreground bg-secondary/30 shadow-md' 
                        : 'border-border hover:border-foreground'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold uppercase tracking-wider">Credit Card</span>
                      <CreditCard className="h-4 w-4 text-foreground" />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
                      Simulate a secure premium credit/debit card payment processed by Stripe.
                    </p>
                  </div>

                  {/* Razorpay UPI */}
                  <div
                    onClick={() => setPaymentMethod('razorpay')}
                    className={`border p-4 flex flex-col gap-2 cursor-pointer transition-all ${
                      paymentMethod === 'razorpay' 
                        ? 'border-foreground bg-secondary/30 shadow-md' 
                        : 'border-border hover:border-foreground'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold uppercase tracking-wider">Razorpay / UPI</span>
                      <Wallet className="h-4 w-4 text-foreground" />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
                      Simulate dynamic mobile phone UPI or QR scanning wallet transfers.
                    </p>
                  </div>

                  {/* Cash on Delivery */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`border p-4 flex flex-col gap-2 cursor-pointer transition-all ${
                      paymentMethod === 'cod' 
                        ? 'border-foreground bg-secondary/30 shadow-md' 
                        : 'border-border hover:border-foreground'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold uppercase tracking-wider">COD</span>
                      <Truck className="h-4 w-4 text-foreground" />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
                      Pay by Cash/Card upon standard secure courier package delivery.
                    </p>
                  </div>

                </div>

                {/* Card Fields inputs (Rendered if Stripe selected) */}
                {paymentMethod === 'stripe' && (
                  <div className="border border-border/80 p-5 space-y-4 animate-fade-in bg-card/25 text-xs font-sans mt-2">
                    <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">SIMULATED CARD DETAILS</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-2">
                      <div className="sm:col-span-4 flex flex-col gap-1.5">
                        <label className="font-semibold text-muted-foreground tracking-wider uppercase text-[9px]">Card Number</label>
                        <input
                          type="text"
                          defaultValue="4242 •••• •••• 4242"
                          disabled
                          className="bg-card text-foreground border border-border/70 outline-none px-3 py-2.5 font-mono tracking-widest"
                        />
                      </div>
                      
                      <div className="sm:col-span-2 flex flex-col gap-1.5">
                        <label className="font-semibold text-muted-foreground tracking-wider uppercase text-[9px]">Expiry Date</label>
                        <input
                          type="text"
                          defaultValue="12/29"
                          disabled
                          className="bg-card text-foreground border border-border/70 outline-none px-3 py-2.5 font-mono"
                        />
                      </div>
                      
                      <div className="sm:col-span-2 flex flex-col gap-1.5">
                        <label className="font-semibold text-muted-foreground tracking-wider uppercase text-[9px]">CVC Security Code</label>
                        <input
                          type="text"
                          defaultValue="•••"
                          disabled
                          className="bg-card text-foreground border border-border/70 outline-none px-3 py-2.5 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* 2. ORDER SUMMARY CARD (lg:span-4) */}
            <div className="lg:col-span-4 bg-card border border-border p-6 shadow-sm">
              <h3 className="text-xs uppercase tracking-widest font-bold text-foreground border-b border-border pb-4 mb-6">
                ORDER REVIEW
              </h3>

              {/* Items basket preview */}
              <div className="max-h-64 overflow-y-auto space-y-4 mb-6 pr-2 border-b border-border/50 pb-5">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 text-xs font-sans">
                    <div className="h-16 w-12 bg-secondary border border-border/40 overflow-hidden flex-shrink-0">
                      <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="font-medium text-foreground pr-2 line-clamp-1">{item.product.name}</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Quantity: {item.quantity}</p>
                    </div>
                    <div className="flex items-center justify-end font-semibold font-mono text-foreground">
                      ${item.price}
                    </div>
                  </div>
                ))}
              </div>

              {/* Cost Summary block */}
              <div className="space-y-4 text-xs font-sans">
                <div className="flex justify-between text-muted-foreground">
                  <span>Cart Subtotal</span>
                  <span className="font-semibold font-mono text-foreground">${cartSubtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-500 font-medium">
                    <span>Discount Code Applied</span>
                    <span className="font-semibold font-mono">-${discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping Fee</span>
                  <span className="font-semibold font-mono text-foreground">
                    {shippingFee === 0 ? 'FREE' : `$${shippingFee}`}
                  </span>
                </div>

                <div className="h-px bg-border/80 w-full my-4" />

                <div className="flex justify-between text-sm font-semibold text-foreground">
                  <span>Total Amount</span>
                  <span className="font-bold font-mono text-base">${cartTotal}</span>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full bg-foreground text-background text-xs uppercase tracking-[0.2em] py-4 font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-md"
                  >
                    <Lock className="h-4 w-4" /> PLACE ORDER (${cartTotal})
                  </button>
                  
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => router.push('/cart')}
                      className="w-full text-center text-xs uppercase tracking-widest font-semibold py-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" /> Return to Cart
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </form>

        </div>
      </main>

      <Footer />
    </div>
  );
}
