'use client';

import { Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const sellers = [
  {
    id: 1,
    name: 'Tech Haven',
    rating: 4.9,
    reviews: 124,
    items: 42,
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Electronics'
  },
  {
    id: 2,
    name: 'Sarah Wanjiku',
    rating: 5.0,
    reviews: 86,
    items: 15,
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Furniture'
  },
  {
    id: 3,
    name: 'Nairobi Thrift',
    rating: 4.8,
    reviews: 210,
    items: 64,
    image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Fashion'
  },
  {
    id: 4,
    name: 'David Mwangi',
    rating: 4.7,
    reviews: 45,
    items: 12,
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Kitchenware'
  }
];

export default function FeaturedSellers() {
  return (
    <section className="py-20 bg-white border-t border-border/20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold text-foreground mb-3 tracking-tight">Top rated sellers</h2>
            <p className="text-muted-foreground text-sm">Trusted community members with a proven track record of quality service.</p>
          </div>
          <Link href="/sellers" className="group flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
            Explore sellers <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {sellers.map((seller) => (
            <div key={seller.id} className="group border-b border-border/20 sm:border-none pb-8 sm:pb-0">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted">
                  <img src={seller.image} alt={seller.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold text-[15px] text-foreground group-hover:text-primary transition-colors">{seller.name}</h3>
                  <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">{seller.category}</p>
                </div>
              </div>

              <div className="flex gap-6 mb-4">
                <div className="flex items-center gap-1 text-[13px] font-bold text-foreground">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span>{seller.rating}</span>
                  <span className="text-muted-foreground font-medium">({seller.reviews})</span>
                </div>
                <div className="text-[13px] font-medium text-muted-foreground">
                  <span className="font-bold text-foreground">{seller.items}</span> items
                </div>
              </div>

              <Button variant="link" className="p-0 h-auto text-xs font-bold text-foreground/40 hover:text-primary transition-colors group-hover:text-primary/70">
                Visit Store
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
