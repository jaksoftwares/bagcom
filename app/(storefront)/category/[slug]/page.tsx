'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import StorefrontLayout from '@/components/layout/StorefrontLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Filter, 
  ChevronRight, 
  Package, 
  Star, 
  ArrowUpDown,
  ShoppingBag,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    async function loadCategoryData() {
      try {
        // In a real app, you'd fetch by slug. 
        // For now, we'll fetch all products and filter for the demo/audit
        const res = await fetch('/api/products');
        const data = await res.json();
        
        // Normalize slug to Name (e.g. 'phones' -> 'Phones')
        const formattedName = slug.charAt(0).toUpperCase() + slug.slice(1);
        setCategoryName(formattedName);

        // Filter products if possible, or just show relevant ones
        setProducts(data.products || []);
      } catch (error) {
        console.error('Failed to load category:', error);
      } finally {
        setIsLoading(false);
      }
    }
    if (slug) loadCategoryData();
  }, [slug]);

  return (
    <StorefrontLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/categories" className="hover:text-primary transition-colors">Categories</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-primary">{categoryName}</span>
        </div>

        {/* Hero Section */}
        <div className="relative rounded-[2rem] overflow-hidden bg-slate-900 h-64 flex items-center px-12">
           <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent z-10" />
           <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 z-0">
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000" 
                className="h-full w-full object-cover" 
                alt=""
              />
           </div>
           <div className="relative z-20 space-y-4">
              <h1 className="text-5xl font-black text-white tracking-tight">{categoryName}</h1>
              <p className="text-slate-400 font-medium max-w-md">Discover the best deals on verified {categoryName.toLowerCase()} from trusted sellers.</p>
           </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-soft">
           <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-xl font-bold text-xs gap-2 border-slate-100">
                 <Filter className="h-4 w-4" /> Filters
              </Button>
              <div className="h-6 w-px bg-slate-100 mx-2" />
              <p className="text-xs font-bold text-slate-500">{products.length} Items Found</p>
           </div>
           <div className="flex items-center gap-3">
              <Button variant="ghost" className="rounded-xl font-bold text-xs gap-2 text-slate-500">
                 <ArrowUpDown className="h-4 w-4" /> Sort: Featured
              </Button>
           </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center space-y-4">
             <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <AlertCircle className="h-10 w-10" />
             </div>
             <h3 className="text-xl font-bold text-slate-900">No products found</h3>
             <p className="text-slate-500">We couldn't find any items in this category right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}
