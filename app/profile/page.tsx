'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ProductGrid from '@/components/product/ProductGrid';
import { useAuth } from '@/hooks/useAuth';
import { useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/hooks/useToast';
import { User, MapPin, Heart, ShieldCheck, Loader2 } from 'lucide-react';

type Tab = 'account' | 'address' | 'wishlist';

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, loading, updateAddress } = useAuth();
  const { wishlistItems } = useWishlist();
  const { toast } = useToast();

  // Tab controller
  const [activeTab, setActiveTab] = useState<Tab>('account');
  const [isUpdating, setIsUpdating] = useState(false);

  // Address fields
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('United States');

  // Sync active tab with search parameter URL if present
  useEffect(() => {
    const tabParam = searchParams.get('tab') as Tab;
    if (tabParam === 'account' || tabParam === 'address' || tabParam === 'wishlist') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Populate address inputs when user data loads
  useEffect(() => {
    if (user?.address) {
      setStreet(user.address.street || '');
      setCity(user.address.city || '');
      setZip(user.address.zip || '');
      setCountry(user.address.country || 'United States');
    }
  }, [user]);

  // Guard routing: Send to Auth page if not logged in after check completes
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to view your profile dashboard.',
        type: 'error'
      });
      router.push('/auth');
    }
  }, [loading, isAuthenticated, router, toast]);

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const success = await updateAddress(street, city, zip, country);
      if (success) {
        toast({
          title: 'Address Updated',
          description: 'Your delivery address has been saved.',
          type: 'success'
        });
      } else {
        toast({
          title: 'Update Failed',
          description: 'Failed to update address. Please try again.',
          type: 'error'
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center py-20 text-xs gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-foreground stroke-[1.5]" />
        <span className="text-muted-foreground uppercase tracking-widest">Verifying profile session...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      
      <div className="border-b border-border/60 pb-6 mb-10">
        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground">BUYER HUB</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-foreground mt-2 uppercase tracking-wide">
          MY PROFILE
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Sidebar navigation tabs (lg:span-3) */}
        <aside className="lg:col-span-3 flex flex-col gap-1 border border-border bg-card/25 p-4 text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('account')}
            className={`flex items-center gap-2.5 px-4 py-3 text-left transition-colors cursor-pointer ${
              activeTab === 'account' ? 'bg-secondary text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <User className="h-4 w-4" /> Personal Details
          </button>
          
          <button
            onClick={() => setActiveTab('address')}
            className={`flex items-center gap-2.5 px-4 py-3 text-left transition-colors cursor-pointer ${
              activeTab === 'address' ? 'bg-secondary text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <MapPin className="h-4 w-4" /> Saved Address
          </button>
          
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`flex items-center gap-2.5 px-4 py-3 text-left transition-colors cursor-pointer ${
              activeTab === 'wishlist' ? 'bg-secondary text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Heart className="h-4 w-4" /> My Wishlist ({wishlistItems.length})
          </button>
        </aside>

        {/* Active Content view panel (lg:span-9) */}
        <div className="lg:col-span-9 bg-card border border-border p-6 md:p-8 shadow-sm">
          
          {/* Account details */}
          {activeTab === 'account' && (
            <div className="space-y-6 animate-fade-in text-xs">
              <h3 className="text-sm font-serif font-bold uppercase tracking-widest border-b border-border pb-3 mb-6 text-foreground flex items-center gap-2">
                <User className="h-4.5 w-4.5" /> PERSONAL CARD
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 leading-relaxed">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Full Name</span>
                  <span className="text-sm font-semibold text-foreground bg-secondary/30 border border-border/40 px-4 py-3 font-sans mt-1">
                    {user.name}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Email Address</span>
                  <span className="text-sm font-semibold text-foreground bg-secondary/30 border border-border/40 px-4 py-3 font-sans mt-1">
                    {user.email}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Account Tier</span>
                  <span className="text-sm font-semibold text-foreground bg-secondary/30 border border-border/40 px-4 py-3 font-mono mt-1 uppercase flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-foreground" /> {user.role === 'admin' ? 'Maison Elite Admin' : 'Premium Buyer Account'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Address details */}
          {activeTab === 'address' && (
            <form onSubmit={handleSaveAddress} className="space-y-6 animate-fade-in text-xs">
              <h3 className="text-sm font-serif font-bold uppercase tracking-widest border-b border-border pb-3 mb-6 text-foreground flex items-center gap-2">
                <MapPin className="h-4.5 w-4.5" /> SHIPPMENT DESTINATION
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Street */}
                <div className="sm:col-span-2 flex flex-col gap-2">
                  <label className="font-semibold text-muted-foreground uppercase tracking-wider">Street Address *</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Apt, Suite, Building, Street"
                    required
                    className="bg-background text-foreground border border-border focus:border-foreground outline-none px-4 py-3 font-medium transition-colors"
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
                    className="bg-background text-foreground border border-border focus:border-foreground outline-none px-4 py-3 font-medium transition-colors"
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
                    className="bg-background text-foreground border border-border focus:border-foreground outline-none px-4 py-3 font-medium transition-colors"
                  />
                </div>

                {/* Country */}
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-muted-foreground uppercase tracking-wider">Country *</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="bg-background text-foreground border border-border focus:border-foreground outline-none px-4 py-3 font-semibold transition-colors cursor-pointer"
                  >
                    <option value="United States">United States</option>
                    <option value="Japan">Japan</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Italy">Italy</option>
                    <option value="India">India</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-border mt-6">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-foreground text-background text-xs uppercase tracking-widest px-8 py-3.5 font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer disabled:bg-gray-400"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> SAVING CHANGES...
                    </>
                  ) : (
                    'Save Address Details'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Wishlist grid */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-sm font-serif font-bold uppercase tracking-widest border-b border-border pb-3 mb-6 text-foreground flex items-center gap-2">
                <Heart className="h-4.5 w-4.5" /> SAVED ITEMS ({wishlistItems.length})
              </h3>

              <ProductGrid products={wishlistItems} />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function UserProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={
          <div className="max-w-7xl mx-auto px-4 py-20 text-center uppercase tracking-widest font-semibold font-sans text-xs">
            Loading profile details...
          </div>
        }>
          <ProfileContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
