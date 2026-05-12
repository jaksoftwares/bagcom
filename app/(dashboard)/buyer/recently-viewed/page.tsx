'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/services/auth/authService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Clock, History, ArrowRight, Loader2, Package } from 'lucide-react';
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
           // Note: We'll fetch them individually or via a bulk API if available
           const localProducts = await Promise.all(
             localIds.map(async (id: string) => {
               try {
                 const res = await fetch(`/api/products/${id}`); // Assuming this exists
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


  return (
    <div className="space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight text-gray-900">Recently Viewed</h1>
            <p className="text-gray-500 font-medium">Continue where you left off with your most recent searches.</p>
          </div>
          <div className="flex items-center gap-3 bg-primary/5 px-4 py-2 rounded-xl border border-primary/10">
             <History className="h-5 w-5 text-primary" />
             <span className="text-sm font-bold text-primary">{products.length} Items Tracked</span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
          </div>
        ) : products.length === 0 ? (
          <div className="py-24 text-center space-y-6 max-w-md mx-auto">
             <div className="h-20 w-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mx-auto">
                <Package className="h-10 w-10" />
             </div>
             <div>
                <h3 className="text-xl font-bold text-gray-900">No history yet</h3>
                <p className="text-sm text-gray-500 mt-2">Start browsing the marketplace to track items you're interested in.</p>
             </div>
             <Link href="/products">
                <Button className="bg-primary hover:bg-primary/90 font-bold px-8 h-12 rounded-xl shadow-lg shadow-primary/20">
                  Explore Products
                </Button>
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link key={product.id} href={`/product/${product.slug}`} className="group">
                <Card className="border-none shadow-none bg-transparent overflow-hidden">
                  <div className="relative aspect-[4/5] bg-gray-50 rounded-2xl overflow-hidden mb-4 transition-transform duration-500 group-hover:shadow-xl group-hover:-translate-y-1">
                    <Image 
                      src={product.images?.[0]?.image_url || 'https://via.placeholder.com/400x500'} 
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                       <Badge className="bg-white/90 backdrop-blur-md text-gray-900 border-none text-[10px] font-black uppercase tracking-widest py-1.5 px-3">
                         {product.condition}
                       </Badge>
                    </div>
                  </div>
                  <CardContent className="p-0 space-y-2">
                    <div className="flex items-center gap-2">
                       <p className="text-[10px] font-black text-primary uppercase tracking-widest">{product.seller?.first_name} Verified</p>
                       <span className="h-1 w-1 bg-gray-300 rounded-full" />
                       <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                         <Clock className="h-2.5 w-2.5" /> {new Date(product.viewed_at).toLocaleDateString()}
                       </p>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-relaxed">
                      {product.title}
                    </h3>
                    <p className="text-lg font-black text-gray-900">KSh {product.price.toLocaleString()}</p>
                    
                    <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest">
                       View Details <ArrowRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
  );
}
