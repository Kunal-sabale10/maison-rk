'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ProductGrid from '@/components/product/ProductGrid';
import { Product } from '@/types';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

const CATEGORIES = ['All', 'Outerwear', 'Apparel', 'Accessories', 'Footwear'];

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read URL params
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';
  const initialMinPrice = searchParams.get('minPrice') || '';
  const initialMaxPrice = searchParams.get('maxPrice') || '';
  const initialSortBy = searchParams.get('sortBy') || 'newest';

  // Filter States
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync state if URL search parameters change
  useEffect(() => {
    setCategory(searchParams.get('category') || 'All');
    setSearchVal(searchParams.get('search') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setSortBy(searchParams.get('sortBy') || 'newest');
  }, [searchParams]);

  // Fetch products on filter changes
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (category && category !== 'All') queryParams.append('category', category);
        if (searchVal) queryParams.append('search', searchVal);
        if (minPrice) queryParams.append('minPrice', minPrice);
        if (maxPrice) queryParams.append('maxPrice', maxPrice);
        queryParams.append('sortBy', sortBy);

        const res = await fetch(`/api/products?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error('Error fetching filtered products:', err);
      } finally {
        setLoading(false);
      }
    };

    // Add brief debounce for text / price input changes
    const delayDebounce = setTimeout(() => {
      fetchFilteredProducts();
    }, 150);

    return () => clearTimeout(delayDebounce);
  }, [category, searchVal, minPrice, maxPrice, sortBy]);

  // Update URL Search Parameters
  const updateUrlParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`/products?${params.toString()}`);
  };

  const handleResetFilters = () => {
    setSearchVal('');
    setCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    router.replace('/products');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 font-sans">
      
      {/* Title & Mobile Filter Toggler */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-border/60 pb-8 mb-10">
        <div>
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground">MAISON ARCHIVE</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-foreground mt-2 uppercase tracking-wide">
            THE CATALOGUE
          </h1>
        </div>
        
        {/* Actions bar */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Mobile filters toggler */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden flex items-center justify-center gap-2 border border-border bg-card px-4 py-3 text-xs font-semibold uppercase tracking-wider w-full cursor-pointer"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters {products.length > 0 && `(${products.length})`}
          </button>
          
          {/* Sorting picker */}
          <div className="flex items-center gap-2 ml-auto w-full md:w-auto">
            <span className="text-xs text-muted-foreground uppercase tracking-wider hidden sm:inline whitespace-nowrap font-medium">SORT BY</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                updateUrlParams('sortBy', e.target.value);
              }}
              className="bg-card text-foreground text-xs border border-border outline-none px-4 py-3 font-semibold w-full md:w-48 transition-colors cursor-pointer"
            >
              <option value="newest">NEW ARRIVALS</option>
              <option value="price-low">PRICE: LOW TO HIGH</option>
              <option value="price-high">PRICE: HIGH TO LOW</option>
              <option value="rating">HIGHEST RATING</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid & Filters Layout */}
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">

        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:flex flex-col gap-8 w-64 flex-shrink-0 bg-card/10 p-6 border border-border/40">
          
          {/* Category Filter */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs uppercase tracking-widest font-bold text-foreground">Category</h3>
            <div className="flex flex-col gap-2.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    updateUrlParams('category', cat);
                  }}
                  className={`text-left text-xs uppercase tracking-wider font-semibold py-1 transition-colors hover:text-foreground cursor-pointer ${
                    category === cat 
                      ? 'text-foreground font-bold border-l-2 border-foreground pl-3' 
                      : 'text-muted-foreground pl-0'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search Filter */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs uppercase tracking-widest font-bold text-foreground">Search</h3>
            <input
              type="text"
              value={searchVal}
              onChange={(e) => {
                setSearchVal(e.target.value);
                updateUrlParams('search', e.target.value);
              }}
              placeholder="Keywords..."
              className="bg-card text-foreground text-xs border border-border focus:border-foreground outline-none px-3 py-2.5 font-medium transition-colors"
            />
          </div>

          {/* Price Range Filter */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs uppercase tracking-widest font-bold text-foreground">Price Range</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  updateUrlParams('minPrice', e.target.value);
                }}
                placeholder="Min ($)"
                className="bg-card text-foreground text-xs border border-border focus:border-foreground outline-none px-2 py-2 font-medium w-full font-mono transition-colors"
              />
              <span className="text-muted-foreground">—</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  updateUrlParams('maxPrice', e.target.value);
                }}
                placeholder="Max ($)"
                className="bg-card text-foreground text-xs border border-border focus:border-foreground outline-none px-2 py-2 font-medium w-full font-mono transition-colors"
              />
            </div>
          </div>

          {/* Reset button */}
          <button
            onClick={handleResetFilters}
            className="flex items-center justify-center gap-2 border border-border hover:bg-foreground hover:text-background text-foreground py-2.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer mt-4"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset Filters
          </button>
        </aside>

        {/* Mobile Filters Accordion Panel */}
        {showMobileFilters && (
          <div className="md:hidden w-full bg-card border border-border p-6 mb-8 flex flex-col gap-6 animate-slide-down">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <span className="text-xs uppercase tracking-widest font-bold">Refine Archive</span>
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="text-muted-foreground hover:text-foreground text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            
            {/* Category */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Class</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      updateUrlParams('category', cat);
                    }}
                    className={`text-xs uppercase tracking-wider font-semibold px-3 py-1.5 border transition-all cursor-pointer ${
                      category === cat 
                        ? 'bg-foreground text-background border-foreground' 
                        : 'bg-transparent text-foreground border-border hover:border-foreground'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Keyword Search */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Search Keywords</span>
              <input
                type="text"
                value={searchVal}
                onChange={(e) => {
                  setSearchVal(e.target.value);
                  updateUrlParams('search', e.target.value);
                }}
                placeholder="Keywords..."
                className="bg-background text-foreground text-xs border border-border focus:border-foreground outline-none px-3 py-2 font-medium"
              />
            </div>

            {/* Price Limits */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Price Bounds</span>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    updateUrlParams('minPrice', e.target.value);
                  }}
                  placeholder="Min ($)"
                  className="bg-background text-foreground text-xs border border-border focus:border-foreground outline-none px-2 py-2 font-medium w-full font-mono"
                />
                <span className="text-muted-foreground">—</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    updateUrlParams('maxPrice', e.target.value);
                  }}
                  placeholder="Max ($)"
                  className="bg-background text-foreground text-xs border border-border focus:border-foreground outline-none px-2 py-2 font-medium w-full font-mono"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleResetFilters}
                className="flex-1 flex items-center justify-center gap-2 border border-border py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 bg-foreground text-background py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {/* Dynamic products list grid */}
        <div className="flex-1 w-full">
          <ProductGrid products={products} loading={loading} />
        </div>
      </div>
    </div>
  );
}

export default function ProductListingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={
          <div className="max-w-7xl mx-auto px-4 py-20 text-center uppercase tracking-widest font-semibold font-sans text-xs">
            Loading collections...
          </div>
        }>
          <ProductsContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
