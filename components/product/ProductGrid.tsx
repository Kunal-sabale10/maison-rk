'use client';

import React from 'react';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import { ProductGridSkeleton } from '../ui/Skeleton';
import { ShoppingBag } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  variant?: 'standard' | 'editorial';
}

export default function ProductGrid({ 
  products, 
  loading = false, 
  variant = 'standard' 
}: ProductGridProps) {
  
  if (loading) {
    return <ProductGridSkeleton count={8} />;
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 font-sans w-full border border-dashed border-border/80 p-8 bg-card/30">
        <ShoppingBag className="h-10 w-10 text-muted-foreground/35 stroke-[1.2] mb-4" />
        <h3 className="font-semibold text-xs uppercase tracking-wider text-foreground">No pieces found</h3>
        <p className="text-[10px] text-muted-foreground max-w-xs mt-2 leading-relaxed">
          We couldn't find any products matching your filters. Try resetting your search parameters.
        </p>
      </div>
    );
  }

  // ==========================================
  // ZARA-STYLE ASYMMETRICAL EDITORIAL GRID
  // ==========================================
  if (variant === 'editorial') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16 w-full items-start animate-fade-in">
        {products.map((product, index) => {
          
          // 1. Product Spotlight: Spans 2 columns on desktop with staggered padding
          if (index === 0) {
            return (
              <div key={product.id} className="col-span-2 md:col-span-2 flex flex-col gap-4 border border-border/10 p-4 bg-secondary/10">
                <ProductCard product={product} />
                <div className="px-2 pb-2">
                  <span className="text-[8px] font-bold tracking-[0.25em] text-highlight uppercase block mb-1">01 / FEATURED SPOTLIGHT</span>
                  <p className="text-[10px] text-muted-foreground leading-normal max-w-sm">
                    A fluid showcase of architectural drape and tailored organic threads. Crafted in limited quantities.
                  </p>
                </div>
              </div>
            );
          }

          // 2. Campaign Storytelling Box: Injected at Index 3 (spans 2 columns on desktop)
          if (index === 3) {
            return (
              <React.Fragment key="editorial-campaign-block">
                {/* Product Card at Index 3 */}
                <div className="col-span-1 md:col-span-1 md:mt-12">
                  <ProductCard product={product} />
                </div>
                
                {/* Minimal Editorial Campaign Text Callout */}
                <div className="col-span-2 md:col-span-2 flex flex-col justify-center p-8 bg-secondary border border-border/40 font-sans h-full select-none text-left gap-4 md:mt-0">
                  <span className="text-[9px] font-bold tracking-[0.3em] text-highlight uppercase">ATELIER CAMPAIGN SS26</span>
                  <h3 className="text-sm font-bold tracking-widest leading-relaxed text-foreground uppercase">
                    “Drape is the structural dialogue between luxury fabric and physical space.”
                  </h3>
                  <p className="text-[10px] text-muted-foreground leading-relaxed tracking-wide">
                    Batch 01/26. Florence tailor inspections, hand-rolled mulberry silk hems, and natural crepes. Exclusively curated for our premium archive.
                  </p>
                  <div className="h-px bg-border/80 w-10 mt-2" />
                </div>
              </React.Fragment>
            );
          }

          // 3. Alternate staggered offsets for other indexes
          const staggerClass = index % 2 === 0 ? 'md:mt-16' : 'md:mt-0';

          return (
            <div key={product.id} className={`col-span-1 md:col-span-1 ${staggerClass}`}>
              <ProductCard product={product} />
            </div>
          );
        })}
      </div>
    );
  }

  // ==========================================
  // STANDARD CATALOG ROW GRID
  // ==========================================
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16 w-full animate-fade-in">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
