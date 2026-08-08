'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts, Product } from '@/services/products/productService';

export default function PredictiveSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounced Search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        // Fetch products by query (assuming getProducts can take a search param, if not we will fetch all and filter for now, or update the service)
        // Let's assume getProducts handles search if we pass it, or we filter client side as a fallback if the API doesn't support it yet.
        const data = await getProducts();
        const filtered = data.filter(p => p.title.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
        setResults(filtered);
        setIsOpen(true);
      } catch (error) {
        console.error('Search error', error);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full hidden lg:block flex-1 max-w-xl mx-8">
      <form onSubmit={handleSubmit}>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 h-4 w-4" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if (query.trim()) setIsOpen(true) }}
            placeholder="Search for products, categories, or sellers..."
            className="pl-10 pr-4 h-11 w-full rounded-md border-border/60 bg-muted/20 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-none font-medium"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground/50" />
          )}
        </div>
      </form>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-border/50 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          {results.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Products</div>
              {results.map((product) => (
                <Link 
                  key={product.id} 
                  href={`/product/${product.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-muted/30 transition-colors"
                >
                  <div className="h-10 w-10 relative rounded-sm overflow-hidden bg-muted/20 shrink-0">
                    <Image 
                      src={product.images?.[0]?.image_url || product.product_images?.[0]?.image_url || product.image || '/placeholder-product.jpg'} 
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-semibold text-foreground truncate">{product.title}</p>
                    <p className="text-xs text-muted-foreground">KSh {product.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
              <div className="border-t border-border/30 mt-2">
                <button 
                  onClick={handleSubmit}
                  className="w-full text-center py-3 text-sm font-bold text-primary hover:bg-primary/5 transition-colors"
                >
                  View all results for "{query}"
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-20" />
              <p className="text-sm font-medium">No results found for "{query}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
