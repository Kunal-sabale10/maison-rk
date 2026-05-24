import React from 'react';

export function Skeleton({ className }: { className?: string }) {
  return <div className={`shimmer-bg ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {/* Image box */}
      <Skeleton className="w-full aspect-[3/4]" />
      {/* Title */}
      <Skeleton className="h-4 w-3/4" />
      {/* Category */}
      <Skeleton className="h-3 w-1/3" />
      {/* Price */}
      <Skeleton className="h-4 w-1/4" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 w-full max-w-7xl mx-auto px-4 py-8 animate-pulse">
      {/* Image Gallery */}
      <Skeleton className="w-full aspect-square lg:aspect-[4/5]" />
      
      {/* Product Information */}
      <div className="flex flex-col gap-6">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-24" />
        <div className="space-y-2 mt-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="flex gap-4 mt-6">
          <Skeleton className="h-12 w-40" />
          <Skeleton className="h-12 w-12" />
        </div>
        <div className="space-y-4 mt-8">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-border w-full animate-pulse">
      <Skeleton className="h-12 w-12" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <Skeleton className="h-6 w-20" />
    </div>
  );
}
