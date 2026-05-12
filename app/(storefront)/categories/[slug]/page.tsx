'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  ChevronRight,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  LayoutGrid,
  List
} from 'lucide-react';
import Header from '@/components/navigation/Header';
import Footer from '@/components/navigation/Footer';
import ProductCard from '@/components/products/ProductCard';
import Link from 'next/link';
import { getCategoryBySlug, Product } from '@/services/products/productService';

// Category Banner Backgrounds
const categoryBanners: Record<string, string> = {
  'furniture': 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'electronics': 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'kitchen': 'https://images.pexels.com/photos/4252137/pexels-photo-4252137.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'clothing': 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'books': 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'sports': 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'transport': 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=1200',
};

export default function CategoryDetailPage({ params }: { params: { slug: string } }) {
  const [data, setData] = useState<{ category: any; products: Product[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const result = await getCategoryBySlug(params.slug);
      setData(result);
      setIsLoading(false);
    }
    loadData();
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header isLoggedIn={false} setIsLoggedIn={() => {}} />
        <div className="container mx-auto px-4 py-20">
          <div className="h-64 w-full bg-muted/20 animate-pulse rounded-sm mb-12" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-muted/20 animate-pulse rounded-sm" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data?.category) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header isLoggedIn={false} setIsLoggedIn={() => {}} />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold mb-4">Category not found</h1>
          <Button asChild>
            <Link href="/categories">View all categories</Link>
          </Button>
        </div>
      </div>
    );
  }

  const { category, products } = data;
  
  // Filter products by subcategory if selected
  const filteredProducts = selectedSubcategory 
    ? products.filter(p => p.category_id === selectedSubcategory)
    : products;

  return (
    <div className="min-h-screen bg-white">
      <Header isLoggedIn={false} setIsLoggedIn={() => {}} />

      <main>
        {/* Banner Section */}
        <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
          <img 
            src={categoryBanners[category.slug] || categoryBanners['furniture']} 
            className="w-full h-full object-cover transition-transform duration-[10s] scale-110 animate-slow-zoom"
            alt={category.name}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-center container mx-auto px-4 md:px-6">
            <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Marketplace</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/categories" className="hover:text-white transition-colors">Categories</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white">{category.name}</span>
            </nav>
            
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 uppercase">
              {category.name}
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-xl font-medium leading-relaxed">
              Explore the finest collection of {category.name.toLowerCase()} items. Hand-picked quality from our student community.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar / Filters */}
            <aside className="w-full lg:w-64 space-y-10 flex-shrink-0">
              {/* Subcategories */}
              <div className="space-y-6">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground border-b border-border/40 pb-4">
                  Subcategories
                </h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => setSelectedSubcategory(null)}
                    className={`flex items-center justify-between w-full text-left py-2 px-3 rounded-sm transition-all text-[13px] font-bold uppercase tracking-wider ${!selectedSubcategory ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted/10'}`}
                  >
                    All Items
                    <span className="text-[10px] opacity-60">{products.length}</span>
                  </button>
                  {category.subcategories?.map((sub: any) => (
                    <button 
                      key={sub.id}
                      onClick={() => setSelectedSubcategory(sub.id)}
                      className={`flex items-center justify-between w-full text-left py-2 px-3 rounded-sm transition-all text-[13px] font-bold uppercase tracking-wider ${selectedSubcategory === sub.id ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted/10'}`}
                    >
                      {sub.name}
                      <span className="text-[10px] opacity-60">
                        {products.filter(p => p.category_id === sub.id).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Other Filters Placeholder */}
              <div className="space-y-6">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground border-b border-border/40 pb-4">
                  Price Range
                </h3>
                <div className="space-y-4">
                   <div className="flex items-center gap-2">
                      <div className="flex-1 px-3 py-2 bg-muted/5 border border-border/40 text-[12px] font-bold text-muted-foreground">KSH MIN</div>
                      <div className="text-muted-foreground/30">—</div>
                      <div className="flex-1 px-3 py-2 bg-muted/5 border border-border/40 text-[12px] font-bold text-muted-foreground">KSH MAX</div>
                   </div>
                   <Button variant="outline" className="w-full rounded-sm text-[10px] font-bold uppercase tracking-widest h-9">
                     Apply Filter
                   </Button>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-muted/5 p-2 border border-border/30 rounded-sm">
                <div className="flex items-center gap-4 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest px-2">
                  <span className="text-foreground">{filteredProducts.length}</span> Results Found
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
                    Sort By <ArrowUpDown className="h-3 w-3 text-primary" />
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              {filteredProducts.length > 0 ? (
                <div className={viewMode === 'grid' 
                  ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8" 
                  : "flex flex-col gap-4"
                }>
                  {filteredProducts.map(p => (
                    <ProductCard 
                      key={p.id} 
                      product={p} 
                      layout={viewMode} 
                    />
                  ))}
                </div>
              ) : (
                <div className="py-32 text-center space-y-6 border border-dashed rounded-sm bg-muted/5">
                  <Search className="h-12 w-12 text-muted-foreground/20 mx-auto" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground tracking-tight uppercase">No products found</h3>
                    <p className="text-muted-foreground font-medium">Try selecting a different subcategory or clearing filters.</p>
                  </div>
                  <Button variant="outline" className="rounded-sm font-bold uppercase tracking-widest" onClick={() => setSelectedSubcategory(null)}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
