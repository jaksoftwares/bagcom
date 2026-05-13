'use client';

import { 
  ShoppingBag, 
  ShoppingCart, 
  Truck, 
  ShieldCheck, 
  RotateCcw,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PurchasePanelProps {
  product: any;
  onAddToCart: () => void;
  onBuyNow: () => void;
  isAvailable: boolean;
}

export default function PurchasePanel({ product, onAddToCart, onBuyNow, isAvailable }: PurchasePanelProps) {
  return (
    <div className="bg-white rounded-md border border-border/40 p-8 shadow-subtle sticky top-24 space-y-8">
      {/* Availability Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className={`h-2 w-2 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-rose-500'}`} />
           <span className={`text-[9px] font-bold uppercase tracking-widest ${isAvailable ? 'text-emerald-600' : 'text-rose-600'}`}>
             {isAvailable ? 'Available Now' : 'Out of Stock'}
           </span>
        </div>
        <span className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-tighter">
          REF: {product.id.slice(0, 8)}
        </span>
      </div>

      {/* Pricing Section */}
      <div className="space-y-1">
         <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">Item Price</p>
         <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-foreground tracking-tight">KSh {product.price.toLocaleString()}</h3>
            {product.original_price && (
               <span className="text-sm font-semibold text-muted-foreground/30 line-through">KSh {product.original_price.toLocaleString()}</span>
            )}
         </div>
      </div>

      {/* Primary Actions */}
      <div className="space-y-3">
        <Button 
          disabled={!isAvailable}
          onClick={onBuyNow}
          className="w-full h-14 rounded-md bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest text-[10px] shadow-sm transition-all"
        >
          <ShoppingBag className="h-4 w-4 mr-2" /> Buy it now
        </Button>
        <Button 
          disabled={!isAvailable}
          variant="outline"
          onClick={onAddToCart}
          className="w-full h-12 rounded-md border-border/60 hover:bg-muted/5 text-foreground font-bold uppercase tracking-widest text-[10px] transition-all"
        >
          <ShoppingCart className="h-4 w-4 mr-2" /> Add to cart
        </Button>
      </div>

      {/* Logistics & Security */}
      <div className="space-y-4 pt-4 border-t border-border/10">
        {[
          { icon: Truck, title: 'Express Delivery', desc: 'Ships within 24-48 hours' },
          { icon: MapPin, title: 'Pickup Available', desc: product.location || 'Central Nairobi' },
          { icon: RotateCcw, title: '7-Day Protection', desc: 'Secure returns policy' }
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <item.icon className="h-4 w-4 text-muted-foreground/30 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-bold text-foreground uppercase tracking-tight">{item.title}</p>
              <p className="text-[11px] font-semibold text-muted-foreground/60 mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Badge */}
      <div className="p-4 bg-muted/5 rounded-md border border-border/20">
         <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <p className="text-[9px] font-bold uppercase tracking-widest text-primary">Secure Checkout</p>
         </div>
         <div className="flex flex-wrap gap-1.5">
            {['M-PESA', 'ESCROW', 'VISA'].map(tag => (
              <span key={tag} className="text-[8px] font-bold bg-white px-1.5 py-0.5 rounded-sm text-muted-foreground/40 border border-border/20">{tag}</span>
            ))}
         </div>
      </div>
    </div>
  );
}
