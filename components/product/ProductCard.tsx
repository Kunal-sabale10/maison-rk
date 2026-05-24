'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const isLiked = isInWishlist(product.id);
  const primaryImage = product.images[0];
  const secondaryImage = product.images[1] || product.images[0];

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    toast({
      title: isLiked ? 'Removed from Wishlist' : 'Saved to Wishlist',
      description: isLiked ? `${product.name} removed.` : `${product.name} bookmarked.`,
      type: 'info'
    });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast({
      title: 'Added to Bag',
      description: `${product.name} successfully added to bag.`,
      type: 'success'
    });
  };

  return (
    <div className="group relative flex flex-col gap-3 font-sans select-none overflow-hidden bg-background">
      
      {/* Flat image container with stable height constraints */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary border border-border/40 min-h-[290px] sm:min-h-[350px] md:min-h-[320px] lg:min-h-[360px]">
        
        {/* Transparent bookmark heart toggler */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-4 right-4 z-10 bg-background/50 backdrop-blur-md hover:bg-background border border-border/20 p-2 rounded-full shadow-sm text-foreground transition-all duration-300 transform active:scale-95 cursor-pointer"
        >
          <Heart 
            className={`h-3.5 w-3.5 transition-colors ${
              isLiked 
                ? 'fill-foreground text-foreground' 
                : 'text-foreground/80 hover:text-foreground'
            }`} 
          />
        </button>

        {/* Dynamic Image Container (Zara zoom on hover) */}
        <Link href={`/products/${product.id}`} className="block h-full w-full">
          <img
            src={primaryImage}
            alt={product.name}
            className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-102 group-hover:opacity-0"
          />
          <img
            src={secondaryImage}
            alt={`${product.name} hover`}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-102 group-hover:opacity-100"
          />
        </Link>

        {/* Zara Quick Add Overlay - Flat, Elegant, Fades up on hover */}
        {product.inStock ? (
          <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
            <button
              onClick={handleQuickAdd}
              className="w-full bg-foreground text-background text-[10px] uppercase tracking-widest font-bold py-3.5 flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
            >
              <ShoppingBag className="h-3.5 w-3.5" /> QUICK ADD
            </button>
          </div>
        ) : (
          <div className="absolute bottom-0 left-0 w-full p-4">
            <div className="w-full bg-secondary/80 text-foreground text-center py-2.5 text-[9px] uppercase tracking-widest font-bold border border-border/50">
              OUT OF STOCK
            </div>
          </div>
        )}
      </div>

      {/* Zara details Block (Only Name & Price) - Responsive alignment */}
      <div className="flex flex-col gap-1 px-1 font-sans">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline text-[11px] tracking-wide text-foreground gap-1">
          <Link href={`/products/${product.id}`} className="hover:underline flex-grow pr-4">
            <h3 className="font-semibold uppercase line-clamp-2 sm:line-clamp-1 leading-snug">{product.name}</h3>
          </Link>
          <span className="font-semibold font-mono text-[12px] sm:text-[11px]">${product.price}</span>
        </div>
      </div>


    </div>
  );
}
