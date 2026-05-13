'use client';

import { 
  Star, 
  ArrowRight, 
  Store, 
  CheckCircle2, 
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';

export default function FeaturedSellers() {
  const [sellers, setSellers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSellers() {
      try {
        const res = await fetch('/api/sellers');
        const data = await res.json();
        if (data.sellers && data.sellers.length > 0) {
          // Map DB structure to UI structure
          const mapped = data.sellers.map((s: any) => ({
            id: s.id,
            name: s.business_name || `${s.first_name} ${s.last_name || ''}`,
            rating: 4.9, // Aggregate ratings logic would go here
            reviews: 12,
            items: 5,
            image: s.profile_photo_url,
            category: (s.planned_categories || '').split(',')[0] || 'General'
          }));
          setSellers(mapped.slice(0, 4));
        }
      } catch (error) {
        console.error('Failed to load real sellers:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadSellers();
  }, []);

  return (
    <section className="py-24 bg-white border-t border-border/20">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full text-primary font-bold text-[10px] uppercase tracking-widest border border-primary/10">
                <TrendingUp className="h-3 w-3" /> Community
             </div>
             <h2 className="text-3xl font-bold text-foreground tracking-tight">Top rated sellers</h2>
             <p className="text-muted-foreground font-medium text-sm leading-relaxed max-w-xl">
                Trusted community members with a proven track record of quality service and verified successful trades.
             </p>
          </div>
          <Link href="/sellers" className="group flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] hover:underline">
            Explore all sellers <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Sellers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-muted/10 animate-pulse rounded-md" />
            ))
          ) : sellers.length > 0 ? (
            sellers.map((seller) => (
              <div key={seller.id} className="group p-6 bg-white border border-border/40 rounded-md transition-all duration-300 hover:shadow-subtle hover:border-primary/20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <Avatar className="h-14 w-14 border-2 border-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                      <AvatarImage src={seller.image} className="object-cover" />
                      <AvatarFallback className="bg-muted/20 text-muted-foreground font-bold">
                         {seller.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-sm">
                       <ShieldCheck className="h-2.5 w-2.5" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-[15px] text-foreground truncate group-hover:text-primary transition-colors">{seller.name}</h3>
                    <p className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest mt-0.5">{seller.category}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex flex-col gap-1">
                     <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-[11px] font-bold text-foreground">{seller.rating}</span>
                     </div>
                     <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-tighter">({seller.reviews} reviews)</p>
                  </div>
                  <div className="flex flex-col gap-1">
                     <div className="flex items-center gap-1">
                        <Store className="h-3 w-3 text-primary" />
                        <span className="text-[11px] font-bold text-foreground">{seller.items}</span>
                     </div>
                     <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-tighter">Active items</p>
                  </div>
                </div>

                <Link href={`/seller/${seller.id}`} className="block">
                  <Button className="w-full h-10 rounded-md bg-muted/5 hover:bg-primary hover:text-white border border-border/40 hover:border-primary text-foreground font-bold uppercase tracking-widest text-[9px] transition-all shadow-none">
                     Visit Store
                  </Button>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center bg-muted/5 rounded-md border border-dashed border-border/40">
               <Store className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
               <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">No verified sellers yet</p>
            </div>
          )}
        </div>

        {/* Community Proof */}
        <div className="mt-20 p-8 bg-muted/5 border border-border/40 rounded-md flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden grayscale opacity-50">
                      <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="user" className="h-full w-full object-cover" />
                   </div>
                 ))}
              </div>
              <p className="text-sm font-semibold text-muted-foreground">
                 Join <span className="text-foreground font-bold">2,400+ community members</span> trading safely today.
              </p>
           </div>
           <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Escrow protection active</span>
           </div>
        </div>
      </div>
    </section>
  );
}
