'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Grid, 
  List, 
  ChevronRight, 
  SlidersHorizontal,
  ArrowUpDown,
  ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import StorefrontLayout from '@/components/layout/StorefrontLayout';
import { getProducts } from '@/services/products/productService';

export default function BrowseProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();
      setProducts(data);
      setIsLoading(false);
    }
    loadProducts();
  }, []);

  return (
    <StorefrontLayout>
      <div className="bg-[#F9FAFB] min-h-screen">
        
        {/* Marketplace Header & Search Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="container mx-auto px-4 py-4 space-y-4">
             {/* Breadcrumbs */}
             <nav className="flex items-center gap-1.5 text-[11px] text-gray-500">
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-gray-900 font-medium">Browse All Products</span>
             </nav>

             <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="relative w-full lg:max-w-2xl group">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                   <input 
                     type="text" 
                     placeholder="Search marketplace: 'iPhone', 'study desk', 'hoodies'..." 
                     className="w-full h-11 pl-12 pr-4 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                   />
                </div>
                
                <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
                   <Button variant="outline" className="h-10 px-4 rounded-lg border-gray-200 text-sm font-medium shrink-0 gap-2">
                      <SlidersHorizontal className="h-4 w-4" /> Filters
                   </Button>
                   <Button variant="outline" className="h-10 px-4 rounded-lg border-gray-200 text-sm font-medium shrink-0 gap-2">
                      <ArrowUpDown className="h-4 w-4" /> Sort
                   </Button>
                   <div className="h-6 w-px bg-gray-200 mx-1 shrink-0"></div>
                   <div className="flex bg-gray-100 p-1 rounded-md border border-gray-200 shrink-0">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`h-8 w-8 flex items-center justify-center rounded transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                      >
                        <Grid className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`h-8 w-8 flex items-center justify-center rounded transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                      >
                        <List className="h-4 w-4" />
                      </button>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
             
             {/* Sidebar Filters - Desktop */}
             <aside className="hidden lg:block lg:col-span-3 space-y-8">
                <div className="space-y-4">
                   <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Categories</h3>
                   <div className="space-y-2">
                      {['Electronics', 'Furniture', 'Fashion', 'Books', 'Kitchen', 'Others'].map((cat) => (
                        <label key={cat} className="flex items-center gap-2 group cursor-pointer">
                           <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                           <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors font-medium">{cat}</span>
                        </label>
                      ))}
                   </div>
                </div>

                <div className="space-y-4 pt-8 border-t border-gray-200">
                   <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Condition</h3>
                   <div className="space-y-2">
                      {['New', 'Like New', 'Good', 'Fair'].map((cond) => (
                        <label key={cond} className="flex items-center gap-2 group cursor-pointer">
                           <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                           <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors font-medium">{cond}</span>
                        </label>
                      ))}
                   </div>
                </div>

                <div className="space-y-4 pt-8 border-t border-gray-200">
                   <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Price Range</h3>
                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <input type="number" placeholder="Min" className="w-full h-10 px-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                         <span className="text-gray-400">—</span>
                         <input type="number" placeholder="Max" className="w-full h-10 px-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                      <Button className="w-full h-10 rounded-lg text-sm font-bold">Apply Price</Button>
                   </div>
                </div>
             </aside>

             {/* Main Content - Results */}
             <div className="lg:col-span-9 space-y-6">
                <div className="flex items-center justify-between">
                   <p className="text-sm text-gray-500 font-medium">Showing <span className="text-gray-900 font-bold">{products.length}</span> active items</p>
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="aspect-[4/5] bg-gray-200 animate-pulse rounded-xl" />
                    ))}
                  </div>
                ) : (
                  <div className={`grid gap-5 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
                    {products.map((product) => (
                      <Link key={product.id} href={`/product/${product.slug}`}>
                        <div className={`group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-all ${viewMode === 'list' ? 'flex' : ''}`}>
                          <div className={`${viewMode === 'list' ? 'h-40 w-48 shrink-0' : 'aspect-square'} relative overflow-hidden bg-gray-100`}>
                             <img 
                               src={product.images?.[0]?.image_url || 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg'} 
                               alt={product.title}
                               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                             />
                             {product.is_available && (
                               <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-green-600 uppercase tracking-widest border border-green-100">
                                  Available
                               </div>
                             )}
                          </div>
                          <div className="p-4 space-y-2">
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.category?.name}</p>
                             <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{product.title}</h3>
                             <div className="flex items-end justify-between pt-2">
                                <div className="space-y-0.5">
                                   <p className="text-lg font-black text-gray-900 leading-none">KSh {product.price.toLocaleString()}</p>
                                   {product.negotiable && <p className="text-[10px] text-gray-400 font-medium italic">Negotiable</p>}
                                </div>
                                <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all">
                                   <ShoppingBag className="h-4 w-4" />
                                </div>
                             </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
             </div>

          </div>
        </main>
      </div>
    </StorefrontLayout>
  );
}
