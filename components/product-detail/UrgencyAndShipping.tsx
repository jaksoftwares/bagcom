'use client';

import { useState, useEffect } from 'react';
import { Flame, Truck, Info } from 'lucide-react';
import { Product } from '@/services/products/productService';

interface UrgencyAndShippingProps {
  product: Product;
}

export default function UrgencyAndShipping({ product }: UrgencyAndShippingProps) {
  const [viewers, setViewers] = useState(0);

  useEffect(() => {
    // Simulate real-time viewers looking at this item
    setViewers(Math.floor(Math.random() * 15) + 3);
  }, []);

  const quantity = product.quantity_available || 1;
  const isLowStock = quantity > 0 && quantity <= 5;
  const deliveryDays = 2; // Default campus delivery estimate

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);
  
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="space-y-4 pt-4 border-t border-border/40">
      
      {/* Urgency Drivers */}
      {isLowStock && (
        <div className="flex items-center gap-3 p-3 bg-rose-50 border border-rose-100 rounded-xl">
          <div className="h-8 w-8 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0">
             <Flame className="h-4 w-4 text-rose-500 animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-bold text-rose-600">Only {quantity} left in stock!</p>
            <p className="text-xs font-medium text-rose-500/80">{viewers} people are looking at this right now.</p>
          </div>
        </div>
      )}

      {/* Shipping Details */}
      <div className="flex gap-4 p-4 bg-muted/20 border border-border/40 rounded-xl">
        <Truck className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-bold text-foreground">
            {product.free_shipping ? 'Free Campus Delivery' : 'Standard Delivery'}
          </p>
          <p className="text-sm font-medium text-muted-foreground">
            Get it by <span className="font-bold text-foreground">{formattedDeliveryDate}</span>
          </p>
          <div className="flex items-center gap-1.5 mt-2 cursor-pointer group">
            <Info className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors underline underline-offset-2 decoration-border/50">
              Delivery policies
            </span>
          </div>
        </div>
      </div>
      
    </div>
  );
}
