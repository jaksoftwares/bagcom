'use client';

import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function CartDrawer() {
  const isCartDrawerOpen = useUIStore((state) => state.isCartDrawerOpen);
  const closeCartDrawer = useUIStore((state) => state.closeCartDrawer);
  
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCartStore();

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={closeCartDrawer}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-500">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/40">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground tracking-tight">Your Cart</h2>
            <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
              {cart.length}
            </span>
          </div>
          <button 
            onClick={closeCartDrawer}
            className="h-10 w-10 rounded-full bg-muted/30 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-24 w-24 bg-muted/20 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-10 w-10 text-muted-foreground/30" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Your cart is empty</h3>
                <p className="text-sm text-muted-foreground mt-1">Looks like you haven't added anything yet.</p>
              </div>
              <Button 
                onClick={closeCartDrawer}
                className="mt-4 bg-primary text-white font-bold rounded-md px-8"
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="relative h-24 w-24 rounded-md bg-muted/20 overflow-hidden shrink-0 border border-border/40">
                  <Image 
                    src={item.image || '/placeholder-product.jpg'} 
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-semibold text-foreground line-clamp-2 leading-tight">
                        {item.name}
                      </h4>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-muted-foreground/40 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {item.category && (
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-1">
                        {item.category}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-foreground">
                      KSh {item.price.toLocaleString()}
                    </span>
                    
                    {/* Quantity Control */}
                    <div className="flex items-center gap-1 bg-muted/20 border border-border/40 rounded-md p-0.5">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:bg-white hover:text-foreground rounded-sm transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-foreground">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:bg-white hover:text-foreground rounded-sm transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {cart.length > 0 && (
          <div className="border-t border-border/40 p-6 bg-muted/5 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-muted-foreground">
                <span>Subtotal</span>
                <span>KSh {getCartTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-muted-foreground">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="pt-2 border-t border-border/40 flex justify-between text-lg font-bold text-foreground">
                <span>Total</span>
                <span className="text-primary">KSh {getCartTotal().toLocaleString()}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link href="/cart" onClick={closeCartDrawer} className="w-full">
                <Button variant="outline" className="w-full h-12 font-bold border-primary/20 text-primary">
                  View Cart
                </Button>
              </Link>
              <Link href="/checkout" onClick={closeCartDrawer} className="w-full">
                <Button className="w-full h-12 font-bold bg-primary text-white flex items-center justify-center gap-2">
                  Checkout <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
