'use client';

import { CheckCircle2, ShoppingBag, ArrowRight, Package, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  return (
    <div className="bg-muted/5 min-h-screen flex items-center justify-center py-20 px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl border border-border/40 p-8 md:p-12 shadow-2xl text-center space-y-10 relative overflow-hidden">
          
          {/* Decorative background element */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent" />

          {/* Success Icon */}
          <div className="relative inline-block">
             <div className="h-24 w-24 bg-green-50 rounded-full flex items-center justify-center mx-auto animate-in zoom-in duration-700">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
             </div>
             <div className="absolute -top-2 -right-2 h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center animate-bounce">
                <ShieldCheck className="h-5 w-5 text-primary" />
             </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Order Secured!</h1>
            <p className="text-lg text-muted-foreground font-medium max-w-md mx-auto leading-relaxed">
               Your payment is now held in <span className="text-primary font-bold">Escrow protection</span>. 
               The seller has been notified and will begin preparing your delivery.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-6">
             <div className="p-6 bg-muted/20 rounded-2xl border border-border/40 text-left space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                   <Package className="h-4 w-4" /> Order Info
                </div>
                <p className="text-sm font-bold text-foreground">Order ID: #BG-82941</p>
                <p className="text-xs text-muted-foreground font-medium">Tracking link sent to your email</p>
             </div>
             <div className="p-6 bg-muted/20 rounded-2xl border border-border/40 text-left space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                   <ShieldCheck className="h-4 w-4" /> Escrow Status
                </div>
                <p className="text-sm font-bold text-foreground">Awaiting Delivery</p>
                <p className="text-xs text-muted-foreground font-medium">Release only after you confirm</p>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
             <Button asChild className="w-full sm:w-auto h-14 px-10 rounded-xl text-base font-bold gap-2 shadow-lg shadow-primary/20">
                <Link href="/buyer">
                   Go to My Dashboard <ArrowRight className="h-5 w-5" />
                </Link>
             </Button>
             <Button variant="outline" asChild className="w-full sm:w-auto h-14 px-10 rounded-xl text-base font-bold gap-2 border-border/60">
                <Link href="/products">
                   <ShoppingBag className="h-5 w-5" /> Continue Browsing
                </Link>
             </Button>
          </div>

          <p className="text-[11px] text-muted-foreground font-medium pt-4">
             Need help? <Link href="/support" className="text-primary hover:underline">Contact Bagcom Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
