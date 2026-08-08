'use client';

import { useState, useEffect, useRef } from 'react';
import { Shield, Truck, ArrowRight } from 'lucide-react';
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

export default function NewProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const plugin = useRef(
    Autoplay({ delay: 5500, stopOnInteraction: true }) as any
  );

  useEffect(() => {
    async function fetchNewProducts() {
      // Fetch the latest products from the API
      const data = await getProducts({ limit: 12 });
      // To simulate "new", we can just reverse or sort by created_at if API supports it. Assuming default is somewhat recent.
      setProducts(data);
      setIsLoading(false);
    }
    fetchNewProducts();
  }, []);

  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="max-w-xl space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full text-primary font-bold text-[10px] uppercase tracking-widest border border-primary/10">
                <Shield className="h-3 w-3" /> Latest Arrivals
             </div>
             <h2 className="text-[32px] md:text-4xl font-bold tracking-tight text-foreground">Recently Posted</h2>
             <p className="text-muted-foreground font-medium">Browse the newest items listed by students in your community.</p>
          </div>
          
          <Button variant="ghost" className="text-sm font-bold hover:text-primary transition-colors flex items-center gap-2 group" asChild>
            <Link href="/products">
              Browse all products
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="min-w-0 shrink-0 grow-0 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 2xl:basis-1/6 animate-pulse bg-white rounded-2xl h-[300px] border border-border/40" />
            ))}
          </div>
        ) : products.length > 0 ? (
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
                  <ProductCard 
                    product={{
                      ...product,
                      isEscrowProtected: true // Default for all platform trades
                    }} 
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="hidden md:flex absolute -top-14 right-40 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <CarouselPrevious className="relative right-0 top-0 translate-y-0 translate-x-0 h-9 w-9 bg-white" />
               <CarouselNext className="relative right-0 top-0 translate-y-0 translate-x-0 h-9 w-9 bg-white" />
            </div>
          </Carousel>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-border/40">
             <p className="text-muted-foreground font-medium">No new products found.</p>
          </div>
        )}

        <div className="flex flex-wrap justify-center items-center gap-8 pt-12 mt-12 border-t border-border/40">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold uppercase tracking-widest">
            <Shield className="h-4 w-4 text-primary" />
            <span>Escrow Protected</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold uppercase tracking-widest">
            <Truck className="h-4 w-4 text-primary" />
            <span>Local Pickups</span>
          </div>
        </div>
      </div>
    </section>
  );
}