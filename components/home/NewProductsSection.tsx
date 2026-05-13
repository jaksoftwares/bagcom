'use client';

import { useState, useEffect } from 'react';
import { Shield, Truck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';
import { getProducts, Product } from '@/services/products/productService';

export default function NewProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchNewProducts() {
      // Fetch the latest 5 products from the API
      const data = await getProducts({ limit: 5 });
      setProducts(data);
      setIsLoading(false);
    }
    fetchNewProducts();
  }, []);

  return (
    <section className="py-24 bg-[#F9FAFB]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-xl space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full text-primary font-bold text-[10px] uppercase tracking-widest border border-primary/10">
                <Shield className="h-3 w-3" /> Latest Arrivals
             </div>
             <h2 className="text-[32px] md:text-4xl font-bold tracking-tight text-gray-900">Recently Posted</h2>
             <p className="text-gray-500 font-medium">Browse the newest items listed by students in your community.</p>
          </div>
          
          <Link 
            href="/products" 
            className="text-sm font-bold text-gray-900 hover:text-primary transition-colors flex items-center gap-2 group"
          >
            Browse all products
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-slate-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={{
                  ...product,
                  isEscrowProtected: true // Default for all platform trades
                }} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
             <p className="text-gray-400 font-medium">No new products found.</p>
          </div>
        )}

        <div className="flex flex-wrap justify-center items-center gap-8 pt-12 mt-12 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-widest">
            <Shield className="h-4 w-4 text-primary" />
            <span>Escrow Protected</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-widest">
            <Truck className="h-4 w-4 text-primary" />
            <span>Local Pickups</span>
          </div>
        </div>
      </div>
    </section>
  );
}