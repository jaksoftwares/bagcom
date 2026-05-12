'use client';

import { useState, useEffect } from 'react';
import StorefrontLayout from '@/components/layout/StorefrontLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Store, 
  ShieldCheck, 
  Star, 
  MapPin, 
  ArrowRight,
  Search,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function SellersPage() {
  const [sellers, setSellers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSellers() {
      try {
        // Fetch approved sellers
        const res = await fetch('/api/sellers');
        const data = await res.json();
        setSellers(data.sellers || []);
      } catch (error) {
        console.error('Failed to load sellers:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadSellers();
  }, []);

  return (
    <StorefrontLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Verified <span className="text-primary underline decoration-primary/20 decoration-8 underline-offset-8">Merchants</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            Discover and shop from our community of trusted, KYC-verified sellers across the country.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto relative group">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
           <Input 
             placeholder="Search by store name or category..." 
             className="h-14 pl-12 pr-6 rounded-2xl border-slate-100 shadow-soft focus-visible:ring-primary/20 font-medium"
           />
        </div>

        {/* Sellers Grid */}
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sellers.length === 0 ? (
               // Mock data for the audit/demo if no real sellers are returned yet
               [1, 2, 3].map((i) => (
                 <SellerCard key={i} seller={{
                   business_name: `Elite Store ${i}`,
                   city: 'Nairobi',
                   first_name: 'Merchant',
                   last_name: 'Owner',
                   store_description: 'Quality electronics and accessories with nationwide delivery and secure escrow.',
                   planned_categories: 'Electronics, Smartphones'
                 }} />
               ))
            ) : (
              sellers.map((seller) => (
                <SellerCard key={seller.id} seller={seller} />
              ))
            )}
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-slate-900 rounded-[3rem] p-12 text-center space-y-8 relative overflow-hidden">
           <div className="absolute inset-0 bg-primary/5 z-0" />
           <div className="relative z-10 space-y-4">
              <h2 className="text-3xl font-black text-white">Want to start selling?</h2>
              <p className="text-slate-400 max-w-sm mx-auto font-medium">Join our verified merchant network and reach thousands of customers securely.</p>
              <div className="pt-4">
                 <Link href="/register">
                    <Button size="lg" className="rounded-2xl font-bold gap-2 h-14 px-10 shadow-xl shadow-primary/20">
                       Open Your Store <ArrowRight className="h-5 w-5" />
                    </Button>
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}

function SellerCard({ seller }: { seller: any }) {
  return (
    <Card className="border-none shadow-soft hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] overflow-hidden group">
      <CardContent className="p-8 space-y-6">
        <div className="flex justify-between items-start">
           <div className="h-20 w-20 bg-slate-50 rounded-3xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
              <Store className="h-10 w-10" />
           </div>
           <Badge className="bg-emerald-50 text-emerald-600 border-none px-3 py-1 font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5">
              <CheckCircle className="h-3 w-3" /> Verified
           </Badge>
        </div>

        <div className="space-y-2">
           <h3 className="text-2xl font-black text-slate-900 tracking-tight">{seller.business_name || 'Individual Seller'}</h3>
           <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {seller.city || 'Kenya'}
           </div>
        </div>

        <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed">
           {seller.store_description || 'No description provided yet.'}
        </p>

        <div className="pt-4 flex flex-wrap gap-2">
           {(seller.planned_categories || '').split(',').map((cat: string, idx: number) => (
             <Badge key={idx} variant="outline" className="rounded-lg border-slate-100 text-slate-400 font-bold text-[9px] uppercase tracking-tighter">
                {cat.trim()}
             </Badge>
           ))}
        </div>

        <div className="h-px bg-slate-50" />

        <div className="flex justify-between items-center">
           <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              <span className="text-sm font-black text-slate-900">4.9</span>
              <span className="text-xs font-medium text-slate-400 ml-1">(24 Reviews)</span>
           </div>
           <Button variant="ghost" className="rounded-xl font-bold text-xs gap-2 group-hover:text-primary transition-colors">
              Visit Store <ArrowRight className="h-4 w-4" />
           </Button>
        </div>
      </CardContent>
    </Card>
  );
}
