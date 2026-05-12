'use client';

import { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Heart,
  Truck,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Mock cart data
const initialCart = [
  {
    id: 1,
    name: "MacBook Pro M2 2023",
    price: 185000,
    category: "Electronics",
    image: "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400",
    quantity: 1,
    seller: "Maina Gadgets"
  },
  {
    id: 2,
    name: "Ergonomic Office Chair",
    price: 12500,
    category: "Furniture",
    image: "https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=400",
    quantity: 1,
    seller: "Sarah Furniture"
  }
];

export default function CartPage() {
  const [cart, setCart] = useState(initialCart);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const serviceFee = subtotal * 0.02; // 2% Escrow/Service fee
  const total = subtotal + serviceFee;

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="bg-muted/10 min-h-screen py-12">
      <div className="container mx-auto px-4">
        
        <div className="flex items-center gap-2 mb-8">
           <Button variant="ghost" size="sm" asChild className="rounded-full gap-2 text-muted-foreground hover:text-foreground">
              <Link href="/products"><ChevronLeft className="h-4 w-4" /> Continue Shopping</Link>
           </Button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl border border-border/40 p-6 md:p-8 shadow-soft">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                  Your Cart <span className="text-muted-foreground font-medium text-lg">({cart.length} items)</span>
                </h1>
              </div>

              {cart.length > 0 ? (
                <div className="divide-y divide-border/40">
                  {cart.map((item) => (
                    <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-6">
                      <div className="h-24 w-24 rounded-xl overflow-hidden border border-border/20 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-lg font-bold text-foreground truncate hover:text-primary transition-colors cursor-pointer">
                            {item.name}
                          </h3>
                          <p className="text-xl font-bold text-foreground whitespace-nowrap">
                            KSh {item.price.toLocaleString()}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium mb-4 flex items-center gap-1">
                           Sold by <span className="text-foreground font-bold">{item.seller}</span>
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-xl border border-border/20">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-white transition-all"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-white transition-all"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-4">
                             <Button variant="ghost" size="sm" className="rounded-xl gap-2 text-muted-foreground hover:text-primary">
                                <Heart className="h-4 w-4" /> Save for later
                             </Button>
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               className="rounded-xl gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                               onClick={() => removeItem(item.id)}
                             >
                                <Trash2 className="h-4 w-4" /> Remove
                             </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center space-y-6">
                   <div className="h-20 w-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto text-muted-foreground/40">
                      <ShoppingBag className="h-10 w-10" />
                   </div>
                   <div className="space-y-2">
                      <h2 className="text-xl font-bold text-foreground">Your cart is empty</h2>
                      <p className="text-muted-foreground font-medium max-w-xs mx-auto">
                        Looks like you haven't added anything to your cart yet.
                      </p>
                   </div>
                   <Button asChild className="rounded-xl px-8 font-bold">
                      <Link href="/products">Shop Latest Deals</Link>
                   </Button>
                </div>
              )}
            </div>

            {/* Delivery Info Box */}
            <div className="bg-white rounded-2xl border border-border/40 p-6 flex items-start gap-4 shadow-soft">
               <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                  <Truck className="h-5 w-5" />
               </div>
               <div>
                  <h4 className="font-bold text-foreground">Fast Delivery Selection</h4>
                  <p className="text-sm text-muted-foreground font-medium mt-0.5">
                     Choose your preferred delivery method during checkout. Most items are delivered within 24 hours to your campus units.
                  </p>
               </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="bg-white rounded-2xl border border-border/40 p-6 md:p-8 shadow-soft space-y-6">
              <h2 className="text-xl font-bold tracking-tight text-foreground">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium">
                   <span className="text-muted-foreground">Subtotal</span>
                   <span className="text-foreground font-bold">KSh {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                   <span className="text-muted-foreground flex items-center gap-1">
                      Service Fee <ShieldCheck className="h-3 w-3 text-primary" />
                   </span>
                   <span className="text-foreground font-bold">KSh {serviceFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-medium pb-4 border-b border-border/40">
                   <span className="text-muted-foreground">Delivery</span>
                   <span className="text-green-600 font-bold uppercase text-[10px] tracking-widest mt-1">Calculated at next step</span>
                </div>
                <div className="flex justify-between items-end pt-2">
                   <span className="text-base font-bold text-foreground">Order Total</span>
                   <span className="text-2xl font-black text-primary tracking-tighter">
                      KSh {total.toLocaleString()}
                   </span>
                </div>
              </div>

              <div className="bg-primary/5 p-4 rounded-xl space-y-3">
                 <div className="flex items-center gap-3 text-primary">
                    <ShieldCheck className="h-5 w-5 flex-shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-widest leading-tight">Secure Escrow Protection</span>
                 </div>
                 <p className="text-[11px] text-primary/70 font-medium leading-relaxed">
                    Your money is held securely and only released to the seller after you confirm receipt of the product.
                 </p>
              </div>

              <Button asChild className="w-full h-14 rounded-xl text-base font-bold gap-2 shadow-lg shadow-primary/20" disabled={cart.length === 0}>
                 <Link href="/checkout">
                    Proceed to Checkout <ArrowRight className="h-5 w-5" />
                 </Link>
              </Button>

              <div className="flex justify-center items-center gap-4 pt-4 grayscale opacity-40">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg" alt="M-Pesa" className="h-6" />
                 <div className="h-4 w-px bg-border/40" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
