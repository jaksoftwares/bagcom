'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Activity, 
  Store,
  CheckCircle2,
  MessageCircle,
  Award,
  Star,
  Zap,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

// Layout & Components
import StorefrontLayout from '@/components/layout/StorefrontLayout';
import Footer from '@/components/navigation/Footer';
import ProductCard from '@/components/products/ProductCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Services
import { getSellerById, getProducts, Product } from '@/services/products/productService';

export default function SellerProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const [seller, setSeller] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      setIsLoading(true);
      try {
        const [sellerData, productsData] = await Promise.all([
          getSellerById(id),
          getProducts({ sellerId: id })
        ]);
        setSeller(sellerData);
        setProducts(productsData);
      } catch (error) {
        console.error("Error loading seller profile:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (isLoading) {
    return (
      <StorefrontLayout>
        <div className="container mx-auto px-4 py-12 space-y-12">
          <div className="h-48 bg-muted/10 animate-pulse rounded-md" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-muted/10 animate-pulse rounded-md" />
            ))}
          </div>
        </div>
      </StorefrontLayout>
    );
  }

  if (!seller) {
    return (
      <StorefrontLayout>
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
           <Store className="h-16 w-16 text-muted-foreground/20 mx-auto mb-6" />
           <h1 className="text-2xl font-bold text-foreground mb-2">Seller Not Found</h1>
           <p className="text-muted-foreground mb-8 max-w-sm mx-auto">This seller may have deactivated their account or the link is incorrect.</p>
           <Link href="/products">
             <Button variant="outline" className="rounded-md uppercase tracking-widest text-[10px] font-bold h-12 px-8">Back to marketplace</Button>
           </Link>
        </div>
      </StorefrontLayout>
    );
  }

  const sellerName = seller.first_name ? `${seller.first_name} ${seller.last_name || ''}`.trim() : 'Verified Seller';

  return (
    <StorefrontLayout>
      <div className="bg-white min-h-screen">
        
        {/* Profile Header */}
        <div className="bg-muted/5 border-b border-border/20 py-16 lg:py-24">
           <div className="container mx-auto px-4">
              <div className="flex flex-col lg:flex-row gap-12 items-start lg:items-center">
                 
                 {/* Avatar Area */}
                 <div className="relative shrink-0">
                    <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-white shadow-xl">
                       <AvatarImage src={seller.profile_photo_url} className="object-cover" />
                       <AvatarFallback className="bg-primary/10 text-primary font-bold text-4xl uppercase">
                          {sellerName[0]}
                       </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2.5 rounded-full border-4 border-white shadow-lg">
                       <ShieldCheck className="h-6 w-6" />
                    </div>
                 </div>

                 {/* Info Area */}
                 <div className="flex-1 space-y-6">
                    <div className="space-y-3">
                       <div className="flex items-center gap-3">
                          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">{sellerName}</h1>
                          <CheckCircle2 className="h-6 w-6 text-primary" />
                       </div>
                       <div className="flex flex-wrap items-center gap-6">
                          <div className="flex items-center gap-2 text-muted-foreground/60 text-sm font-semibold">
                             <MapPin className="h-4 w-4" /> Nairobi, Kenya
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground/60 text-sm font-semibold">
                             <Calendar className="h-4 w-4" /> Joined {new Date(seller.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                          </div>
                          <div className="flex items-center gap-1">
                             {[1, 2, 3, 4, 5].map(i => (
                               <Star key={i} className={`h-3.5 w-3.5 ${i <= 4 ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/20'}`} />
                             ))}
                             <span className="text-xs font-bold text-foreground ml-2">4.8 / 5.0 Rating</span>
                          </div>
                       </div>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-2">
                       <Button className="h-12 px-8 rounded-md bg-foreground text-white font-bold uppercase tracking-widest text-[10px] shadow-sm">
                          <MessageCircle className="h-4 w-4 mr-2" /> Send Message
                       </Button>
                       <Button variant="outline" className="h-12 px-8 rounded-md border-border/60 text-foreground font-bold uppercase tracking-widest text-[10px] hover:bg-white">
                          <Award className="h-4 w-4 mr-2" /> Verified Seller
                       </Button>
                    </div>
                 </div>

                 {/* Quick Stats Grid */}
                 <div className="grid grid-cols-2 gap-4 w-full lg:w-auto lg:min-w-[320px]">
                    {[
                      { icon: Store, label: 'Listings', value: products.length, color: 'text-primary' },
                      { icon: Zap, label: 'Sales', value: '400+', color: 'text-amber-500' },
                      { icon: Activity, label: 'Response', value: '< 1 hour', color: 'text-emerald-500' },
                      { icon: ShieldCheck, label: 'Success', value: '98%', color: 'text-blue-500' }
                    ].map((stat, i) => (
                      <div key={i} className="p-4 bg-white border border-border/40 rounded-md shadow-subtle">
                         <div className="flex items-center gap-2 mb-1">
                            <stat.icon className={`h-3 w-3 ${stat.color}`} />
                            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">{stat.label}</p>
                         </div>
                         <p className="text-sm font-bold text-foreground">{stat.value}</p>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Listings Section */}
        <main className="container mx-auto px-4 py-16 lg:py-24 space-y-12">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                 <h2 className="text-2xl font-bold text-foreground tracking-tight">Active Listings</h2>
                 <p className="text-sm font-medium text-muted-foreground">Showing all available products from this merchant.</p>
              </div>
              <div className="flex items-center gap-2 bg-muted/5 p-1 rounded-md border border-border/20">
                 <Badge variant="outline" className="h-8 border-none bg-white text-foreground font-bold text-[10px] uppercase tracking-widest px-4">
                    Latest items
                 </Badge>
              </div>
           </div>

           {products.length > 0 ? (
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
               {products.map((product) => (
                 <ProductCard key={product.id} product={product} />
               ))}
             </div>
           ) : (
             <div className="py-24 text-center bg-muted/5 rounded-md border border-dashed border-border/40">
                <Store className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-foreground tracking-tight mb-2">No Active Listings</h3>
                <p className="text-muted-foreground font-medium max-w-xs mx-auto text-sm">This seller hasn't posted any items yet or all items are sold.</p>
             </div>
           )}
        </main>

        {/* Trust Messaging */}
        <section className="bg-muted/5 border-t border-border/20 py-16 lg:py-20">
           <div className="container mx-auto px-4 max-w-3xl text-center space-y-8">
              <div className="h-12 w-12 bg-primary/10 rounded-md flex items-center justify-center mx-auto">
                 <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-4">
                 <h3 className="text-xl font-bold text-foreground tracking-tight uppercase tracking-widest">Safe Community Trading</h3>
                 <p className="text-muted-foreground font-medium leading-relaxed text-sm">
                    Sirtee's escrow protocol protects every transaction on this profile. 
                    Funds are only released to the seller after you confirm delivery and quality. 
                    Always meet in public places for campus pickups.
                 </p>
              </div>
              <div className="flex justify-center gap-4">
                 <Badge variant="outline" className="border-border/60 text-[9px] font-bold uppercase tracking-widest px-3 py-1">Secure Payments</Badge>
                 <Badge variant="outline" className="border-border/60 text-[9px] font-bold uppercase tracking-widest px-3 py-1">Identity Verified</Badge>
                 <Badge variant="outline" className="border-border/60 text-[9px] font-bold uppercase tracking-widest px-3 py-1">Buyer Protection</Badge>
              </div>
           </div>
        </section>

      </div>
      <Footer />
    </StorefrontLayout>
  );
}
