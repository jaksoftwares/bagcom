'use client';

import { 
  Search, 
  TrendingUp, 
  ShoppingBag,
  ArrowRight,
  Mic
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function MarketplaceHeader() {
  const trendingSearches = ['iPhone 15', 'Study Desk', 'Hoodies', 'Gas Cooker', 'Bicycles'];
  
  return (
    <div className="bg-white border-b border-border/40">
      <div className="container mx-auto px-4 py-12 lg:py-16 space-y-10">
        {/* Marketplace Title & Stats */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full text-primary font-bold text-[10px] uppercase tracking-widest border border-primary/10">
               Marketplace
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
              Quality items from <span className="text-muted-foreground">trusted community sellers.</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-8 md:pl-8 border-slate-100">
             <div className="text-left">
                <p className="text-xl font-bold text-foreground">10,000+</p>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mt-1">Active items</p>
             </div>
             <div className="text-left">
                <p className="text-xl font-bold text-foreground">Verified</p>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mt-1">Community score</p>
             </div>
          </div>
        </div>

        {/* Search Experience */}
        <div className="max-w-3xl space-y-4">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
              <Input 
                type="text"
                placeholder="Search for items, brands, or categories..."
                className="h-14 pl-12 pr-28 rounded-md border-border/60 bg-muted/5 text-sm font-medium focus-visible:ring-primary/10 focus-visible:border-primary transition-all shadow-none"
              />
              <div className="absolute inset-y-1.5 right-1.5 flex items-center gap-1.5">
                 <button className="h-11 px-6 bg-primary text-white hover:bg-primary/90 rounded-md text-xs font-semibold transition-all">
                    Search
                 </button>
              </div>
           </div>

           {/* Discovery Keywords */}
           <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                 <TrendingUp className="h-3 w-3" /> Trending:
              </span>
              {trendingSearches.map(keyword => (
                <Link key={keyword} href={`/products?q=${keyword}`} className="px-3 py-1 bg-muted/20 hover:bg-primary/5 hover:text-primary border border-border/30 rounded-md text-[11px] font-semibold transition-all cursor-pointer">
                  {keyword}
                </Link>
              ))}
              <div className="h-4 w-px bg-border/40 mx-1" />
              <button className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1 hover:underline">
                 All Categories <ArrowRight className="h-3 w-3" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
