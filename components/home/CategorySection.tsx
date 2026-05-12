'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getCategories } from '@/services/products/productService';

// Category images mapping
const categoryImages: Record<string, string> = {
  'furniture': 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=600',
  'electronics': 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=600',
  'kitchen': 'https://images.pexels.com/photos/4252137/pexels-photo-4252137.jpeg?auto=compress&cs=tinysrgb&w=600',
  'clothing': 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=600',
  'books': 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=600',
  'sports': 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=600',
  'transport': 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=600',
  'personal-care': 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=600'
};

export default function CategorySection() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      const data = await getCategories();
      setCategories(data);
      setIsLoading(false);
    }
    loadCategories();
  }, []);

  return (
    <section className="py-24 bg-white border-b border-border/40">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <h2 className="mb-4">Shop by category</h2>
            <p>Find pre-owned items from trusted sellers in your local community.</p>
          </div>
          
          <Link 
            href="/products" 
            className="text-sm font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-2 group"
          >
            View all categories
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-muted/20 animate-pulse rounded-md" />
            ))
          ) : (
            categories.slice(0, 8).map((category) => (
              <Link key={category.id} href={`/products?category=${category.id}`}>
                <Card className="group border border-border/40 shadow-none hover:shadow-subtle transition-all duration-300 cursor-pointer overflow-hidden rounded-md bg-white">
                  <div className="relative aspect-[4/3] bg-muted/20">
                    <img 
                      src={categoryImages[category.slug] || categoryImages['electronics']} 
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      {category.name}
                    </h3>
                    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                      Browse Listing
                    </p>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}