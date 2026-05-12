'use client';

import { 
  Search, 
  ShoppingBag, 
  Tag, 
  ShieldCheck, 
  ArrowRight, 
  Smartphone, 
  Sofa, 
  Shirt, 
  Utensils, 
  BookOpen, 
  Dumbbell 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import Image from 'next/image';

const categories = [
  { name: 'Electronics', icon: Smartphone, color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { name: 'Furniture', icon: Sofa, color: 'bg-orange-50 text-orange-600 border-orange-100' },
  { name: 'Fashion', icon: Shirt, color: 'bg-pink-50 text-pink-600 border-pink-100' },
  { name: 'Kitchen', icon: Utensils, color: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
  { name: 'Books', icon: BookOpen, color: 'bg-purple-50 text-purple-600 border-purple-100' },
  { name: 'Sports', icon: Dumbbell, color: 'bg-green-50 text-green-600 border-green-100' },
];

export default function Hero() {
  return (
    <section className="bg-white border-b border-border/40 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Search & Actions */}
          <div className="lg:col-span-7 xl:col-span-6 space-y-8">
            <div className="space-y-4">
              <h1 className="text-[32px] md:text-[48px] font-bold text-foreground leading-[1.1] tracking-tight">
                Buy and sell second-hand <br /> 
                products securely and easily.
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                A modern trusted marketplace for quality pre-owned goods. 
                Join thousands of local traders today.
              </p>
            </div>

            {/* Search Experience - Primary Action */}
            <div className="max-w-2xl">
              <div className="flex flex-col sm:flex-row gap-0 p-1.5 bg-muted/30 rounded-lg border border-border/50 focus-within:bg-white focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5 transition-all">
                <div className="relative flex-[1.5] flex items-center border-b sm:border-b-0 sm:border-r border-border/40">
                  <Search className="absolute left-4 text-muted-foreground h-5 w-5" />
                  <Input
                    placeholder="Search for electronics, furniture, books..."
                    className="pl-12 py-7 border-none bg-transparent focus-visible:ring-0 text-base shadow-none placeholder:text-muted-foreground/60"
                  />
                </div>
                <Button className="py-7 px-10 rounded-md bg-primary text-white font-semibold text-base hover:bg-primary/90 transition-all sm:ml-2 shadow-sm">
                  Search
                </Button>
              </div>
              
              {/* Category Shortcuts */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mr-2">Quick categories</span>
                {['Electronics', 'Furniture', 'Fashion', 'Phones'].map((cat) => (
                  <Link 
                    key={cat} 
                    href={`/category/${cat.toLowerCase()}`}
                    className="text-xs font-semibold px-3 py-1.5 bg-muted/50 hover:bg-primary/10 hover:text-primary rounded-full transition-colors border border-border/40"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>

            {/* Marketplace Trust Indicators */}
            <div className="flex flex-wrap items-center gap-8 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                <ShieldCheck className="h-5 w-5 text-primary/70" />
                <span>Escrow protection</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                <Tag className="h-5 w-5 text-primary/70" />
                <span>Great local deals</span>
              </div>
            </div>
          </div>

          {/* Right Side: Marketplace Visuals */}
          <div className="lg:col-span-5 xl:col-span-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Category Card 1 */}
              <div className="group relative h-[180px] md:h-[220px] rounded-xl overflow-hidden border border-border/40 shadow-sm bg-muted/30">
                <Image 
                  src="https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=400" 
                  alt="Furniture"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-white font-bold text-lg">Furniture</span>
                  <div className="flex items-center text-white/80 text-xs font-medium mt-1">
                    <span>Shop now</span>
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </div>
                </div>
              </div>

              {/* Category Card 2 */}
              <div className="group relative h-[180px] md:h-[220px] rounded-xl overflow-hidden border border-border/40 shadow-sm bg-muted/30">
                <Image 
                  src="https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=400" 
                  alt="Electronics"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-white font-bold text-lg">Electronics</span>
                  <div className="flex items-center text-white/80 text-xs font-medium mt-1">
                    <span>Shop now</span>
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </div>
                </div>
              </div>

              {/* Wide Banner or Featured Card */}
              <div className="col-span-2 group relative h-[160px] md:h-[200px] rounded-xl overflow-hidden border border-border/40 shadow-sm bg-primary/5">
                <div className="flex h-full items-center px-8">
                  <div className="max-w-[240px] space-y-3 z-10">
                    <span className="text-primary font-bold text-xs uppercase tracking-[0.2em]">Become a seller</span>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground leading-tight">Turn your items into cash today</h3>
                    <Link href="/buyer">
                      <Button variant="link" className="p-0 h-auto text-primary font-bold group">
                        Start selling <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                  <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden pointer-events-none opacity-40 md:opacity-100">
                    <Image 
                      src="https://images.pexels.com/photos/3964736/pexels-photo-3964736.jpeg?auto=compress&cs=tinysrgb&w=400" 
                      alt="Marketplace"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Sub-Hero Quick Categories Grid - Mobile Friendly */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link 
              key={cat.name} 
              href={`/category/${cat.name.toLowerCase()}`}
              className="flex items-center gap-3 p-4 rounded-xl border border-border/40 hover:border-primary/30 hover:bg-primary/5 transition-all group"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-colors ${cat.color}`}>
                <cat.icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}