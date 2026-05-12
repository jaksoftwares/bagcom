'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  ShoppingBag, 
  Trash2, 
  Star, 
  MapPin,
  ArrowLeft,
  Loader2,
  Lock
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import StorefrontLayout from '@/components/layout/StorefrontLayout';
import { getCurrentUser } from '@/services/auth/authService';
import { useToast } from '@/hooks/use-toast';

export default function WishlistPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [user, setUser] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        try {
          const res = await fetch(`/api/favorites?userId=${currentUser.id}`);
          const data = await res.json();
          setItems(data.favorites || []);
        } catch {
          toast({ title: "Failed to load wishlist", variant: "destructive" });
        }
      }
      setIsLoading(false);
    }
    load();
  }, []);

  const removeFromWishlist = async (productId: string, favoriteId: string) => {
    if (!user) return;
    setRemovingId(favoriteId);
    try {
      await fetch('/api/favorites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, productId })
      });
      setItems(prev => prev.filter(item => item.id !== favoriteId));
      toast({ title: "Removed from wishlist" });
    } catch {
      toast({ title: "Failed to remove", variant: "destructive" });
    } finally {
      setRemovingId(null);
    }
  };

  const handleBuyNow = (productId: string) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Log in to purchase items.", variant: "destructive" });
      router.push('/login?redirect=/wishlist');
      return;
    }
    router.push(`/checkout?productId=${productId}`);
  };

  return (
    <StorefrontLayout>
      <div className="bg-[#F9FAFB] min-h-screen py-10">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-3">
              <Button variant="ghost" size="sm" asChild className="rounded-lg gap-2 text-gray-500 hover:text-gray-900 -ml-2">
                <Link href="/products">
                  <ArrowLeft className="h-4 w-4" /> Back to Browse
                </Link>
              </Button>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Saved Items</h1>
            <p className="text-gray-500 text-sm font-medium mt-1">
              {isLoading ? 'Loading...' : `${items.length} item${items.length !== 1 ? 's' : ''} saved`}
            </p>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Not Logged In */}
          {!isLoading && !user && (
            <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center space-y-5 shadow-sm">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Lock className="h-7 w-7 text-gray-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-gray-900">Sign in to view your wishlist</h2>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">Create an account or log in to save items and access them from any device.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild className="rounded-lg px-8 font-bold">
                  <Link href="/login?redirect=/wishlist">Sign In</Link>
                </Button>
                <Button variant="outline" asChild className="rounded-lg px-8 font-bold border-gray-200">
                  <Link href="/register">Create Account</Link>
                </Button>
              </div>
            </div>
          )}

          {/* Empty Wishlist */}
          {!isLoading && user && items.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center space-y-5 shadow-sm">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Heart className="h-7 w-7 text-gray-300" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-gray-900">No saved items yet</h2>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">Tap the heart icon on any item to save it here for later.</p>
              </div>
              <Button asChild className="rounded-lg px-8 font-bold">
                <Link href="/products">Browse Items</Link>
              </Button>
            </div>
          )}

          {/* Wishlist Items */}
          {!isLoading && user && items.length > 0 && (
            <div className="space-y-4">
              {items.map((item) => {
                const product = item.product;
                if (!product) return null;
                const image = product.product_images?.[0]?.image_url || product.images?.[0]?.image_url || null;
                const sellerName = product.seller?.first_name
                  ? `${product.seller.first_name} ${product.seller.last_name || ''}`.trim()
                  : 'Verified Seller';
                const isAvailable = product.is_available && product.status === 'ACTIVE';

                return (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col sm:flex-row gap-0">
                    {/* Image */}
                    <Link href={`/product/${product.slug}`} className="relative w-full sm:w-40 h-44 sm:h-auto bg-gray-100 flex-shrink-0 block">
                      {image ? (
                        <Image src={image} alt={product.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Heart className="h-10 w-10" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                          {isAvailable ? 'Available' : 'Sold'}
                        </span>
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="flex-1 p-5 flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                              {product.category?.name} · {product.condition}
                            </p>
                            <Link href={`/product/${product.slug}`}>
                              <h3 className="font-bold text-gray-900 text-base leading-tight hover:text-primary transition-colors line-clamp-2">
                                {product.title}
                              </h3>
                            </Link>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xl font-bold text-gray-900">KSh {product.price.toLocaleString()}</p>
                            {product.negotiable && (
                              <p className="text-[10px] text-primary font-bold mt-0.5">Negotiable</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-3 text-xs text-gray-500 font-medium">
                          <span>by {sellerName}</span>
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>4.8</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          onClick={() => handleBuyNow(product.id)}
                          disabled={!isAvailable}
                          className="gap-2 text-xs h-9 rounded-lg font-bold flex-1 sm:flex-none"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          {isAvailable ? 'Buy Now' : 'Unavailable'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => removeFromWishlist(product.id, item.id)}
                          disabled={removingId === item.id}
                          className="gap-2 text-xs h-9 rounded-lg font-bold border-gray-200 text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          {removingId === item.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                          Remove
                        </Button>
                        <p className="text-[10px] text-gray-400 font-medium self-center ml-auto">
                          Saved {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </StorefrontLayout>
  );
}
