'use client';

import { ShieldCheck, Truck, Clock } from 'lucide-react';

export default function MarketplaceTrust() {
  return (
    <section className="py-16 bg-muted/20 border-t border-border/10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white border border-border/40 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground">Escrow protection</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Your payment is held securely and only released to the seller once you confirm receipt.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white border border-border/40 flex items-center justify-center">
              <Truck className="h-5 w-5 text-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground">Verified local trading</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Trade with confidence within our community of verified buyers and sellers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white border border-border/40 flex items-center justify-center">
              <Clock className="h-5 w-5 text-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground">Reliable community support</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Our support team is available to assist you with any questions or transaction issues.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
