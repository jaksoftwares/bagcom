'use client';

import { useState, useEffect, useRef } from 'react';
import { History } from 'lucide-react';
import { Product } from '@/services/products/productService';
import ProductCard from '../products/ProductCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function RecentlyViewed() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true }) as any
  );

  useEffect(() => {
    async function fetchRecentlyViewed() {
      try {
        const res = await fetch('/api/products/recently-viewed?limit=8');
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Failed to fetch recently viewed:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecentlyViewed();
  }, []);

  // Only render if we have recently viewed products
  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6">
        
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
            <History className="h-5 w-5 text-muted-foreground" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
            Continue Shopping
          </h2>
          <span className="text-sm font-medium text-muted-foreground ml-2 hidden sm:inline-block">
            Based on your recent activity
          </span>
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="min-w-0 shrink-0 grow-0 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 animate-pulse bg-muted/20 rounded-2xl h-[360px] border border-border/20" />
            ))}
          </div>
        ) : (
          <Carousel
            plugins={[plugin.current]}
            className="w-full relative group"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            opts={{ align: "start" }}
          >
            <CarouselContent className="-ml-4">
              {products.map((product) => (
                <CarouselItem key={product.id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="hidden md:flex absolute -top-12 right-0 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <CarouselPrevious className="relative right-0 top-0 translate-y-0 translate-x-0 h-8 w-8 bg-white" />
               <CarouselNext className="relative right-0 top-0 translate-y-0 translate-x-0 h-8 w-8 bg-white" />
            </div>
          </Carousel>
        )}
      </div>
    </section>
  );
}
