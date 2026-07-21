'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/services/auth/authService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Clock, History, ArrowRight, Loader2, Package, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

export default function RecentlyViewedPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentlyViewed() {
      try {
        const user = await getCurrentUser();
        let dbProducts = [];
        
        // 1. Try fetching from DB
        if (user) {
          try {
            const res = await fetch(`/api/buyer/recently-viewed?userId=${user.id}`);
            const data = await res.json();
            dbProducts = data.products || [];
          } catch (e) {
            console.error('DB fetch error', e);
          }
        }

        // 2. LocalStorage Fallback/Merge
        const localIds = JSON.parse(localStorage.getItem('bagcom_recently_viewed') || '[]');
        
        if (dbProducts.length === 0 && localIds.length > 0) {
           // Fetch full product details for local IDs
           const localProducts = await Promise.all(
             localIds.map(async (id: string) => {
               try {
                 const res = await fetch(`/api/products/${id}`); 
                 const data = await res.json();
                 return { ...data.product, viewed_at: new Date().toISOString() };
               } catch { return null; }
             })
           );
           setProducts(localProducts.filter(p => p !== null));
        } else {
           setProducts(dbProducts);
        }
      } catch (error) {
        toast({ title: "Failed to load viewing history", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    fetchRecentlyViewed();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto space-y-6 sm:space-y-8 pb-8 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <Link href="/buyer">
            <Button variant="ghost" size="icon" className="rounded-full shrink-0 bg-gray-50 hover:bg-gray-100 hidden sm:flex">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Recently Viewed</h1>
            <p className="text-gray-500 font-medium mt-1 text-sm">Your browsing history.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 w-full sm:w-auto justify-between sm:justify-start">
          <History className="h-4 w-4 text-emerald-600 hidden sm:block" />
          <span className="text-sm font-bold text-emerald-700">{products.length} items</span>
        </div>
      </div>

      {products.length === 0 ? (
        <Card className="border-gray-100 shadow-sm rounded-2xl bg-white">
          <CardContent className="py-20 text-center space-y-6">
             <div className="h-16 w-16 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-300 mx-auto">
                <Package className="h-8 w-8" />
             </div>
             <div className="space-y-1">
                <h3 className="text-lg font-semibold text-gray-900">No history yet</h3>
                <p className="text-sm font-medium text-gray-500 max-w-xs mx-auto">Start browsing the marketplace to track items you're interested in.</p>
             </div>
             <Button asChild className="rounded-xl px-8 font-medium shadow-sm">
               <Link href="/products">Explore Products</Link>
             </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {products.map((product) => (
            <Link key={product.id} href={`/product/${product.slug}`} className="group h-full">
              <Card className="h-full overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all rounded-2xl bg-white flex flex-col">
                <div className="relative aspect-square bg-gray-50 overflow-hidden border-b border-gray-50">
                  {product.images?.[0]?.image_url ? (
                    <Image 
                      src={product.images[0].image_url} 
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Package className="h-10 w-10 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                     <Badge className="bg-white/90 backdrop-blur shadow-sm text-gray-900 border-none text-[9px] font-bold uppercase tracking-widest py-0.5 px-2">
                       {product.condition || 'Used'}
                     </Badge>
                  </div>
                </div>
                <CardContent className="p-3 sm:p-4 flex flex-col flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                     <p className="text-[9px] font-bold text-primary uppercase tracking-widest truncate max-w-[80px]">
                       {product.seller?.first_name || 'Seller'}
                     </p>
                     <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                       <Clock className="h-2.5 w-2.5" /> 
                       {product.viewed_at ? new Date(product.viewed_at).toLocaleDateString() : 'Recent'}
                     </p>
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 flex-1">
                    {product.title}
                  </h3>
                  <p className="text-sm sm:text-base font-bold text-gray-900 pt-1">
                    KSh {product.price?.toLocaleString() || '0'}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
