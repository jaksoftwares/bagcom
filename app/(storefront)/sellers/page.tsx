'use client';

import { useState, useEffect } from 'react';
import StorefrontLayout from '@/components/layout/StorefrontLayout';
import Footer from '@/components/navigation/Footer';
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
  CheckCircle2,
  TrendingUp,
  X
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function SellersPage() {
  const [sellers, setSellers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSellers() {
      try {
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
      <div className="bg-white min-h-screen">
        
        {/* Marketplace Header */}
        <div className="bg-muted/5 border-b border-border/20 py-16 lg:py-24">
           <div className="container mx-auto px-4 space-y-12">
              <div className="max-w-3xl space-y-6">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full text-primary font-bold text-[10px] uppercase tracking-widest border border-primary/10">
                    <Store className="h-3 w-3" /> Directory
                 </div>
                 <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
                    Our verified <span className="text-muted-foreground">community merchants.</span>
                 </h1>
                 <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-2xl">
                    Discover and shop from trusted, community-verified sellers. Every merchant on Sirtee undergoes identity verification to ensure a safe trading environment.
                 </p>
              </div>

              {/* Search Experience */}
              <div className="max-w-2xl relative group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                 <Input 
                   placeholder="Search merchants by name or category..." 
                   className="h-14 pl-12 pr-6 rounded-md border-border/60 bg-white text-sm font-medium focus-visible:ring-primary/10 shadow-none"
                 />
              </div>
           </div>
        </div>

        {/* Sellers Grid Area */}
        <main className="container mx-auto px-4 py-16 lg:py-24 space-y-16">
           <div className="flex items-center justify-between">
              <div className="space-y-1">
                 <h2 className="text-xl font-bold text-foreground tracking-tight">All Merchants</h2>
                 <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Showing {sellers.length || 3} verified sellers</p>
              </div>
              <div className="flex items-center gap-3">
                 <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Sort by:</span>
                 <Button variant="ghost" className="h-9 px-4 rounded-md text-[10px] font-bold uppercase tracking-widest border border-border/40">
                    Most Active <ArrowRight className="h-3 w-3 ml-2 rotate-90" />
                 </Button>
              </div>
           </div>

           {isLoading ? (
             <div className="py-24 flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Loading directory...</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {sellers.length > 0 ? (
                 sellers.map((seller) => (
                   <SellerCard key={seller.id} seller={seller} />
                 ))
               ) : (
                 <div className="col-span-full py-24 text-center bg-muted/5 rounded-md border border-dashed border-border/40">
                    <Store className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-foreground tracking-tight mb-2">No merchants found</h3>
                    <p className="text-muted-foreground font-medium max-w-xs mx-auto text-sm">We couldn't find any verified merchants in the directory at the moment.</p>
                 </div>
               )}
             </div>
           )}

           {/* Call to Action */}
           <div className="bg-foreground text-white rounded-md p-12 lg:p-16 relative overflow-hidden group">
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                 <div className="space-y-4 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-white font-bold text-[10px] uppercase tracking-widest border border-white/10">
                       <TrendingUp className="h-3 w-3" /> Growth
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">Ready to start selling?</h2>
                    <p className="text-slate-400 font-medium leading-relaxed">Join our verified merchant network and reach thousands of customers securely with our built-in escrow system.</p>
                 </div>
                 <Link href="/register">
                    <Button size="lg" className="h-14 px-10 rounded-md bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest text-[10px] shadow-lg">
                       Open your store <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                 </Link>
              </div>
           </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </StorefrontLayout>
  );
}

function SellerCard({ seller }: { seller: any }) {
  return (
    <div className="bg-white border border-border/40 rounded-md p-8 space-y-8 transition-all duration-300 hover:shadow-subtle hover:border-primary/20 group">
      <div className="flex justify-between items-start">
         <div className="h-16 w-16 bg-muted/20 rounded-md flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500">
            <Store className="h-8 w-8" />
         </div>
         <Badge className="bg-emerald-500/10 text-emerald-600 border-none px-2.5 py-1 font-bold text-[9px] uppercase tracking-widest flex items-center gap-1.5 rounded-sm">
            <ShieldCheck className="h-3.5 w-3.5" /> Verified
         </Badge>
      </div>

      <div className="space-y-3">
         <h3 className="text-xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
            {seller.business_name || `${seller.first_name} ${seller.last_name || ''}`}
         </h3>
         <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <MapPin className="h-3.5 w-3.5" />
            {seller.city || 'Kenya'}
         </div>
         <p className="text-sm text-muted-foreground font-medium line-clamp-2 leading-relaxed pt-2">
            {seller.store_description || seller.desc || 'Quality community merchant providing verified items.'}
         </p>
      </div>

      <div className="pt-4 border-t border-border/10 flex items-center justify-between">
         <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-foreground">4.9</span>
            <span className="text-[10px] font-bold text-muted-foreground/40 uppercase ml-1">(24)</span>
         </div>
         <Link href={`/seller/${seller.id}`}>
            <Button variant="ghost" className="h-10 px-0 rounded-none text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-transparent group-hover:translate-x-1 transition-all">
               Visit Store <ArrowRight className="h-3.5 w-3.5 ml-2" />
            </Button>
         </Link>
      </div>
    </div>
  );
}
