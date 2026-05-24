'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/useToast';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Plus, 
  Minus, 
  Trash2,
  Lock
} from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { 
    cartItems, 
    cartCount, 
    cartTotal, 
    shippingFee,
    updateQuantity, 
    removeFromCart, 
    isCartOpen, 
    setIsCartOpen,
    applyCoupon,
    couponApplied,
    couponError
  } = useCart();
  const { wishlistCount } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  // Scroll Trigger State
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Monitor page scroll coordinates
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger initial lookup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleCouponApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim()) {
      const success = applyCoupon(couponCode);
      if (success) {
        toast({
          title: 'Coupon Applied',
          description: `Successfully applied promo ${couponCode.toUpperCase()}`,
          type: 'success'
        });
        setCouponCode('');
      } else {
        toast({
          title: 'Invalid Coupon',
          description: 'This discount code is not valid.',
          type: 'error'
        });
      }
    }
  };

  return (
    <>
      {/* Sticky Apple-Style Header Navbar */}
      <header 
        className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-500 ease-in-out ${
          isScrolled 
            ? 'glassmorphic border-b border-border py-4 sm:py-5 shadow-sm' 
            : 'bg-transparent border-b border-transparent py-7 sm:py-9'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-10 flex items-center justify-between font-sans">
          
          {/* Mobile Hamburguer Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-foreground hover:text-muted-foreground transition-colors cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* Logo - Minimal spaced typography */}
          <div className="text-center md:text-left flex-grow md:flex-none">
            <Link 
              href="/" 
              className="text-xs uppercase tracking-[0.35em] font-bold transition-opacity hover:opacity-80"
            >
              MAISON RK
            </Link>
          </div>

          {/* Spaced Apple-Style Navigation Links: Home | Shop | About | Cart */}
          <nav className="hidden md:flex items-center space-x-12 text-[10px] uppercase tracking-[0.25em] font-semibold">
            <Link href="/" className="link-hover-effect text-foreground">Home</Link>
            <Link href="/products" className="link-hover-effect text-foreground">Shop</Link>
            <Link href="/#manifesto" className="link-hover-effect text-foreground" onClick={() => {
              const el = document.getElementById('manifesto');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}>About</Link>
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="link-hover-effect text-foreground uppercase tracking-[0.25em] font-semibold cursor-pointer"
            >
              Cart ({cartCount})
            </button>
          </nav>

          {/* Utilities Widgets - Micro transitions scale */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-foreground hover:text-muted-foreground transition-colors hover:scale-105 active:scale-95 cursor-pointer p-0.5"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Dark/Light mode toggle */}
            <button
              onClick={toggleTheme}
              className="text-foreground hover:text-muted-foreground transition-colors hover:scale-105 active:scale-95 cursor-pointer p-0.5"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            {/* Profile Popover */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="text-foreground hover:text-muted-foreground transition-colors hover:scale-105 active:scale-95 cursor-pointer p-0.5"
              >
                <User className="h-4 w-4" />
              </button>
              {profileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setProfileMenuOpen(false)} />
                  <div className="absolute right-0 mt-4 w-52 bg-card border border-border shadow-2xl z-40 py-2 text-[10px] uppercase tracking-wider font-semibold font-sans">
                    {isAuthenticated && user ? (
                      <>
                        <div className="px-4 py-2 border-b border-border/80 text-[9px] text-muted-foreground tracking-wide font-normal truncate">
                          Signed in: {user.name}
                        </div>
                        {user.role === 'admin' && (
                          <Link
                            href="/admin"
                            className="block px-4 py-2 hover:bg-secondary text-foreground"
                            onClick={() => setProfileMenuOpen(false)}
                          >
                            Admin panel
                          </Link>
                        )}
                        <Link
                          href="/profile"
                          className="block px-4 py-2 hover:bg-secondary text-foreground"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          My profile
                        </Link>
                        <Link
                          href="/orders"
                          className="block px-4 py-2 hover:bg-secondary text-foreground"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          My orders
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setProfileMenuOpen(false);
                            toast({
                              title: 'Signed Out',
                              description: 'Session logged out.',
                              type: 'info'
                            });
                            router.push('/');
                          }}
                          className="w-full text-left block px-4 py-2 text-red-500 hover:bg-secondary cursor-pointer"
                        >
                          Sign out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/auth"
                          className="block px-4 py-2 text-foreground hover:bg-secondary"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          Sign In / Sign Up
                        </Link>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Shopping Cart button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-foreground hover:text-muted-foreground p-0.5 relative transition-colors hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-highlight text-white font-sans font-bold text-[7px] h-3.5 w-3.5 rounded-full flex items-center justify-center border border-background">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Real-time search panel */}
        {searchOpen && (
          <div className="absolute top-full left-0 w-full bg-card border-b border-border py-5 px-6 shadow-md animate-slide-down">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search collection, outerwear, apparel, boots..."
                className="w-full bg-transparent outline-none py-1.5 text-xs text-foreground border-b border-transparent focus:border-border font-sans uppercase tracking-widest transition-colors"
                autoFocus
              />
              <button 
                type="button" 
                onClick={() => setSearchOpen(false)} 
                className="text-muted-foreground hover:text-foreground text-[9px] uppercase tracking-wider font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Spacer to prevent fixed header from overlapping landing page layout */}
      <div className="h-[72px] sm:h-[92px]" />

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" 
            onClick={() => setMobileMenuOpen(false)} 
          />
          <div className="relative z-10 flex flex-col w-4/5 max-w-sm bg-background border-r border-border h-full p-8 text-foreground shadow-2xl animate-slide-right overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-8">
              <span className="text-[10px] tracking-[0.2em] font-semibold">MENU</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-foreground hover:text-muted-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-6 text-[10px] uppercase tracking-[0.25em] font-semibold">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link href="/products" onClick={() => setMobileMenuOpen(false)}>Shop All</Link>
              <Link href="/products?category=Outerwear" onClick={() => setMobileMenuOpen(false)}>Outerwear</Link>
              <Link href="/products?category=Apparel" onClick={() => setMobileMenuOpen(false)}>Apparel</Link>
              <Link href="/products?category=Accessories" onClick={() => setMobileMenuOpen(false)}>Accessories</Link>
              <Link href="/products?category=Footwear" onClick={() => setMobileMenuOpen(false)}>Footwear</Link>
            </nav>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" 
            onClick={() => setIsCartOpen(false)} 
          />
          <div className="relative z-10 flex flex-col w-full max-w-md bg-background border-l border-border h-full p-8 text-foreground shadow-2xl animate-slide-left">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
              <span className="text-[10px] tracking-[0.25em] font-bold uppercase flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" /> YOUR BAG ({cartCount})
              </span>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-foreground hover:text-muted-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items list */}
            <div className="flex-grow overflow-y-auto space-y-6 pr-2">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mb-4 stroke-[1.2]" />
                  <h3 className="font-semibold text-xs uppercase tracking-wider">Bag is empty</h3>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      router.push('/products');
                    }}
                    className="mt-6 bg-foreground text-background text-[10px] uppercase tracking-widest px-6 py-3 font-semibold hover:scale-[1.02] transition-transform cursor-pointer"
                  >
                    View Catalog
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-border pb-5">
                    <div 
                      className="h-20 w-16 bg-secondary overflow-hidden cursor-pointer"
                      onClick={() => {
                        setIsCartOpen(false);
                        router.push(`/products/${item.product.id}`);
                      }}
                    >
                      <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between text-xs">
                      <div>
                        <div className="flex justify-between">
                          <h4 
                            className="font-medium hover:underline cursor-pointer pr-2 line-clamp-1"
                            onClick={() => {
                              setIsCartOpen(false);
                              router.push(`/products/${item.product.id}`);
                            }}
                          >
                            {item.product.name}
                          </h4>
                          <span className="font-semibold font-mono">${item.product.price}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-border">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 px-2 text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            <Minus className="h-2.5 w-2.5" />
                          </button>
                          <span className="px-2 text-[10px] font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 px-2 text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            <Plus className="h-2.5 w-2.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-500 hover:text-red-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Price block & Check-out actions */}
            {cartItems.length > 0 && (
              <div className="border-t border-border pt-6 mt-4 space-y-4 text-xs font-sans">
                <form onSubmit={handleCouponApply} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter Coupon"
                    className="flex-1 bg-secondary text-foreground text-[10px] border border-transparent focus:border-border outline-none px-3 py-2 uppercase font-medium"
                  />
                  <button 
                    type="submit"
                    className="bg-foreground text-background text-[10px] uppercase tracking-widest px-4 py-2 font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
                {couponApplied && (
                  <p className="text-[10px] text-green-500 font-semibold">✓ Coupon {couponApplied} activated</p>
                )}

                <div className="space-y-2 pb-4 border-b border-border">
                  <div className="flex justify-between text-muted-foreground text-[10px] uppercase tracking-wider">
                    <span>Subtotal</span>
                    <span className="font-semibold font-mono text-foreground">${cartTotal + (couponApplied ? (cartTotal * 0.1) : 0)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-[10px] uppercase tracking-wider">
                    <span>Shipping</span>
                    <span className="font-semibold font-mono text-foreground">{shippingFee === 0 ? 'FREE' : `$${shippingFee}`}</span>
                  </div>
                </div>

                <div className="flex justify-between text-sm font-semibold uppercase tracking-wider pt-2">
                  <span>Total Amount</span>
                  <span className="font-bold font-mono text-base">${cartTotal}</span>
                </div>

                <div className="pt-4 space-y-2">
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      router.push('/checkout');
                    }}
                    className="w-full bg-foreground text-background text-[10px] uppercase tracking-[0.2em] py-4 font-bold flex items-center justify-center gap-2 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer"
                  >
                    <Lock className="h-3.5 w-3.5" /> SECURE CHECKOUT
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
