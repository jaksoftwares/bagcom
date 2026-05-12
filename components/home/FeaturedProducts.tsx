'use client';

import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';
import { getProducts, Product } from '@/services/products/productService';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts({ limit: 10 });
      setProducts(data);
      setIsLoading(false);
    }
    loadProducts();
  }, []);

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full text-primary font-bold text-[10px] uppercase tracking-widest border border-primary/10">
               Trending
            </div>
            <h2 className="text-[32px] md:text-4xl font-bold tracking-tight text-gray-900 leading-tight">Trending items</h2>
            <p className="text-gray-500 font-medium">Quality second-hand items recently listed in your community.</p>
          </div>
          
          <Link 
            href="/products" 
            className="text-sm font-bold text-gray-900 hover:text-primary transition-colors flex items-center gap-2 group"
          >
            Explore all items
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-muted/20 animate-pulse rounded-sm" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}