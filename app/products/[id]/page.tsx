'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ProductGrid from '@/components/product/ProductGrid';
import { ProductDetailSkeleton } from '@/components/ui/Skeleton';
import { Product } from '@/types';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/hooks/useToast';
import { 
  Heart, 
  ShoppingBag, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Minus,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function ProductDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);

  // Accordion Toggles (Apple style flat look)
  const [accordionOpen, setAccordionOpen] = useState({
    details: true,
    shipping: false,
    returns: false
  });

  const isLiked = product ? isInWishlist(product.id) : false;

  // Fetch product data
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) {
          throw new Error('Product not found');
        }
        const data = await res.json();
        setProduct(data);
        setActiveImageIdx(0);
        setQuantity(1);

        // Fetch related products
        const relRes = await fetch(`/api/products?category=${data.category}`);
        if (relRes.ok) {
          const relData = await relRes.json();
          setRelatedProducts(relData.filter((p: Product) => p.id !== data.id).slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to retrieve specs:', err);
        router.push('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [productId, router]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    toast({
      title: 'Added to Bag',
      description: `${quantity}x ${product.name} added to your shopping bag.`,
      type: 'success'
    });
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    toggleWishlist(product);
    toast({
      title: isLiked ? 'Removed from Wishlist' : 'Saved to Wishlist',
      description: isLiked ? `${product.name} removed.` : `${product.name} saved.`,
      type: 'info'
    });
  };

  const toggleAccordion = (section: 'details' | 'shipping' | 'returns') => {
    setAccordionOpen(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-1 py-12">
          <ProductDetailSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-1 font-sans">
        
        {/* Breadcrumb Menu */}
        <div className="max-w-6xl mx-auto px-6 sm:px-10 pt-8 pb-2 text-[9px] text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
          <span className="cursor-pointer hover:text-foreground" onClick={() => router.push('/')}>Home</span>
          <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
          <span className="cursor-pointer hover:text-foreground" onClick={() => router.push('/products')}>Shop</span>
          <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
          <span className="text-foreground font-semibold">{product.name}</span>
        </div>

        {/* Product Details Grid */}
        <section className="max-w-6xl mx-auto px-6 sm:px-10 py-10 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* LEFT: IMAGE CAROUSEL GALLERY CONTAINER (lg:span-7) */}
            <div className="lg:col-span-7 flex flex-col md:flex-row gap-4 w-full">
              
              {/* Thumbnails list */}
              <div className="order-2 md:order-1 flex md:flex-col gap-2.5 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 w-full md:w-20 flex-shrink-0">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`aspect-square w-16 md:w-20 bg-secondary overflow-hidden flex-shrink-0 border transition-colors cursor-pointer ${
                      idx === activeImageIdx 
                        ? 'border-foreground opacity-100' 
                        : 'border-border opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} thumb ${idx}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Large Zoom Image display */}
              <div 
                className="order-1 md:order-2 w-full md:w-[calc(100%-6rem)] relative aspect-[3/4] bg-secondary border border-border/40 overflow-hidden select-none"
              >
                <img
                  src={product.images[activeImageIdx]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />

                {/* Left/Right quick slides togglers for mobile */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImageIdx(prev => (prev === 0 ? product.images.length - 1 : prev - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-background/50 backdrop-blur-md p-2 border border-border/20 cursor-pointer rounded-full"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setActiveImageIdx(prev => (prev === product.images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-background/50 backdrop-blur-md p-2 border border-border/20 cursor-pointer rounded-full"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* RIGHT: SPECIFICATION DETAILS FORM (lg:span-5) */}
            <div className="lg:col-span-5 flex flex-col gap-6 font-sans">
              
              {/* Title & Price */}
              <div className="flex flex-col gap-2.5">
                <h1 className="text-xl sm:text-2xl uppercase tracking-widest font-bold text-foreground">
                  {product.name}
                </h1>
                <span className="font-semibold text-base text-foreground font-mono mt-1">${product.price}</span>
              </div>

              <div className="h-px bg-border/60 w-full" />

              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Sizing options - Pill Style */}
              <div className="flex flex-col gap-3.5">
                <span className="text-[10px] font-bold tracking-widest uppercase text-foreground">Select Size</span>
                <div className="flex flex-wrap gap-2.5">
                  {['S', 'M', 'L', 'XL'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-9 min-w-16 px-4 border text-[10px] font-bold uppercase rounded-full transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'bg-foreground text-background border-foreground shadow-sm'
                          : 'border-border text-foreground/80 hover:border-foreground bg-transparent'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Secure Add actions */}
              <div className="flex flex-col gap-4 mt-2">
                
                {/* Quantity picker */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-foreground">Quantity</span>
                  <div className="flex items-center border border-border h-10 bg-card">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="px-3 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-2 font-mono text-xs w-6 text-center select-none text-foreground">{quantity}</span>
                    <button
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="px-3 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3.5 mt-2">
                  {/* Add to Cart button - Bold, Full-Width */}
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="flex-grow bg-foreground text-background text-[10px] uppercase tracking-[0.2em] font-bold h-13 flex items-center justify-center gap-2 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer disabled:bg-gray-400"
                  >
                    <ShoppingBag className="h-4 w-4" /> {product.inStock ? 'Add to Bag' : 'Out of Stock'}
                  </button>

                  {/* Wishlist toggle button */}
                  <button
                    onClick={handleWishlistToggle}
                    className="h-13 w-13 border border-border hover:border-foreground flex items-center justify-center text-foreground hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer"
                  >
                    <Heart className={`h-4.5 w-4.5 ${isLiked ? 'fill-foreground text-foreground' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Minimal Apple Accordion Tabs */}
              <div className="border-t border-border mt-8 pt-4 space-y-4">
                
                {/* Accordion 1: Details */}
                <div className="border-b border-border/60 pb-4">
                  <button 
                    onClick={() => toggleAccordion('details')}
                    className="w-full flex justify-between items-center text-[10px] font-bold tracking-widest uppercase text-foreground cursor-pointer py-1.5"
                  >
                    <span>Garment Details</span>
                    {accordionOpen.details ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
                  </button>
                  {accordionOpen.details && (
                    <div className="text-[11px] text-muted-foreground leading-relaxed pt-2.5 space-y-2 animate-fade-in">
                      <p>
                        Tailored from our premium slow-crafted raw textiles, this piece balances structural architectural drape with exceptional everyday comfort. Built to last for generations.
                      </p>
                      {product.specs && product.specs.length > 0 && (
                        <div className="space-y-1.5 pt-2">
                          {product.specs.map((s, idx) => (
                            <div key={idx} className="flex justify-between border-b border-border/30 pb-1 font-sans">
                              <span className="font-semibold text-foreground uppercase text-[9px]">{s.name}</span>
                              <span>{s.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Accordion 2: Shipping */}
                <div className="border-b border-border/60 pb-4">
                  <button 
                    onClick={() => toggleAccordion('shipping')}
                    className="w-full flex justify-between items-center text-[10px] font-bold tracking-widest uppercase text-foreground cursor-pointer py-1.5"
                  >
                    <span>Shipping Policy</span>
                    {accordionOpen.shipping ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
                  </button>
                  {accordionOpen.shipping && (
                    <div className="text-[11px] text-muted-foreground leading-relaxed pt-2.5 space-y-1.5 animate-fade-in font-sans">
                      <p>• Standard Tracked Delivery: Free on all orders above $300, else a flat $20 shipping fee.</p>
                      <p>• Logistics Timelines: Dispatched within 24-48 business hours. Delivery in 3-5 business days.</p>
                      <p>• Sustainable Weaving: Shipped in 100% biodegradable and recyclable signature boxes.</p>
                    </div>
                  )}
                </div>

                {/* Accordion 3: Returns */}
                <div className="border-b border-border/60 pb-4">
                  <button 
                    onClick={() => toggleAccordion('returns')}
                    className="w-full flex justify-between items-center text-[10px] font-bold tracking-widest uppercase text-foreground cursor-pointer py-1.5"
                  >
                    <span>Returns & Exchanges</span>
                    {accordionOpen.returns ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
                  </button>
                  {accordionOpen.returns && (
                    <div className="text-[11px] text-muted-foreground leading-relaxed pt-2.5 space-y-1.5 animate-fade-in font-sans">
                      <p>• Premium Returns: Hassle-free 14-day return window from the day of package receipt.</p>
                      <p>• Exchange Services: Free exchanges on sizing changes. Complementary courier package pickup at your door.</p>
                      <p>• Quality Warranty: Covered by our standard 2-Year Luxury Atelier Construction Guarantee.</p>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* Recomended products */}
        {relatedProducts.length > 0 && (
          <section className="max-w-6xl mx-auto px-6 sm:px-10 py-16 lg:py-20 border-t border-border mt-12">
            <div className="text-center mb-12">
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground">COMPLETE THE LOOK</span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-widest mt-2 text-foreground uppercase">RECOMMENDED</h2>
            </div>
            
            <ProductGrid products={relatedProducts} />
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
