'use client';

import { useState } from 'react';
import { Heart, MapPin, Star, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser } from '@/services/auth/authService';

interface ProductCardProps {
  product: any;
  layout?: 'grid' | 'list';
}

export default function ProductCard({ product, layout = 'grid' }: ProductCardProps) {
  const { toast } = useToast();
  const isList = layout === 'list';
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  const displayImage = product.images?.[0]?.image_url || product.product_images?.[0]?.image_url || product.image || '/placeholder-product.jpg';
  const categoryName = product.category?.name || product.categories?.name || product.category;
  const timeDisplay = product.created_at 
    ? new Date(product.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })
    : product.timePosted;

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlistLoading) return;
    setIsWishlistLoading(true);

    try {
      const user = await getCurrentUser();
      if (!user) {
        toast({ title: "Sign in to save items", description: "Create an account or log in to build your wishlist." });
        return;
      }

      if (isWishlisted) {
        await fetch('/api/favorites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, productId: product.id })
        });
        setIsWishlisted(false);
        toast({ title: "Removed from wishlist" });
      } else {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, productId: product.id })
        });
        setIsWishlisted(true);
        toast({ title: "Saved to wishlist" });
      }
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
    } finally {
      setIsWishlistLoading(false);
    }
  };

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className={`bg-white border border-border/30 rounded-sm overflow-hidden transition-all hover:border-primary/30 hover:shadow-subtle ${
        isList ? 'flex h-40 md:h-44' : 'flex flex-col'
      }`}>
        {/* Image */}
        <div className={`relative bg-muted/5 overflow-hidden ${
          isList ? 'w-40 md:w-48 flex-shrink-0' : 'aspect-[1/1]'
        }`}>
          <Image 
            src={displayImage} 
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 left-2">
            <div className="bg-white/90 backdrop-blur-sm text-[9px] font-bold px-1.5 py-0.5 rounded-sm border border-border/20 uppercase tracking-wider text-foreground shadow-sm">
              {product.condition}
            </div>
          </div>
          <button
            onClick={handleWishlist}
            disabled={isWishlistLoading}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-subtle hover:bg-white transition-all"
          >
            <Heart className={`h-3 w-3 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-foreground'}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-2.5 flex flex-col flex-1 min-w-0">
          <div className="flex-1 space-y-0.5">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[9px] font-bold uppercase tracking-tight text-muted-foreground/40 truncate">{categoryName}</span>
              <div className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground/40">
                <Clock className="h-2 w-2" />
                <span>{timeDisplay}</span>
              </div>
            </div>
            <h3 className="text-[12px] md:text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-[1.2] mb-0.5">
              {product.title}
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-[14px] md:text-[15px] font-bold text-foreground">
                KSh {product.price.toLocaleString()}
              </span>
              {product.original_price && (
                <span className="text-[10px] text-muted-foreground line-through opacity-30">
                  {product.original_price.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="pt-1.5 mt-1.5 border-t border-border/10 flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
              <span className="text-[9px] font-bold text-foreground/60">
                {product.seller?.first_name || product.users?.first_name || '4.8'}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[9px] font-medium text-muted-foreground/50 flex-shrink-0">
              <MapPin className="h-2.5 w-2.5" />
              <span>{product.location?.campus || product.location || 'Marketplace'}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
