'use client';

import { X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ActiveFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentParams = new URLSearchParams(Array.from(searchParams.entries()));

  const category = searchParams.get('category');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const conditions = searchParams.get('condition')?.split(',') || [];
  const freeShipping = searchParams.get('freeShipping') === 'true';
  const escrowProtected = searchParams.get('escrowProtected') === 'true';

  let hasFilters = category || minPrice || maxPrice || conditions.length > 0 || freeShipping || escrowProtected;

  if (!hasFilters) return null;

  const removeFilter = (key: string, valueToRemove?: string) => {
    if (key === 'condition' && valueToRemove) {
      const newConditions = conditions.filter(c => c !== valueToRemove);
      if (newConditions.length > 0) {
        currentParams.set('condition', newConditions.join(','));
      } else {
        currentParams.delete('condition');
      }
    } else {
      currentParams.delete(key);
    }
    currentParams.delete('page'); // Reset pagination
    router.push(`?${currentParams.toString()}`, { scroll: false });
  };

  const clearAll = () => {
    router.push('/products', { scroll: false });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
       <span className="text-xs font-bold text-muted-foreground mr-2">Active Filters:</span>
       
       {category && (
         <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold transition-all hover:bg-primary/20 cursor-pointer" onClick={() => removeFilter('category')}>
            {category} <X className="h-3 w-3" />
         </div>
       )}

       {(minPrice || maxPrice) && (
         <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold transition-all hover:bg-primary/20 cursor-pointer" onClick={() => { removeFilter('minPrice'); removeFilter('maxPrice'); }}>
            KSh {minPrice || '0'} - {maxPrice ? `${maxPrice}` : 'Any'} <X className="h-3 w-3" />
         </div>
       )}

       {conditions.map(cond => (
         <div key={cond} className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold transition-all hover:bg-primary/20 cursor-pointer" onClick={() => removeFilter('condition', cond)}>
            {cond} <X className="h-3 w-3" />
         </div>
       ))}

       {freeShipping && (
         <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold transition-all hover:bg-primary/20 cursor-pointer" onClick={() => removeFilter('freeShipping')}>
            Free Shipping <X className="h-3 w-3" />
         </div>
       )}

       {escrowProtected && (
         <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold transition-all hover:bg-primary/20 cursor-pointer" onClick={() => removeFilter('escrowProtected')}>
            Escrow Protected <X className="h-3 w-3" />
         </div>
       )}

       <button onClick={clearAll} className="text-xs font-bold text-muted-foreground hover:text-foreground underline underline-offset-2 ml-2 transition-colors">
          Clear all
       </button>
    </div>
  );
}
