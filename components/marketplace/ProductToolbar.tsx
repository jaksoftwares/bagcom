'use client';

import { 
  List, 
  LayoutGrid,
  ChevronDown,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProductToolbarProps {
  count: number;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  onMobileFilterOpen?: () => void;
}

export default function ProductToolbar({ count, viewMode, setViewMode, onMobileFilterOpen }: ProductToolbarProps) {
  const sortOptions = [
    'Most Relevant',
    'Price: Low to High',
    'Price: High to Low',
    'Newest First',
    'Most Popular'
  ];

  return (
    <div className="bg-white border border-border/40 p-1.5 rounded-md flex items-center justify-between">
      <div className="flex items-center gap-4">
         <div className="hidden lg:flex bg-muted/5 p-1 rounded-sm border border-border/20">
            <button
              onClick={() => setViewMode('grid')}
              className={`h-9 px-4 flex items-center gap-2 rounded-sm transition-all text-[10px] font-bold uppercase tracking-widest ${
                viewMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" /> Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`h-9 px-4 flex items-center gap-2 rounded-sm transition-all text-[10px] font-bold uppercase tracking-widest ${
                viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground'
              }`}
            >
              <List className="h-3.5 w-3.5" /> List
            </button>
         </div>
         
         <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-4 hidden md:block">
            <span className="text-foreground">{count}</span> products
         </p>
         
         {/* Mobile Filter Button */}
         <Button 
           variant="outline" 
           onClick={onMobileFilterOpen}
           className="lg:hidden h-10 rounded-md border-border/60 gap-2 text-[10px] font-bold uppercase tracking-widest shadow-none"
         >
            <Filter className="h-4 w-4" /> Filters
         </Button>
      </div>

      <div className="flex items-center gap-3">
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="ghost" className="h-10 px-4 rounded-md text-[10px] font-bold uppercase tracking-widest hover:bg-muted/5 transition-all gap-2 border border-transparent hover:border-border/40">
                  Sort: <span className="text-primary">Most Relevant</span> <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/40" />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white border-border/40 rounded-md shadow-xl p-1" align="end">
               {sortOptions.map(option => (
                 <DropdownMenuItem key={option} className="h-10 rounded-sm text-xs font-semibold text-muted-foreground focus:bg-primary/5 focus:text-primary transition-all cursor-pointer">
                    {option}
                 </DropdownMenuItem>
               ))}
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
    </div>
  );
}
