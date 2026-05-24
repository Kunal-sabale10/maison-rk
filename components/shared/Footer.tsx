import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Ethos */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif tracking-[0.2em] font-bold text-md text-foreground">MAISON RK</h3>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              Maison RK represents a curated lifestyle of architectural precision, fluid lines, and luxury organic textile design. Crafted for the premium buyer.
            </p>
            <div className="text-xs text-muted-foreground mt-4 font-semibold tracking-widest uppercase">
              FLORENCE — TOKYO — BEVERLY HILLS
            </div>
          </div>

          {/* Shop categories */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground">COLLECTIONS</h4>
            <nav className="flex flex-col gap-3 text-xs text-muted-foreground">
              <Link href="/products" className="hover:text-foreground transition-colors">Shop All Goods</Link>
              <Link href="/products?category=Outerwear" className="hover:text-foreground transition-colors">Premium Outerwear</Link>
              <Link href="/products?category=Apparel" className="hover:text-foreground transition-colors">Apparel & Knitwear</Link>
              <Link href="/products?category=Accessories" className="hover:text-foreground transition-colors">Structured Bags & Accs</Link>
              <Link href="/products?category=Footwear" className="hover:text-foreground transition-colors">Nubuck & Leather Footwear</Link>
            </nav>
          </div>

          {/* Customer Service */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground">CUSTOMER CARE</h4>
            <nav className="flex flex-col gap-3 text-xs text-muted-foreground">
              <span className="hover:text-foreground transition-colors cursor-pointer">Shipping & Delivery Info</span>
              <span className="hover:text-foreground transition-colors cursor-pointer">Premium Return Policy</span>
              <span className="hover:text-foreground transition-colors cursor-pointer">Garment Care & Sizing</span>
              <span className="hover:text-foreground transition-colors cursor-pointer">Store Location Appointments</span>
              <span className="hover:text-foreground transition-colors cursor-pointer">Sustainable Sourcing Manifesto</span>
            </nav>
          </div>

          {/* Newsletter subscription */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground">NEWSLETTER</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Subscribe to unlock early editorial campaigns, limited batch drops, and premium styling lookbooks.
            </p>
            <form className="flex flex-col sm:flex-row gap-2 mt-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter email address"
                required
                className="bg-background text-foreground text-xs border border-border focus:border-foreground outline-none px-4 py-3 font-medium w-full transition-colors"
              />
              <button
                type="submit"
                className="bg-foreground text-background text-xs uppercase tracking-widest px-6 py-3 font-semibold transition-transform hover:scale-[1.02] cursor-pointer"
              >
                JOIN
              </button>
            </form>
          </div>
        </div>

        {/* Copy, Terms and social links */}
        <div className="border-t border-border mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
          <div>
            © {new Date().getFullYear()} MAISON RK CORP. ALL RIGHTS RESERVED.
          </div>
          <div className="flex space-x-6">
            <span className="hover:text-foreground transition-colors cursor-pointer">INSTAGRAM</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">PINTEREST</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">TIKTOK</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">JOURNAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
