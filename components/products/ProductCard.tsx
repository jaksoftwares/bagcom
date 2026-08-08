'use client';

import { useState } from 'react';
import { 
  Heart, 
  MapPin, 
  Star, 
  ShoppingCart, 
  ShieldCheck,
  Eye
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser } from '@/services/auth/authService';
import { Badge } from '@/components/ui/badge';
import QuickViewModal from '@/components/products/QuickViewModal';
import { useCartAnimation } from '@/hooks/useCartAnimation';

interface ProductCardProps {
  product: any;
  layout?: 'grid' | 'list';
}

export default function ProductCard({ product, layout = 'grid' }: ProductCardProps) {
  const { toast } = useToast();
  const { addToCart } = useCartStore();
  const { triggerCartAnimation } = useCartAnimation();
  const isGrid = layout === 'grid';
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Safely get primary and secondary images
  const imagesList = product.images || product.product_images || [];
  const primaryImage = imagesList[0]?.image_url || product.image || '/placeholder-product.jpg';
  const secondaryImage = imagesList.length > 1 ? imagesList[1]?.image_url : primaryImage;

  const categoryName = product.category?.name || product.categories?.name || product.category || 'General';
  
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
      image: primaryImage,
      seller: product.seller?.first_name || 'Verified Seller',
      category: categoryName
    });
    
    // Trigger flying animation
    triggerCartAnimation(e, primaryImage);

    toast({ 
      title: "Added to cart", 
      description: `${product.title} has been added.`
    });
  };

  return (
    <div 
      className={`group relative bg-white flex flex-col transition-all duration-300 hover:-translate-y-1 ${
        !isGrid ? 'flex-row h-48 md:h-56' : 'h-full'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.slug}`} className={`flex-1 flex flex-col no-underline text-inherit ${!isGrid ? 'flex-row w-full' : ''}`}>
        
        {/* Image Area - Square Aspect Ratio for High Density */}
        <div className={`relative overflow-hidden bg-muted/10 rounded-xl ${
          isGrid ? 'aspect-square w-full' : 'w-48 shrink-0 h-full'
        }`}>
          <Image 
            src={isHovered ? secondaryImage : primaryImage} 
            alt={product.title}
            fill
            className={`object-cover transition-opacity duration-500`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Top Overlays */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {discountPercent > 0 && (
              <Badge className="bg-rose-500 text-white border-none font-bold text-[10px] px-2 py-0.5 rounded shadow-sm">
                -{discountPercent}%
              </Badge>
            )}
            {product.condition && (
              <Badge variant="secondary" className="bg-white/95 text-foreground border-none font-bold text-[9px] px-2 py-0.5 rounded shadow-sm uppercase tracking-widest backdrop-blur">
                {product.condition}
              </Badge>
            )}
          </div>

          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
            <button 
              onClick={handleWishlist}
              className={`p-2 rounded-full shadow-sm transition-all ${
                isWishlisted 
                  ? 'bg-rose-500 text-white' 
                  : 'bg-white/90 backdrop-blur text-muted-foreground hover:text-rose-500 hover:bg-white opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0'
              }`}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Action Buttons (Slide up on hover) */}
          <div className="absolute inset-x-2 bottom-2 z-20 flex flex-col gap-1.5 translate-y-[130%] group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
             <button
                onClick={(e) => {
                   e.preventDefault();
                   e.stopPropagation();
                   setIsQuickViewOpen(true);
                }}
                className="w-full bg-white/95 backdrop-blur-sm text-foreground hover:bg-primary hover:text-white font-bold text-[10px] uppercase tracking-widest py-2 rounded-lg shadow-md transition-colors flex items-center justify-center gap-1.5"
             >
                <Eye className="h-3.5 w-3.5" /> Quick View
             </button>
             <button 
                onClick={handleAddToCart}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-[10px] uppercase tracking-widest py-2 rounded-lg shadow-md flex items-center justify-center gap-1.5 transition-colors"
             >
                <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className={`pt-3 pb-1 flex flex-col flex-1 ${!isGrid ? 'pl-5 pr-3' : ''}`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{categoryName}</span>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-[10px] font-bold text-foreground">4.8</span>
            </div>
          </div>

          <h3 className="text-xs font-semibold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors h-8 mt-0.5">
            {product.title}
          </h3>

          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-sm font-bold text-foreground">
              KSh {product.price.toLocaleString()}
            </span>
            {product.original_price && (
              <span className="text-[10px] font-medium text-muted-foreground line-through">
                {product.original_price.toLocaleString()}
              </span>
            )}
          </div>

          <div className="mt-auto pt-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate max-w-[100px]">{product.location?.campus || product.location || 'Nairobi'}</span>
            </div>
            {product.isEscrowProtected !== false && (
              <div className="flex items-center gap-1">
                 <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                 <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter hidden sm:inline-block">Escrow</span>
              </div>
            )}
          </div>
        </div>
      </Link>

      <QuickViewModal 
         product={product}
         isOpen={isQuickViewOpen}
         onClose={() => setIsQuickViewOpen(false)}
      />
    </div>
  );
}
