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
import { useRouter, useSearchParams } from 'next/navigation';

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentParams = new URLSearchParams(Array.from(searchParams.entries()));

  const currentCategory = searchParams.get('category');
  const currentMinPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice') as string) : 0;
  const currentMaxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice') as string) : 250000;
  const currentConditions = searchParams.get('condition')?.split(',') || [];
  const isFreeShipping = searchParams.get('freeShipping') === 'true';
  const isEscrowProtected = searchParams.get('escrowProtected') === 'true';

  const updateParam = (key: string, value: string | null) => {
    if (value === null) {
      currentParams.delete(key);
    } else {
      currentParams.set(key, value);
    }
    currentParams.delete('page'); // Reset pagination
    router.push(`?${currentParams.toString()}`, { scroll: false });
  };

  const handleCategoryChange = (cat: string) => {
    updateParam('category', currentCategory === cat ? null : cat);
  };

  const handleConditionChange = (cond: string) => {
    const newConditions = currentConditions.includes(cond)
      ? currentConditions.filter(c => c !== cond)
      : [...currentConditions, cond];
      
    if (newConditions.length > 0) {
      updateParam('condition', newConditions.join(','));
    } else {
      updateParam('condition', null);
    }
  };

  const handlePriceChange = (values: number[]) => {
    if (values[0] === 0 && values[1] === 250000) {
      currentParams.delete('minPrice');
      currentParams.delete('maxPrice');
    } else {
      currentParams.set('minPrice', values[0].toString());
      currentParams.set('maxPrice', values[1].toString());
    }
    currentParams.delete('page');
    router.push(`?${currentParams.toString()}`, { scroll: false });
  };

  const clearAll = () => {
    router.push('/products', { scroll: false });
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-6">
         <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">Filters</h2>
         <button onClick={clearAll} className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">Clear all</button>
      </div>

      <FilterGroup title="Categories">
        {['Electronics', 'Furniture', 'Fashion', 'Books', 'Kitchen', 'Others'].map(cat => (
          <label key={cat} className="flex items-center gap-3 group cursor-pointer">
            <Checkbox 
              checked={currentCategory === cat}
              onCheckedChange={() => handleCategoryChange(cat)}
              className="h-4 w-4 rounded-sm border-border/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary" 
            />
            <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">{cat}</span>
          </label>
        ))}
      </FilterGroup>

      <FilterGroup title="Price Range (KSh)">
         <div className="px-1 pt-2">
            <Slider 
              value={[currentMinPrice, currentMaxPrice]} 
              max={250000} 
              step={1000}
              onValueChange={handlePriceChange}
              className="mb-6"
            />
            <div className="flex items-center gap-3">
               <div className="flex-1 p-2 bg-muted/5 border border-border/30 rounded-md text-center">
                  <p className="text-[9px] font-bold text-muted-foreground/40 uppercase leading-none mb-1">Min</p>
                  <p className="text-[11px] font-bold text-foreground">{currentMinPrice.toLocaleString()}</p>
               </div>
               <span className="text-muted-foreground/30 text-xs">—</span>
               <div className="flex-1 p-2 bg-muted/5 border border-border/30 rounded-md text-center">
                  <p className="text-[9px] font-bold text-muted-foreground/40 uppercase leading-none mb-1">Max</p>
                  <p className="text-[11px] font-bold text-foreground">{currentMaxPrice >= 250000 ? '250k+' : currentMaxPrice.toLocaleString()}</p>
               </div>
            </div>
         </div>
      </FilterGroup>

      <FilterGroup title="Condition">
         <div className="flex flex-wrap gap-2">
            {['New', 'Like New', 'Good', 'Fair'].map(cond => {
              const isSelected = currentConditions.includes(cond);
              return (
                <Badge 
                  key={cond} 
                  variant="outline" 
                  onClick={() => handleConditionChange(cond)}
                  className={`px-3 py-1 rounded-sm border-border/40 hover:border-primary transition-all cursor-pointer font-bold text-[10px] uppercase tracking-tighter shadow-none ${
                    isSelected ? 'bg-primary/10 text-primary border-primary' : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  {cond}
                </Badge>
              );
            })}
         </div>
      </FilterGroup>

      <FilterGroup title="Protection">
         <div className="space-y-3">
            <label className="flex items-center justify-between group cursor-pointer">
               <div className="flex items-center gap-2.5">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground">Escrow Protected</span>
               </div>
               <Checkbox 
                 checked={isEscrowProtected}
                 onCheckedChange={(checked) => updateParam('escrowProtected', checked ? 'true' : null)}
                 className="rounded-full h-4 w-4 border-border/60" 
               />
            </label>
            <label className="flex items-center justify-between group cursor-pointer">
               <div className="flex items-center gap-2.5">
                  <Truck className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground">Free Shipping</span>
               </div>
               <Checkbox 
                 checked={isFreeShipping}
                 onCheckedChange={(checked) => updateParam('freeShipping', checked ? 'true' : null)}
                 className="rounded-full h-4 w-4 border-border/60" 
               />
            </label>
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
