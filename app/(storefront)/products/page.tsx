'use client';

import { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  Search,
  Filter,
  ArrowUpDown,
  ShoppingBag,
  Zap,
  TrendingUp,
  Clock,
  LayoutGrid,
  List,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Layout & Navigation
import StorefrontLayout from '@/components/layout/StorefrontLayout';
import Header from '@/components/navigation/Header';
import Footer from '@/components/navigation/Footer';

// Marketplace Components
import MarketplaceHeader from '@/components/marketplace/MarketplaceHeader';
import MarketplaceFilters from '@/components/marketplace/MarketplaceFilters';
import ProductToolbar from '@/components/marketplace/ProductToolbar';
import ProductDiscoverySections from '@/components/marketplace/ProductDiscoverySections';
import MarketplaceTrustBanner from '@/components/marketplace/MarketplaceTrustBanner';
import ProductCard from '@/components/products/ProductCard';

// Services
import { getProducts } from '@/services/products/productService';

export default function BrowseProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [allProducts, trending, latest] = await Promise.all([
          getProducts(),
          getProducts({ limit: 4 }), // Trending
          getProducts({ limit: 4 })  // Latest (simulate)
        ]);
        setProducts(allProducts);
        setTrendingProducts(trending);
        setNewArrivals(latest);
      } catch (error) {
        console.error("Error loading marketplace data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <StorefrontLayout>
      <div className="bg-white min-h-screen">
        
        {/* Discovery Header */}
        <MarketplaceHeader />

        {/* Discovery Sections (Featured) */}
        <section className="bg-muted/5 py-16 lg:py-20 border-b border-border/20">
           <div className="container mx-auto px-4">
              <ProductDiscoverySections 
                trending={trendingProducts}
                newArrivals={newArrivals}
              />
           </div>
        </section>

        {/* Trust Banner */}
        <MarketplaceTrustBanner />

        {/* Main Marketplace Area */}
        <main className="container mx-auto px-4 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
             
             {/* LEFT: Sidebar Filters (Desktop) */}
             <aside className="hidden lg:block lg:col-span-3 sticky top-24">
                <MarketplaceFilters />
             </aside>

             {/* RIGHT: Results & Toolbar */}
             <div className="lg:col-span-9 space-y-8">
                
                {/* Results Header & Toolbar */}
                <div className="space-y-6">
                   <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
                      <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                      <ChevronRight className="h-3 w-3 opacity-30" />
                      <span className="text-foreground">Marketplace</span>
                   </nav>
                   
                   <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                      <div className="space-y-1">
                         <h2 className="text-2xl font-bold text-foreground tracking-tight">All products</h2>
                         <p className="text-xs font-semibold text-muted-foreground">Showing <span className="text-foreground">{products.length}</span> verified community items</p>
                      </div>
                      <ProductToolbar 
                        count={products.length}
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                        onMobileFilterOpen={() => setIsMobileFilterOpen(true)}
                      />
                   </div>
                </div>

                {/* Main Results Grid */}
                {isLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="aspect-[4/5] bg-muted/10 animate-pulse rounded-md" />
                    ))}
                  </div>
                ) : products.length > 0 ? (
                  <div className={`grid gap-6 md:gap-8 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-2 md:grid-cols-3' 
                      : 'grid-cols-1'
                  }`}>
                    {products.map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        layout={viewMode}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-24 text-center bg-muted/5 rounded-md border border-dashed border-border/40">
                     <ShoppingBag className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                     <h3 className="text-lg font-bold text-foreground tracking-tight mb-2">No products found</h3>
                     <p className="text-muted-foreground font-medium max-w-xs mx-auto text-sm">We couldn't find any items matching your current filters.</p>
                     <Button variant="outline" className="mt-6 h-10 px-6 rounded-md border-border/60 text-foreground font-bold uppercase tracking-widest text-[10px]">Clear filters</Button>
                  </div>
                )}

                {/* Pagination Placeholder */}
                <div className="pt-16 flex justify-center">
                   <div className="flex items-center gap-2 bg-muted/5 p-1.5 rounded-md border border-border/20">
                      {[1, 2, 3, '...', 12].map((p, i) => (
                        <button 
                          key={i}
                          className={`h-10 w-10 rounded-sm flex items-center justify-center text-[10px] font-bold transition-all ${
                            p === 1 ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground/40 hover:bg-white hover:text-foreground'
                          }`}
                        >
                           {p}
                        </button>
                      ))}
                      <button className="h-10 px-4 rounded-sm flex items-center gap-2 text-[10px] font-bold text-muted-foreground/40 hover:bg-white hover:text-foreground transition-all uppercase tracking-widest">
                         Next <ChevronRight className="h-3 w-3" />
                      </button>
                   </div>
                </div>
             </div>
          </div>
        </main>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
           <div className="absolute inset-y-0 right-0 w-[85%] bg-white shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto p-8">
              <div className="flex items-center justify-between mb-8 pb-8 border-b border-border/20">
                 <h2 className="text-xl font-bold text-foreground tracking-tight">Filters</h2>
                 <button onClick={() => setIsMobileFilterOpen(false)} className="h-10 w-10 rounded-md bg-muted/10 flex items-center justify-center text-muted-foreground">
                    <X className="h-5 w-5" />
                 </button>
              </div>
              <MarketplaceFilters />
              <div className="sticky bottom-0 left-0 right-0 pt-8 mt-8 bg-white border-t border-border/20">
                 <Button onClick={() => setIsMobileFilterOpen(false)} className="w-full h-12 rounded-md bg-primary text-white font-bold uppercase tracking-widest text-[10px] shadow-sm">
                    Show results
                 </Button>
              </div>
           </div>
        </div>
      )}

      <Footer />
    </StorefrontLayout>
  );
}
