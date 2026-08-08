'use client';

import { useState, useEffect, useRef } from 'react';
import { Clock, Zap } from 'lucide-react';
import Link from 'next/link';
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
import { Button } from '@/components/ui/button';

export default function FlashSales() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true }) as any
  );

  useEffect(() => {
    async function fetchDiscounted() {
      try {
        const res = await fetch('/api/products/discounted?limit=8');
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Failed to fetch flash sales:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDiscounted();
  }, []);

  // UI Rolling Timer
  useEffect(() => {
    // End of day logic for simplicity (or just a rolling 24h)
    const timer = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      const diff = endOfDay.getTime() - now.getTime();
      
      if (diff > 0) {
        setTimeLeft({
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // If no products and not loading, we can hide the section or show a fallback
  if (!loading && products.length === 0) {
    return null; // Or return a placeholder if we want to show it always
  }

  return (
    <section className="py-12 bg-rose-50 border-y border-rose-100">
      <div className="container mx-auto px-4 sm:px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/20">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 tracking-tight">
                Flash Sales
              </h2>
              <p className="text-sm text-rose-600 font-medium">Hurry up! Offers end in:</p>
            </div>
            
            {/* Timer Blocks */}
            <div className="flex items-center gap-2 ml-2">
               <div className="bg-white border border-rose-200 text-rose-600 font-bold px-3 py-1.5 rounded-md shadow-sm min-w-[40px] text-center">
                 {String(timeLeft.hours).padStart(2, '0')}
               </div>
               <span className="text-rose-400 font-bold">:</span>
               <div className="bg-white border border-rose-200 text-rose-600 font-bold px-3 py-1.5 rounded-md shadow-sm min-w-[40px] text-center">
                 {String(timeLeft.minutes).padStart(2, '0')}
               </div>
               <span className="text-rose-400 font-bold">:</span>
               <div className="bg-white border border-rose-200 text-rose-600 font-bold px-3 py-1.5 rounded-md shadow-sm min-w-[40px] text-center">
                 {String(timeLeft.seconds).padStart(2, '0')}
               </div>
            </div>
          </div>
          
          <Button variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-100" asChild>
            <Link href="/products?sort=discount">View all deals</Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="min-w-0 shrink-0 grow-0 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 animate-pulse bg-white rounded-2xl h-[360px] border border-rose-100" />
            ))}
          </div>
        ) : (
          <Carousel
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            opts={{ align: "start" }}
          >
            <CarouselContent className="-ml-4">
              {products.map((product) => (
                <CarouselItem key={product.id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div className="relative">
                    {/* Discount Badge Override for Flash Sale */}
                    {product.original_price && product.original_price > product.price && (
                       <div className="absolute top-4 left-4 z-10 bg-rose-500 text-white text-xs font-black px-2 py-1 rounded shadow-sm">
                          -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                       </div>
                    )}
                    <ProductCard product={product} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="hidden md:flex absolute -top-14 right-40 gap-2">
               <CarouselPrevious className="relative right-0 top-0 translate-y-0 translate-x-0 h-9 w-9 bg-white border-rose-200 text-rose-600 hover:bg-rose-100" />
               <CarouselNext className="relative right-0 top-0 translate-y-0 translate-x-0 h-9 w-9 bg-white border-rose-200 text-rose-600 hover:bg-rose-100" />
            </div>
          </Carousel>
        )}
      </div>
    </section>
  );
}
