'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search as SearchIcon, 
  Filter, 
  ArrowUpDown, 
  LayoutGrid, 
  List,
  ChevronRight,
  TrendingUp,
  History,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/navigation/Header';
import Footer from '@/components/navigation/Footer';
import ProductCard from '@/components/products/ProductCard';
import Link from 'next/link';
import { getProducts, getCategories, Product } from '@/services/products/productService';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [localQuery, setLocalQuery] = useState(query);

  // Suggestions & Popular Searches
  const popularSearches = ['MacBook Pro', 'Gas Cylinder', 'Study Desk', 'Mountain Bike', 'iPhone'];
  const trendingCategories = ['Electronics', 'Furniture', 'Kitchen'];

  useEffect(() => {
    setLocalQuery(query);
    async function performSearch() {
      setIsLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        getProducts({ search: query }),
        getCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setIsLoading(false);
    }
    performSearch();
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(localQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header isLoggedIn={false} setIsLoggedIn={() => {}} />

      <main className="container mx-auto px-4 sm:px-6 py-6 lg:py-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50 mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Marketplace</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">Search Results</span>
        </nav>

        {/* Search Header Area */}
        <div className="mb-12">
          <form onSubmit={handleSearchSubmit} className="relative max-w-3xl mb-6">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40" />
            <Input 
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search marketplace..."
              className="pl-12 h-14 text-lg rounded-sm border-border/40 focus-visible:ring-primary/20 shadow-none bg-muted/5 font-medium"
            />
            {localQuery && (
              <button 
                type="button"
                onClick={() => setLocalQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>

          <div className="flex flex-wrap items-center gap-3">
             <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
               <TrendingUp className="h-3 w-3" /> Popular:
             </span>
             {popularSearches.map(s => (
               <Link key={s} href={`/search?q=${s}`} className="px-3 py-1 bg-muted/10 hover:bg-primary/5 hover:text-primary border border-border/30 rounded-full text-xs font-bold transition-all">
                 {s}
               </Link>
             ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 space-y-10 flex-shrink-0">
            {/* Filter Group: Categories */}
            <div className="space-y-6">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground border-b border-border/40 pb-4">
                Categories
              </h3>
              <div className="space-y-3">
                {categories.slice(0, 8).map(cat => (
                  <Link 
                    key={cat.id} 
                    href={`/categories/${cat.slug}`}
                    className="flex items-center justify-between group"
                  >
                    <span className="text-[13px] font-medium text-muted-foreground group-hover:text-primary transition-colors">
                      {cat.name}
                    </span>
                    <ChevronRight className="h-3 w-3 text-muted-foreground/20 group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Searches Placeholder */}
            <div className="space-y-6">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground border-b border-border/40 pb-4">
                Refine Search
              </h3>
              <div className="space-y-4">
                 <div className="px-3 py-4 bg-muted/5 border border-dashed border-border/60 rounded-sm text-center">
                    <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">More filters coming soon</p>
                 </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-muted/5 p-2 border border-border/30 rounded-sm">
              <div className="flex items-center gap-4 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest px-2">
                {isLoading ? (
                   <span>Searching...</span>
                ) : (
                   <><span className="text-foreground">{products.length}</span> results for "<span className="text-primary italic capitalize">{query}</span>"</>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 border-r border-border/40 pr-4">
                  <Button 
                    variant="ghost" size="icon" 
                    className={`h-8 w-8 rounded-sm ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground/40'}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" size="icon" 
                    className={`h-8 w-8 rounded-sm ${viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground/40'}`}
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 px-2 text-[11px] font-bold text-foreground uppercase tracking-widest cursor-pointer">
                  Relevance <ArrowUpDown className="h-3 w-3 text-primary" />
                </div>
              </div>
            </div>

            {/* Results Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-muted/20 animate-pulse rounded-sm" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8" 
                : "flex flex-col gap-4"
              }>
                {products.map(p => (
                  <ProductCard 
                    key={p.id} 
                    product={p} 
                    layout={viewMode} 
                  />
                ))}
              </div>
            ) : (
              <div className="py-32 text-center space-y-6 border border-dashed rounded-sm bg-muted/5">
                <SearchIcon className="h-12 w-12 text-muted-foreground/20 mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground tracking-tight uppercase">No results found</h3>
                  <p className="text-muted-foreground font-medium">We couldn't find any products matching your search.</p>
                </div>
                <div className="pt-4 flex justify-center gap-4">
                  <Button variant="outline" className="rounded-sm font-bold uppercase tracking-widest" onClick={() => setLocalQuery('')}>
                    Clear Search
                  </Button>
                  <Button className="rounded-sm font-bold uppercase tracking-widest px-8">
                    Post a Request
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading Search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
