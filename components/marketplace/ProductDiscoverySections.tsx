'use client';

import { 
  Zap, 
  Clock, 
  ChevronRight, 
  TrendingUp,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';

interface DiscoverySectionProps {
  title: string;
  subtitle: string;
  products: any[];
  icon: any;
  accent: string;
}

function Section({ title, subtitle, products, icon: Icon, accent }: DiscoverySectionProps) {
  if (!products.length) return null;
  
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
           <div className={`inline-flex items-center gap-2 px-3 py-1 bg-${accent}-50 rounded-full text-${accent}-600 font-bold text-[10px] uppercase tracking-widest border border-${accent}-100`}>
              <Icon className="h-3 w-3" /> Featured
           </div>
           <h2 className="text-3xl font-bold text-foreground tracking-tight leading-none">{title}</h2>
           <p className="text-muted-foreground font-medium text-sm">{subtitle}</p>
        </div>
        <Link href="/products" className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] hover:underline flex items-center gap-2">
           Explore all items <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 md:gap-8">
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

export default function ProductDiscoverySections({ trending, newArrivals }: { trending: any[], newArrivals: any[] }) {
  return (
    <div className="space-y-24">
      <Section 
        title="Trending items" 
        subtitle="The most sought-after products in our community this week."
        products={trending} 
        icon={TrendingUp}
        accent="amber"
      />
      
      <div className="p-12 bg-muted/5 border border-border/40 rounded-md relative overflow-hidden group">
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="h-20 w-20 bg-primary/10 rounded-md flex items-center justify-center shrink-0">
               <Sparkles className="h-10 w-10 text-primary" />
            </div>
            <div className="flex-1 text-center md:text-left space-y-4">
               <h3 className="text-2xl font-bold text-foreground tracking-tight">Become a verified seller</h3>
               <p className="text-muted-foreground font-medium max-w-xl text-sm leading-relaxed">Join thousands of students and locals trading safely on Sirtee. Get your verification badge and build trust with buyers immediately.</p>
               <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                  <button className="h-12 px-8 bg-primary text-white font-bold rounded-md uppercase tracking-widest text-[10px] shadow-sm hover:bg-primary/90 transition-all">Get verified</button>
                  <button className="h-12 px-8 bg-white border border-border/60 text-foreground font-bold rounded-md uppercase tracking-widest text-[10px] hover:bg-muted/10 transition-all">Learn more</button>
               </div>
            </div>
         </div>
      </div>

      <Section 
        title="Just listed" 
        subtitle="The latest arrivals that just hit the community marketplace."
        products={newArrivals} 
        icon={Clock}
        accent="primary"
      />
    </div>
  );
}
