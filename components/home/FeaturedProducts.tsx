'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Flame } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';
import { getProducts, Product } from '@/services/products/productService';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Button } from '@/components/ui/button';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const plugin = useRef(
    Autoplay({ delay: 6000, stopOnInteraction: true }) as any
  );

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts({ limit: 12 });
      setProducts(data);
      setIsLoading(false);
    }
    loadProducts();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 rounded-full text-orange-600 font-bold text-[10px] uppercase tracking-widest border border-orange-100">
               <Flame className="h-3 w-3" /> Trending
            </div>
            <h2 className="text-[32px] md:text-4xl font-bold tracking-tight text-foreground leading-tight">Trending items</h2>
            <p className="text-muted-foreground font-medium">Quality second-hand items recently listed in your community.</p>
          </div>
          
          <Button variant="ghost" className="text-sm font-bold hover:text-primary transition-colors flex items-center gap-2 group" asChild>
            <Link href="/products">
              Explore all items
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="min-w-0 shrink-0 grow-0 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 2xl:basis-1/6 animate-pulse bg-muted/20 rounded-xl h-[300px] border border-border/20" />
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
                <CarouselItem key={product.id} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 2xl:basis-1/6">
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="hidden md:flex absolute -top-14 right-40 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <CarouselPrevious className="relative right-0 top-0 translate-y-0 translate-x-0 h-9 w-9 bg-white" />
               <CarouselNext className="relative right-0 top-0 translate-y-0 translate-x-0 h-9 w-9 bg-white" />
            </div>
          </Carousel>
        )}
      </div>
    </section>
  );
}