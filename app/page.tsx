'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ProductGrid from '@/components/product/ProductGrid';
import { Product } from '@/types';
import { ArrowRight, ChevronDown } from 'lucide-react';

const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1200',
    title: 'ARCHITECTURAL PRECISION',
    subtitle: 'THE SPRING/SUMMER COLLECTION',
    cta: 'EXPLORE APPAREL',
    link: '/products?category=Apparel'
  },
  {
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1200',
    title: 'THE SILK TRENCH COAT',
    subtitle: 'FLORENTINE TAILORING, MODERN SILHOUETTES',
    cta: 'SHOP OUTERWEAR',
    link: '/products?category=Outerwear'
  },
  {
    image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=1200',
    title: 'REFINED ACCESSORIES',
    subtitle: 'STRUCTURED CALFSKIN LEATHER GOODS',
    cta: 'DISCOVER BAGS',
    link: '/products?category=Accessories'
  }
];

export default function LandingPage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate Hero slider every 6s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Fetch featured items
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('/api/products?sortBy=rating');
        if (res.ok) {
          const data = await res.json();
          setFeaturedProducts(data.slice(0, 5)); // Load top 5 for the editorial layout
        }
      } catch (e) {
        console.error("Failed to load featured goods:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Fullscreen Editorial Hero Slider */}
        <section className="relative h-[85vh] sm:h-screen w-full overflow-hidden bg-black">
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-70 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover scale-[1.01]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          ))}

          {/* Hero Content Overlay */}
          <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-6 font-sans text-white">
            <p className="text-[9px] sm:text-[10px] font-bold tracking-[0.45em] uppercase text-gray-300 animate-fade-in mb-4">
              {HERO_SLIDES[currentSlide].subtitle}
            </p>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-[0.16em] uppercase leading-tight max-w-5xl animate-slide-up font-sans">
              {HERO_SLIDES[currentSlide].title}
            </h1>
            <div className="mt-10 animate-fade-in">
              <Link
                href={HERO_SLIDES[currentSlide].link}
                className="bg-white text-black text-[10px] uppercase tracking-widest px-8 py-4 font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] inline-flex items-center gap-2"
              >
                {HERO_SLIDES[currentSlide].cta} <ArrowRight className="h-4 w-4 text-black" />
              </Link>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden sm:flex flex-col items-center gap-1.5 text-white/50 animate-pulse">
            <span className="text-[8px] uppercase tracking-[0.3em] font-semibold font-sans">Scroll to explore</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </div>

          {/* Slider Bullet Dots */}
          <div className="absolute bottom-8 right-10 z-20 flex space-x-3">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1 w-1 transition-all duration-300 cursor-pointer ${
                  i === currentSlide ? 'bg-white w-6' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </section>

        {/* Minimalist Brand Manifesto Grid */}
        <section id="manifesto" className="max-w-6xl mx-auto px-6 sm:px-10 py-24 lg:py-32 font-sans scroll-mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="flex flex-col gap-6">
              <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-muted-foreground">01 / OUR PHILOSOPHY</span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-wide text-foreground leading-snug uppercase">
                Designed for fluidity, engineered for comfort, crafted for permanence.
              </h2>
              <div className="h-px w-12 bg-foreground/20" />
            </div>
            <div className="flex flex-col gap-5 text-xs text-muted-foreground leading-relaxed">
              <p>
                At Maison RK, we disconnect from hyper-trend fast cycles. We specialize in producing small, slow-crafted batches of functional modern wardrobe staples that balance organic silk-weaves, heavy virgin wool, and vegetable calfskin treatments.
              </p>
              <p>
                Every stitch is inspected at our Florence atelier, blending Japanese minimalist design philosophy with Italian garment execution to bring luxury comfort directly to your modern landscape.
              </p>
              <div className="mt-4">
                <Link href="/products" className="text-foreground hover:text-muted-foreground text-[10px] uppercase tracking-widest font-bold inline-flex items-center gap-2 underline underline-offset-4">
                  VIEW OUR ARCHIVE <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Visual ASYMMETRICAL Staggered Category Grid */}
        <section className="bg-secondary border-y border-border py-24 font-sans">
          <div className="max-w-6xl mx-auto px-6 sm:px-10">
            <div className="text-center mb-20">
              <span className="text-[9px] font-bold tracking-[0.35em] uppercase text-muted-foreground">02 / CURATED COLLECTIONS</span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-widest mt-2 text-foreground uppercase">EDITORIAL INDEX</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              
              {/* Column 1: Outerwear - Spans 2 rows on desktop */}
              <div className="md:col-span-1 flex flex-col gap-8">
                <Link href="/products?category=Outerwear" className="group relative aspect-[3/4] bg-background border border-border/30 overflow-hidden block">
                  <img
                    src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=400"
                    alt="Outerwear"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-black/35 group-hover:bg-black/15 transition-all duration-300" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-[10px] font-bold tracking-[0.25em] uppercase">OUTERWEAR</h3>
                    <span className="text-[8px] text-gray-300 font-semibold tracking-wider uppercase mt-1 block">Atelier trench & blazers</span>
                  </div>
                </Link>
                <div className="px-2">
                  <span className="text-[9px] font-bold tracking-[0.2em] text-highlight uppercase">BATCH NO. 04 / TRENCHES</span>
                  <p className="text-[10px] text-muted-foreground leading-relaxed mt-1">
                    Classic tailoring inspected under natural light inside our Florence production workshop. Heavy organic silk-cotton twists.
                  </p>
                </div>
              </div>

              {/* Column 2: Apparel - Offset down (md:mt-16) to create asymmetric stagger */}
              <div className="md:col-span-1 md:mt-16 flex flex-col gap-8">
                <Link href="/products?category=Apparel" className="group relative aspect-[3/4] bg-background border border-border/30 overflow-hidden block">
                  <img
                    src="https://images.unsplash.com/photo-1574164904299-3a102b110380?q=80&w=400"
                    alt="Apparel"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-black/35 group-hover:bg-black/15 transition-all duration-300" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-[10px] font-bold tracking-[0.25em] uppercase">APPAREL</h3>
                    <span className="text-[8px] text-gray-300 font-semibold tracking-wider uppercase mt-1 block">Relaxed Knitwear & Sets</span>
                  </div>
                </Link>
                <div className="px-2">
                  <span className="text-[9px] font-bold tracking-[0.2em] text-highlight uppercase">BATCH NO. 09 / APPAREL</span>
                  <p className="text-[10px] text-muted-foreground leading-relaxed mt-1">
                    Fluid wide-leg satin sets and 12-gauge Mongolian cashmere drop-neck knits. Engineered for architectural layout contours.
                  </p>
                </div>
              </div>

              {/* Column 3: Accessories & Footwear - Two blocks standard */}
              <div className="md:col-span-1 flex flex-col gap-10">
                <div className="flex flex-col gap-4">
                  <Link href="/products?category=Accessories" className="group relative aspect-[4/5] bg-background border border-border/30 overflow-hidden block">
                    <img
                      src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400"
                      alt="Accessories"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-102"
                    />
                    <div className="absolute inset-0 bg-black/35 group-hover:bg-black/15 transition-all duration-300" />
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-[10px] font-bold tracking-[0.25em] uppercase">ACCESSORIES</h3>
                    </div>
                  </Link>
                </div>

                <div className="flex flex-col gap-4">
                  <Link href="/products?category=Footwear" className="group relative aspect-[4/5] bg-background border border-border/30 overflow-hidden block">
                    <img
                      src="https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=400"
                      alt="Footwear"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-102"
                    />
                    <div className="absolute inset-0 bg-black/35 group-hover:bg-black/15 transition-all duration-300" />
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-[10px] font-bold tracking-[0.25em] uppercase">FOOTWEAR</h3>
                    </div>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Featured Products Grid - ASYMMETRICAL EDITORIAL MODE */}
        <section className="max-w-6xl mx-auto px-6 sm:px-10 py-24 lg:py-32 font-sans">
          <div className="flex flex-col sm:flex-row justify-between items-baseline mb-20 border-b border-border pb-6">
            <div>
              <span className="text-[9px] font-bold tracking-[0.35em] uppercase text-muted-foreground">03 / CURATED ARCHIVE</span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-widest mt-2 text-foreground uppercase">EDITORIAL CAMPAIGNS</h2>
            </div>
            <Link href="/products" className="text-[10px] uppercase tracking-widest font-semibold hover:text-muted-foreground underline underline-offset-4 mt-3 sm:mt-0 transition-colors">
              VIEW THE COMPLETE ARCHIVE
            </Link>
          </div>

          {/* Renders the newly engineered asymmetrical visual hierarchy */}
          <ProductGrid products={featuredProducts} loading={loading} variant="editorial" />
        </section>

        {/* Parallax Campaign Showcase */}
        <section className="relative h-[65vh] w-full overflow-hidden bg-black font-sans">
          <img
            src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1200"
            alt="Noir Campaign"
            className="absolute inset-0 h-full w-full object-cover opacity-45 scale-[1.01]"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 text-white z-10">
            <span className="text-[9px] font-bold tracking-[0.45em] uppercase text-gray-300">04 / THE NOIR EDITION</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-[0.16em] uppercase mt-3 mb-8">POLISHED ACETATE FRAMES</h2>
            <Link
              href="/products?category=Accessories"
              className="bg-white text-black text-[10px] uppercase tracking-widest px-8 py-4 font-bold transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              DISCOVER BATCHES
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
