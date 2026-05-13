'use client';

import { ShoppingBag, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileStickyBarProps {
  price: number;
  onAddToCart: () => void;
  onBuyNow: () => void;
  isWishlisted: boolean;
  onWishlist: () => void;
  isAvailable: boolean;
}

export default function MobileStickyBar({ 
  price, 
  onAddToCart, 
  onBuyNow, 
  isWishlisted, 
  onWishlist,
  isAvailable 
}: MobileStickyBarProps) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-border/20 p-4 pb-8 z-50 shadow-lg">
      <div className="flex items-center gap-4 max-w-lg mx-auto">
        <div className="flex-1 min-w-0">
           <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40 leading-none">Total Price</p>
           <p className="text-lg font-bold text-foreground truncate mt-1">KSh {price.toLocaleString()}</p>
        </div>
        
        <div className="flex items-center gap-2">
           <button 
             onClick={onWishlist}
             className={`h-12 w-12 rounded-md flex items-center justify-center border transition-all active:scale-90 ${
               isWishlisted ? 'bg-rose-50 text-rose-500 border-rose-100' : 'bg-muted/5 text-muted-foreground/30 border-border/20'
             }`}
           >
             <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
           </button>
           
           <Button 
             disabled={!isAvailable}
             onClick={onBuyNow}
             className="h-12 px-8 rounded-md bg-primary text-white font-bold uppercase tracking-widest text-[10px] shadow-sm transition-all"
           >
             <ShoppingBag className="h-4 w-4 mr-2" /> Buy Now
           </Button>
        </div>
      </div>
    </div>
  );
}
