'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Order } from '@/types';
import { 
  ShoppingBag, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Package, 
  Truck, 
  CheckCircle,
  Loader2 
} from 'lucide-react';

const STATUS_TIMELINES = [
  { key: 'pending', label: 'Order Registered', icon: Clock },
  { key: 'processing', label: 'Hand-tailoring & Packaging', icon: Package },
  { key: 'shipped', label: 'Courier Dispatched', icon: Truck },
  { key: 'delivered', label: 'Parcel Handed Over', icon: CheckCircle }
];

export default function OrderHistoryPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const { toast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Authenticated route guard
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to view your order history.',
        type: 'error'
      });
      router.push('/auth');
    }
  }, [loading, isAuthenticated, router, toast]);

  // Fetch orders from API
  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!user) return;
      try {
        const res = await fetch(`/api/orders?email=${user.email}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
          // Expand the first order by default if it exists
          if (data.length > 0) {
            setExpandedOrder(data[0].id || data[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setOrdersLoading(false);
      }
    };
    if (user) {
      fetchUserOrders();
    }
  }, [user]);

  const toggleExpandOrder = (id: string) => {
    setExpandedOrder(prev => (prev === id ? null : id));
  };

  const getStatusIndex = (status: string) => {
    return STATUS_TIMELINES.findIndex(s => s.key === status);
  };

  if (loading || ordersLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background justify-center items-center font-sans text-xs">
        <Loader2 className="h-6 w-6 animate-spin text-foreground stroke-[1.5]" />
        <span className="mt-3 text-muted-foreground uppercase tracking-widest">Loading order archives...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-1 font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          
          <div className="border-b border-border/60 pb-6 mb-10">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground">TRACK SHIPMENTS</span>
            <h1 className="font-serif text-3xl sm:text-4xl font-light text-foreground mt-2 uppercase tracking-wide">
              ORDER ARCHIVE
            </h1>
          </div>

          {orders.length === 0 ? (
            /* No Orders Blank State */
            <div className="flex flex-col items-center justify-center text-center py-20 border border-dashed border-border p-8 bg-card/25">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/30 stroke-[1.2] mb-4 animate-bounce" />
              <h2 className="font-serif text-xl font-light text-foreground">No purchases registered</h2>
              <p className="text-xs text-muted-foreground max-w-xs mt-2 leading-relaxed">
                You haven't purchased any luxury garments yet. Start shopping to fill your archive!
              </p>
              <button
                onClick={() => router.push('/products')}
                className="mt-6 bg-foreground text-background text-xs uppercase tracking-widest px-6 py-3 font-semibold transition-transform hover:scale-[1.02] cursor-pointer"
              >
                DISCOVER GOODS
              </button>
            </div>
          ) : (
            /* Orders collapsible list */
            <div className="flex flex-col gap-6">
              {orders.map((order) => {
                const id = order.id || order._id || '';
                const isExpanded = expandedOrder === id;
                const statusIdx = getStatusIndex(order.deliveryStatus);

                return (
                  <div key={id} className="border border-border bg-card shadow-sm">
                    
                    {/* Collapsible header summary block */}
                    <div 
                      onClick={() => toggleExpandOrder(id)}
                      className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer hover:bg-secondary/15 transition-colors"
                    >
                      <div className="grid grid-cols-2 sm:flex gap-x-8 gap-y-2 text-xs font-sans">
                        <div className="flex flex-col gap-1 pr-4">
                          <span className="font-semibold text-muted-foreground uppercase text-[9px] tracking-wider">ORDER NUMBER</span>
                          <span className="font-semibold text-foreground font-mono text-[11px] truncate w-28 uppercase">{id}</span>
                        </div>
                        <div className="flex flex-col gap-1 pr-4">
                          <span className="font-semibold text-muted-foreground uppercase text-[9px] tracking-wider">DATE PLACED</span>
                          <span className="font-semibold text-foreground">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-muted-foreground uppercase text-[9px] tracking-wider">TOTAL PAID</span>
                          <span className="font-semibold text-foreground font-mono font-bold">${order.total}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 ml-auto sm:ml-0 font-sans">
                        <span className={`text-[9px] font-bold tracking-widest uppercase px-3 py-1 border ${
                          order.deliveryStatus === 'delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                          order.deliveryStatus === 'shipped' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                          'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        }`}>
                          {order.deliveryStatus}
                        </span>
                        
                        {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                      </div>
                    </div>

                    {/* Collapsed specification drawer details */}
                    {isExpanded && (
                      <div className="p-6 border-t border-border bg-card/25 animate-fade-in flex flex-col gap-8">
                        
                        {/* A. VISUAL TIMELINE STEPPER SEGMENT */}
                        <div className="flex flex-col gap-4">
                          <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">DELIVERY SHIPMENT TIMELINE</span>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-2 mt-2 font-sans relative">
                            {STATUS_TIMELINES.map((step, idx) => {
                              const StepIcon = step.icon;
                              const isActive = idx <= statusIdx;
                              const isCurrent = idx === statusIdx;

                              return (
                                <div key={step.key} className="flex sm:flex-col items-center gap-3 sm:gap-2 relative z-10">
                                  {/* Step Circle */}
                                  <div className={`h-8 w-8 border rounded-full flex items-center justify-center transition-all ${
                                    isCurrent ? 'bg-foreground text-background border-foreground scale-110 shadow-md' :
                                    isActive ? 'bg-secondary text-foreground border-foreground' :
                                    'bg-card text-muted-foreground border-border'
                                  }`}>
                                    <StepIcon className="h-4 w-4" />
                                  </div>
                                  
                                  {/* Step Label */}
                                  <div className="flex flex-col sm:items-center sm:text-center">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                                      {step.label}
                                    </span>
                                    {isCurrent && (
                                      <span className="text-[8px] tracking-widest text-muted-foreground font-bold uppercase mt-0.5 animate-pulse">
                                        ACTIVE STATUS
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* B. LIST OF PURCHASED ITEMS */}
                        <div className="flex flex-col gap-3">
                          <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">ITEMS REGISTERED</span>
                          <div className="flex flex-col gap-4">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex gap-4 items-center border-b border-border/30 pb-4 last:border-b-0 last:pb-0">
                                <div className="h-16 w-12 bg-secondary border border-border/40 overflow-hidden flex-shrink-0">
                                  <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                                </div>
                                <div className="flex-1 text-xs">
                                  <h4 className="font-semibold text-foreground">{item.product.name}</h4>
                                  <p className="text-[10px] text-muted-foreground mt-0.5">Quantity: {item.quantity} • Unit: ${item.product.price}</p>
                                </div>
                                <div className="text-right font-semibold font-mono text-xs text-foreground">
                                  ${item.price}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* C. SHIPPING ADDRESS & PRICE CALCULATIONS GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-border/60 pt-6 mt-2 text-xs">
                          {/* Shipping address details */}
                          <div className="flex flex-col gap-2">
                            <span className="font-bold text-muted-foreground uppercase tracking-widest text-[9px]">SHIPPING DESTINATION</span>
                            <div className="leading-relaxed bg-secondary/35 border border-border/45 p-4 rounded-sm font-sans text-foreground">
                              <p className="font-semibold text-sm">{order.shippingAddress.name}</p>
                              <p className="mt-1">{order.shippingAddress.street}</p>
                              <p>{order.shippingAddress.city}, {order.shippingAddress.zip}</p>
                              <p>{order.shippingAddress.country}</p>
                            </div>
                          </div>

                          {/* Order Price computations summaries */}
                          <div className="flex flex-col gap-2 font-sans">
                            <span className="font-bold text-muted-foreground uppercase tracking-widest text-[9px]">BILLING COMPUTATION</span>
                            <div className="space-y-2 border border-border/45 p-4 bg-secondary/35">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Basket Subtotal</span>
                                <span className="font-semibold font-mono text-foreground">${order.subtotal}</span>
                              </div>
                              {order.discount > 0 && (
                                <div className="flex justify-between text-green-500 font-medium">
                                  <span>Coupon Discount Applied</span>
                                  <span className="font-semibold font-mono">-${order.discount}</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Standard Delivery</span>
                                <span className="font-semibold font-mono text-foreground">
                                  {order.shippingFee === 0 ? 'FREE' : `$${order.shippingFee}`}
                                </span>
                              </div>
                              <div className="h-px bg-border/50 my-2" />
                              <div className="flex justify-between text-sm font-bold text-foreground">
                                <span>Charged Total</span>
                                <span className="font-mono text-base">${order.total}</span>
                              </div>
                              <div className="text-[10px] text-muted-foreground mt-2 border-t border-border/40 pt-2 flex justify-between">
                                <span>GATEWAY METHOD</span>
                                <span className="font-bold uppercase tracking-wider text-foreground">{order.paymentMethod}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
