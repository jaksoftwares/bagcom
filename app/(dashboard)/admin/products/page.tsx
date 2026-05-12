'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ShoppingBag, 
  Search, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Eye,
  Trash2,
  Tag,
  MapPin,
  Clock,
  User,
  ExternalLink,
  ChevronRight,
  Filter,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

export default function ProductModeration() {
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products?sellerView=true'); 
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        toast({ title: "Failed to load listings", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const moderateProduct = async (id: string, action: 'ACTIVE' | 'FLAGGED' | 'REJECTED') => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action })
      });
      if (res.ok) {
        setProducts(products.map(p => p.id === id ? { ...p, status: action } : p));
        toast({ title: `Listing marked as ${action}` });
      }
    } catch (error) {
      toast({ title: "Moderation failed", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
               <span>Admin</span>
               <ChevronRight className="h-3 w-3 opacity-30" />
               <span className="text-primary">Product Moderation</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.1]">
              Inventory <span className="text-primary/80">Curation</span>
            </h1>
            <p className="text-base text-slate-400 font-medium max-w-xl leading-relaxed">
              Maintain marketplace quality by reviewing new listings. Ensure all products meet Bagcom's safety and authenticity standards.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-primary/10 border border-primary/20 px-6 py-3 rounded-[1.5rem] shadow-xl shadow-primary/5">
             <ShoppingBag className="h-5 w-5 text-primary" />
             <span className="text-[11px] font-black text-primary uppercase tracking-[0.1em]">{products.length} Active Listings</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-900/40 p-4 rounded-[2rem] border border-white/5 shadow-2xl">
           <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search products or sellers..." 
                className="pl-12 pr-6 bg-white/5 border-white/5 h-12 rounded-xl focus-visible:ring-primary/20 text-sm font-medium transition-all"
              />
           </div>
           <div className="flex items-center gap-4">
              <Button variant="ghost" className="rounded-xl font-bold text-xs gap-2 text-slate-400 hover:text-white">
                 <Filter className="h-4 w-4" /> Filter by Status
              </Button>
           </div>
        </div>

        {/* Grid Section */}
        {isLoading ? (
          <div className="py-24 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="bg-slate-900/40 border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden group hover:border-primary/20 transition-all duration-500">
                <div className="relative aspect-[16/10] bg-slate-950">
                   <img 
                     src={product.images?.[0]?.image_url || 'https://via.placeholder.com/400x250'} 
                     className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                     alt={product.title}
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                   <div className="absolute top-6 right-6">
                      <Badge className={`${product.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'} border px-3 py-1 font-bold text-[9px] uppercase tracking-widest rounded-full`}>
                        {product.status}
                      </Badge>
                   </div>
                   <div className="absolute bottom-6 left-6 right-6">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1">{product.category?.name || 'Uncategorized'}</p>
                      <h3 className="text-xl font-bold text-white leading-tight line-clamp-1">{product.title}</h3>
                   </div>
                </div>

                <CardContent className="p-8 space-y-8">
                   <div className="flex justify-between items-end">
                      <div className="space-y-1">
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Market Value</p>
                         <p className="text-2xl font-black text-white tracking-tighter text-shadow">KSh {product.price.toLocaleString()}</p>
                      </div>
                      <Badge variant="outline" className="border-white/5 text-slate-500 font-bold text-[9px] px-3 py-1 rounded-lg">
                         {product.condition}
                      </Badge>
                   </div>

                   <div className="space-y-4 py-6 border-t border-white/5">
                      <div className="flex items-center gap-4">
                         <div className="h-8 w-8 bg-slate-800 rounded-lg flex items-center justify-center">
                            <User className="h-4 w-4 text-slate-400" />
                         </div>
                         <div className="space-y-0.5">
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">Seller Record</p>
                            <p className="text-xs text-white font-bold">{product.seller?.first_name} {product.seller?.last_name}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <div className="h-8 w-8 bg-slate-800 rounded-lg flex items-center justify-center">
                            <Clock className="h-4 w-4 text-slate-400" />
                         </div>
                         <div className="space-y-0.5">
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">Submission Time</p>
                            <p className="text-xs text-slate-400 font-medium">{new Date(product.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-3 gap-3">
                      <Button 
                        onClick={() => moderateProduct(product.id, 'ACTIVE')}
                        className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white font-bold text-[10px] uppercase tracking-widest h-12 rounded-xl border-none transition-all"
                      >
                         Approve
                      </Button>
                      <Button 
                        onClick={() => moderateProduct(product.id, 'FLAGGED')}
                        className="bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white font-bold text-[10px] uppercase tracking-widest h-12 rounded-xl border-none transition-all"
                      >
                         Flag
                      </Button>
                      <Button 
                        onClick={() => moderateProduct(product.id, 'REJECTED')}
                        className="bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white font-bold text-[10px] uppercase tracking-widest h-12 rounded-xl border-none transition-all"
                      >
                         Reject
                      </Button>
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
