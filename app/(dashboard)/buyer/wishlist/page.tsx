'use client';

import { useState, useEffect } from 'react';
import { Heart, ShoppingBag, ArrowRight, Trash2, LayoutGrid, List, Loader2, Package, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { getCurrentUser } from '@/services/auth/authService';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function WishlistPage() {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    async function loadWishlist() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          window.location.href = '/login';
          return;
        }
        setUser(currentUser);

        const res = await fetch(`/api/favorites?userId=${currentUser.id}`);
        const data = await res.json();
        setFavorites(data.favorites || []);
      } catch (error) {
        console.error('Error loading wishlist:', error);
        toast({ title: "Failed to load wishlist", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    loadWishlist();
  }, []);

  const handleRemoveFavorite = async (productId: string) => {
    try {
      const res = await fetch('/api/favorites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, productId }),
      });
      if (res.ok) {
        setFavorites(prev => prev.filter(f => f.product_id !== productId));
        toast({ title: "Item removed from wishlist" });
      } else {
        throw new Error('Failed to remove item');
      }
    } catch (error) {
      toast({ title: "Failed to remove item", variant: "destructive" });
    }
  };

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
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Saved Items</h1>
            <p className="text-gray-500 font-medium mt-1 text-sm">Products you're keeping an eye on.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
             <span className="text-emerald-700 font-bold text-sm tracking-wide">{favorites.length} items</span>
          </div>

          <div className="flex p-1 bg-gray-100 rounded-xl shrink-0">
            <button 
              onClick={() => setViewMode('list')}
              className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-white text-primary shadow-sm" : "text-gray-400 hover:text-gray-700")}
            >
              <List className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-white text-primary shadow-sm" : "text-gray-400 hover:text-gray-700")}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {favorites.length > 0 ? (
        <div className={cn(
          "gap-4 sm:gap-6",
          viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "flex flex-col space-y-4"
        )}>
          {favorites.map((fav) => {
            const item = fav.product;
            if (!item) return null;

            if (viewMode === 'list') {
              return (
                <div key={fav.id} className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-5 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all shadow-sm">
                  <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 bg-gray-50">
                    {item.images?.[0]?.image_url ? (
                      <img src={item.images[0].image_url} alt={item.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Package className="h-8 w-8 text-gray-300" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 w-full space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{item.condition || 'Used'}</span>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{item.title}</h3>
                    <p className="text-lg sm:text-xl font-bold text-gray-900">KSh {item.price.toLocaleString()}</p>
                  </div>

                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t border-gray-100 sm:border-0">
                    <Button onClick={() => handleRemoveFavorite(item.id)} variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline font-medium">Remove</span>
                    </Button>
                    <Button asChild className="rounded-xl shadow-sm font-medium">
                      <Link href={`/product/${item.slug || item.id}`}>View Item</Link>
                    </Button>
                  </div>
                </div>
              );
            }

            return (
              <Card key={fav.id} className="group overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all rounded-2xl bg-white flex flex-col">
                <div className="aspect-square relative bg-gray-50 overflow-hidden border-b border-gray-50">
                  {item.images?.[0]?.image_url ? (
                    <img src={item.images[0].image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Package className="h-10 w-10 text-gray-300" />
                    </div>
                  )}
                  <button 
                    onClick={() => handleRemoveFavorite(item.id)}
                    className="absolute top-3 right-3 h-8 w-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 hover:scale-110 transition-all shadow-sm"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </button>
                </div>
                <CardContent className="p-4 sm:p-5 flex flex-col flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{item.condition || 'Used'}</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 flex-1">{item.title}</h3>
                  <p className="text-lg font-bold text-gray-900 mb-4">KSh {item.price.toLocaleString()}</p>
                  <Button asChild className="w-full rounded-xl shadow-sm font-medium">
                    <Link href={`/product/${item.slug || item.id}`}>View Item</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-gray-100 shadow-sm rounded-2xl bg-white">
          <CardContent className="py-20 text-center space-y-6">
            <div className="h-16 w-16 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center mx-auto">
              <Heart className="h-8 w-8 text-gray-300" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-900">Your wishlist is empty</h3>
              <p className="text-sm font-medium text-gray-500 max-w-xs mx-auto">
                Save items you like and track them here.
              </p>
            </div>
            <Button asChild className="rounded-xl px-8 font-medium shadow-sm">
              <Link href="/products">Explore Marketplace</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
