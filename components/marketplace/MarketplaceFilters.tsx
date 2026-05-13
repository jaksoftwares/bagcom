'use client';

import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Truck, 
  Star,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface FilterGroupProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterGroup({ title, children, defaultOpen = true }: FilterGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border-b border-border/20 py-5">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full group mb-3"
      >
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        {isOpen ? <ChevronUp className="h-3 w-3 text-muted-foreground/30" /> : <ChevronDown className="h-3 w-3 text-muted-foreground/30" />}
      </button>
      {isOpen && <div className="space-y-2.5">{children}</div>}
    </div>
  );
}

export default function MarketplaceFilters() {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-6">
         <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">Filters</h2>
         <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">Clear all</button>
      </div>

      <FilterGroup title="Categories">
        {['Electronics', 'Furniture', 'Fashion', 'Books', 'Kitchen', 'Others'].map(cat => (
          <label key={cat} className="flex items-center gap-3 group cursor-pointer">
            <Checkbox id={cat} className="h-4 w-4 rounded-sm border-border/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
            <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">{cat}</span>
          </label>
        ))}
      </FilterGroup>

      <FilterGroup title="Price Range (KSh)">
         <div className="px-1 pt-2">
            <Slider 
              defaultValue={[0, 100000]} 
              max={250000} 
              step={1000}
              className="mb-6"
            />
            <div className="flex items-center gap-3">
               <div className="flex-1 p-2 bg-muted/5 border border-border/30 rounded-md text-center">
                  <p className="text-[9px] font-bold text-muted-foreground/40 uppercase leading-none mb-1">Min</p>
                  <p className="text-[11px] font-bold text-foreground">0</p>
               </div>
               <span className="text-muted-foreground/30 text-xs">—</span>
               <div className="flex-1 p-2 bg-muted/5 border border-border/30 rounded-md text-center">
                  <p className="text-[9px] font-bold text-muted-foreground/40 uppercase leading-none mb-1">Max</p>
                  <p className="text-[11px] font-bold text-foreground">100k+</p>
               </div>
            </div>
         </div>
      </FilterGroup>

      <FilterGroup title="Condition">
         <div className="flex flex-wrap gap-2">
            {['New', 'Like New', 'Good', 'Fair'].map(cond => (
              <Badge 
                key={cond} 
                variant="outline" 
                className="px-3 py-1 rounded-sm border-border/40 text-muted-foreground hover:border-primary hover:text-primary transition-all cursor-pointer font-bold text-[10px] uppercase tracking-tighter shadow-none"
              >
                {cond}
              </Badge>
            ))}
         </div>
      </FilterGroup>

      <FilterGroup title="Protection">
         <div className="space-y-3">
            {[
              { label: 'Escrow Protected', icon: Zap, color: 'text-amber-500' },
              { label: 'Verified Sellers', icon: ShieldCheck, color: 'text-primary' },
              { label: 'Free Shipping', icon: Truck, color: 'text-emerald-500' }
            ].map(item => (
              <label key={item.label} className="flex items-center justify-between group cursor-pointer">
                 <div className="flex items-center gap-2.5">
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                    <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground">{item.label}</span>
                 </div>
                 <Checkbox className="rounded-full h-4 w-4 border-border/60" />
              </label>
            ))}
         </div>
      </FilterGroup>

      <FilterGroup title="Ratings">
         <div className="space-y-2.5">
            {[4, 3, 2].map(rating => (
              <label key={rating} className="flex items-center gap-2.5 group cursor-pointer">
                <Checkbox className="rounded-sm h-4 w-4 border-border/60" />
                <div className="flex items-center gap-1">
                   {[...Array(5)].map((_, i) => (
                     <Star key={i} className={`h-2.5 w-2.5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                   ))}
                   <span className="text-[10px] font-bold text-muted-foreground/50 ml-1">& up</span>
                </div>
              </label>
            ))}
         </div>
      </FilterGroup>

      <div className="pt-10">
         <div className="p-6 bg-muted/5 border border-border/40 rounded-md space-y-3">
            <h4 className="text-[10px] font-bold text-foreground uppercase tracking-widest">Support</h4>
            <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">Need help finding a specific product or have safety concerns?</p>
            <Button variant="outline" className="w-full mt-2 h-9 rounded-md border-border/60 text-foreground text-[10px] font-bold uppercase tracking-widest hover:bg-white">
               Contact Us
            </Button>
      </div>
      </div>
    </div>
  );
}
