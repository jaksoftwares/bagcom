'use client';

import { useState } from 'react';
import { 
  Heart, 
  MapPin, 
  Star, 
  ShoppingCart, 
  ShieldCheck, 
  Eye,
  Truck
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser } from '@/services/auth/authService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: any;
  layout?: 'grid' | 'list';
}

export default function ProductCard({ product, layout = 'grid' }: ProductCardProps) {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const isGrid = layout === 'grid';
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  const displayImage = product.images?.[0]?.image_url || product.product_images?.[0]?.image_url || product.image || '/placeholder-product.jpg';
  const categoryName = product.category?.name || product.categories?.name || product.category || 'General';
  const sellerName = product.seller?.first_name ? `${product.seller.first_name} ${product.seller.last_name || ''}`.trim() : 'Verified Seller';
  
  const discountPercent = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.title,
      price: product.price,
      image: displayImage,
      seller: sellerName,
      category: categoryName
    });
    toast({ 
      title: "Added to cart", 
      description: `${product.title} has been added.`
    });
  };

  return (
    <div 
      className={`group relative bg-white border border-border/40 overflow-hidden transition-all duration-300 hover:shadow-subtle ${
        !isGrid ? 'flex h-48 md:h-56' : 'flex flex-col rounded-md'
      }`}
    >
      <Link href={`/product/${product.slug}`} className="flex-1 flex flex-col no-underline text-inherit">
        {/* Image Area */}
        <div className={`relative overflow-hidden bg-muted/20 ${
          isGrid ? 'aspect-[4/5]' : 'w-48 md:w-56 shrink-0'
        }`}>
          <Image 
            src={displayImage} 
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Overlay Actions */}
          <div className="absolute top-2 right-2 flex flex-col gap-1.5 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
            <button 
              onClick={handleWishlist}
              className={`p-2 rounded-md shadow-sm transition-all ${
                isWishlisted ? 'bg-rose-500 text-white' : 'bg-white text-foreground hover:text-primary'
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Condition & Discount Badges */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
            {discountPercent > 0 && (
              <Badge className="bg-rose-500 text-white border-none font-bold text-[10px] px-1.5 py-0.5 rounded-sm">
                -{discountPercent}%
              </Badge>
            )}
            {product.condition && (
              <Badge variant="secondary" className="bg-white/90 text-foreground border-none font-semibold text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                {product.condition}
              </Badge>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{categoryName}</span>
              <div className="flex items-center gap-1">
                <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                <span className="text-[10px] font-bold text-foreground">4.8</span>
              </div>
            </div>

            <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug h-10 group-hover:text-primary transition-colors">
              {product.title}
            </h3>

            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-base font-bold text-foreground">
                KSh {product.price.toLocaleString()}
              </span>
              {product.original_price && (
                <span className="text-xs text-muted-foreground line-through">
                  {product.original_price.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Compact Footer */}
          <div className="pt-3 mt-3 border-t border-border/30 flex items-center justify-between">
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
              <MapPin className="h-3 w-3" />
              <span className="truncate max-w-[80px]">{product.location?.campus || product.location || 'Nairobi'}</span>
            </div>
            <div className="flex items-center gap-1">
               <ShieldCheck className="h-3 w-3 text-emerald-500" />
               <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-tighter">Escrow</span>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Quick Add Button */}
      <button 
        onClick={handleAddToCart}
        className="absolute bottom-16 right-3 h-9 w-9 bg-primary text-white rounded-md shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10"
      >
        <ShoppingCart className="h-4 w-4" />
      </button>
    </div>
  );
}
