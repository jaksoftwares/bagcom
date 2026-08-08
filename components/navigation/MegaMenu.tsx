'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { getCategories } from '@/services/products/productService';

export default function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCats() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to load categories for mega menu', error);
      }
    }
    fetchCats();
  }, []);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-5">
        Categories <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && categories.length > 0 && (
        <div className="absolute top-full left-1/2 -translate-x-1/4 w-[600px] bg-white rounded-xl shadow-2xl border border-border/40 p-6 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Category List */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 border-b border-border/30 pb-2">All Categories</h3>
              <ul className="grid grid-cols-2 gap-3">
                {categories.slice(0, 8).map(category => (
                  <li key={category.id}>
                    <Link 
                      href={`/products?category=${category.id}`}
                      className="text-sm font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link 
                href="/categories"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline mt-2 uppercase tracking-widest"
              >
                View full directory <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Featured Promo in Mega Menu */}
            <div className="bg-muted/10 rounded-lg p-5 border border-border/30 flex flex-col justify-between">
              <div>
                <span className="bg-rose-500 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm">Hot Deal</span>
                <h4 className="text-lg font-bold text-foreground mt-3 leading-tight">Up to 40% off electronics</h4>
                <p className="text-xs text-muted-foreground mt-1">Upgrade your gear for less with verified sellers.</p>
              </div>
              <Link href="/products?category=electronics" onClick={() => setIsOpen(false)}>
                <button className="mt-4 w-full h-9 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-primary/90 transition-all">
                  Shop Now
                </button>
              </Link>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
