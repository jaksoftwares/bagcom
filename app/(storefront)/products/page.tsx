'use client';

import { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ShoppingBag,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Layout & Navigation
import StorefrontLayout from '@/components/layout/StorefrontLayout';
import Footer from '@/components/navigation/Footer';

// Marketplace Components
import MarketplaceHeader from '@/components/marketplace/MarketplaceHeader';
import MarketplaceFilters from '@/components/marketplace/MarketplaceFilters';
import ProductToolbar from '@/components/marketplace/ProductToolbar';
import ProductDiscoverySections from '@/components/marketplace/ProductDiscoverySections';
import MarketplaceTrustBanner from '@/components/marketplace/MarketplaceTrustBanner';
import ProductCard from '@/components/products/ProductCard';
import ActiveFilters from '@/components/marketplace/ActiveFilters';
import Pagination from '@/components/marketplace/Pagination';

// Services
import { getProducts, getProductsPaginated } from '@/services/products/productService';

export default function BrowseProductsPage() {
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Extract params
  const category = searchParams.get('category');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const condition = searchParams.get('condition');
  const sort = searchParams.get('sort');
  const freeShipping = searchParams.get('freeShipping') === 'true';
  const escrowProtected = searchParams.get('escrowProtected') === 'true';
  const search = searchParams.get('search');
  const pageParam = searchParams.get('page');
  
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const limit = 24;

  // Load trending and new arrivals once
  useEffect(() => {
    async function loadStaticData() {
      try {
        const [trending, latest] = await Promise.all([
          getProducts({ limit: 4, sort: 'popular' }),
          getProducts({ limit: 4, sort: 'newest' })
        ]);
        setTrendingProducts(trending);
        setNewArrivals(latest);
      } catch (error) {
        console.error("Error loading static marketplace data:", error);
      }
    }
    loadStaticData();
  }, []);

  // Load filtered products when searchParams change
  useEffect(() => {
    async function fetchFilteredData() {
      setIsLoading(true);
      try {
        const data = await getProductsPaginated({
          category: category || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          condition: condition || undefined,
          sort: sort || undefined,
          freeShipping: freeShipping || undefined,
          escrowProtected: escrowProtected || undefined,
          search: search || undefined,
          page: currentPage,
          limit
        });
        
        setProducts(data.products);
        setTotalProducts(data.count);
      } catch (error) {
        console.error("Error loading filtered products:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFilteredData();
  }, [category, minPrice, maxPrice, condition, sort, freeShipping, escrowProtected, search, currentPage]);

  const totalPages = Math.ceil(totalProducts / limit);

  return (
    <StorefrontLayout>
      <div className="bg-background min-h-screen">
        
        <MarketplaceHeader />

        <section className="bg-muted/5 py-16 lg:py-20 border-b border-border/20">
           <div className="container mx-auto px-4">
              <ProductDiscoverySections 
                trending={trendingProducts}
                newArrivals={newArrivals}
              />
           </div>
        </section>

        <MarketplaceTrustBanner />

        <main className="container mx-auto px-4 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
             
             {/* LEFT: Sidebar Filters */}
             <aside className="hidden lg:block lg:col-span-3 sticky top-24">
                <MarketplaceFilters />
             </aside>

             {/* RIGHT: Results & Toolbar */}
             <div className="lg:col-span-9 space-y-8">
                
                <div className="space-y-6">
                   <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                      <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                      <ChevronRight className="h-3 w-3 opacity-30" />
                      <span className="text-foreground">Marketplace</span>
                   </nav>
                   
                   <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                      <div className="space-y-1">
                         <h2 className="text-2xl font-bold text-foreground tracking-tight">All products</h2>
                         <p className="text-xs font-semibold text-muted-foreground">Showing <span className="text-foreground">{totalProducts}</span> verified community items</p>
                      </div>
                      <ProductToolbar 
                        count={totalProducts}
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                        onMobileFilterOpen={() => setIsMobileFilterOpen(true)}
                      />
                   </div>
                   
                   <ActiveFilters />
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="aspect-[4/5] bg-muted/10 animate-pulse rounded-2xl" />
                    ))}
                  </div>
                ) : products.length > 0 ? (
                  <>
                    <div className={`grid gap-4 sm:gap-6 ${
                      viewMode === 'grid' 
                        ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' 
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
                    
                    <Pagination currentPage={currentPage} totalPages={totalPages} />
                  </>
                ) : (
                  <div className="py-24 text-center bg-muted/5 rounded-2xl border border-dashed border-border/40">
                     <ShoppingBag className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                     <h3 className="text-lg font-bold text-foreground tracking-tight mb-2">No products found</h3>
                     <p className="text-muted-foreground font-medium max-w-xs mx-auto text-sm">We couldn't find any items matching your current filters.</p>
                     <Link href="/products">
                        <Button variant="outline" className="mt-6 h-10 px-6 rounded-md border-border/60 text-foreground font-bold uppercase tracking-widest text-[10px]">Clear filters</Button>
                     </Link>
                  </div>
                )}
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
                 <Button onClick={() => setIsMobileFilterOpen(false)} className="w-full h-12 rounded-xl bg-primary text-white font-bold uppercase tracking-widest text-[10px] shadow-sm">
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
