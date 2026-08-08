'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star, MapPin, ShieldCheck, Zap } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface QuickViewModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { toast } = useToast();
  const addToCart = useCartStore(state => state.addToCart);
  
  if (!product) return null;

  const imagesList = product.images || product.product_images || [];
  const primaryImage = imagesList[0]?.image_url || product.image || '/placeholder-product.jpg';
  const categoryName = product.category?.name || product.categories?.name || product.category || 'General';
  const discountPercent = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.title,
      price: product.price,
      image: primaryImage,
      seller: product.seller?.first_name || 'Verified Seller',
      category: categoryName
    });
    toast({ 
      title: "Added to cart", 
      description: `${product.title} has been added to your cart.`
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-2xl bg-white border-border/40 gap-0">
         <VisuallyHidden>
            <DialogTitle>Quick View for {product.title}</DialogTitle>
            <DialogDescription>Quickly view product details and add to cart.</DialogDescription>
         </VisuallyHidden>
         <div className="grid grid-cols-1 md:grid-cols-2 h-full max-h-[85vh]">
            {/* Left: Image */}
            <div className="relative bg-muted/10 h-64 md:h-full w-full min-h-[400px]">
               <Image 
                  src={primaryImage} 
                  alt={product.title}
                  fill
                  className="object-cover"
               />
               <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                  {discountPercent > 0 && (
                     <Badge className="bg-rose-500 text-white border-none px-3 py-1.5 rounded-md font-black text-xs shadow-lg">
                        -{discountPercent}% OFF
                     </Badge>
                  )}
                  {product.condition && (
                     <Badge variant="secondary" className="bg-white/90 backdrop-blur text-foreground border-none px-3 py-1.5 rounded-md font-bold text-[10px] uppercase tracking-widest shadow-sm">
                        {product.condition}
                     </Badge>
                  )}
               </div>
            </div>

            {/* Right: Details */}
            <div className="p-8 md:p-10 flex flex-col justify-between overflow-y-auto">
               <div className="space-y-6">
                  <div className="space-y-2">
                     <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{categoryName}</span>
                        <div className="flex items-center gap-1">
                           <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                           <span className="text-sm font-bold text-foreground">4.8</span>
                        </div>
                     </div>
                     <h2 className="text-2xl font-bold text-foreground leading-snug tracking-tight">
                        {product.title}
                     </h2>
                     <div className="flex items-baseline gap-3 pt-2">
                        <span className="text-3xl font-black text-foreground">
                           KSh {product.price.toLocaleString()}
                        </span>
                        {product.original_price && (
                           <span className="text-lg font-bold text-muted-foreground line-through">
                           {product.original_price.toLocaleString()}
                           </span>
                        )}
                     </div>
                  </div>

                  <div className="prose prose-sm text-muted-foreground font-medium line-clamp-4">
                     {product.description || "No description provided."}
                  </div>

                  <div className="pt-4 border-t border-border/30 space-y-4">
                     <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        Location: <span className="font-bold text-foreground">{product.location?.campus || product.location || 'Nairobi'}</span>
                     </div>
                     <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        Protection: <span className="font-bold text-emerald-600">Escrow Protected</span>
                     </div>
                     <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Zap className="h-4 w-4 text-amber-500" />
                        Availability: <span className="font-bold text-foreground">In Stock</span>
                     </div>
                  </div>
               </div>

               <div className="mt-10 space-y-4">
                  <Button 
                     onClick={handleAddToCart}
                     className="w-full h-14 bg-primary text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-base gap-2"
                  >
                     <ShoppingCart className="h-5 w-5" /> Add to Cart
                  </Button>
                  <Link href={`/product/${product.slug}`} className="block w-full">
                     <Button 
                        variant="outline"
                        onClick={onClose}
                        className="w-full h-14 border-border/60 text-foreground font-bold rounded-xl transition-all"
                     >
                        View Full Details
                     </Button>
                  </Link>
               </div>
            </div>
         </div>
      </DialogContent>
    </Dialog>
  );
}
