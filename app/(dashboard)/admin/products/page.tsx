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
      <div className="space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
               <span>Admin</span>
               <ChevronRight className="h-3 w-3 opacity-50" />
               <span className="text-primary">Products</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Product Listings
            </h1>
            <p className="text-sm text-slate-500 font-medium max-w-xl leading-relaxed">
              Review and moderate marketplace listings.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white border border-slate-200 px-5 py-2.5 rounded-xl shadow-sm">
             <ShoppingBag className="h-4 w-4 text-primary" />
             <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wide">{products.length} Active Listings</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
           <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
              <Input 
                placeholder="Search..." 
                className="pl-11 pr-4 bg-slate-50 border-slate-200 h-11 rounded-lg focus:bg-white focus:border-slate-300 text-sm font-medium transition-all"
              />
           </div>
           <div className="flex items-center gap-3 w-full md:w-auto">
              <Button variant="ghost" className="rounded-lg font-bold text-xs gap-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 w-full md:w-auto">
                 <Filter className="h-4 w-4" /> Filter
              </Button>
           </div>
        </div>

        {/* Grid Section */}
        {isLoading ? (
          <div className="py-24 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden group hover:border-slate-300 transition-all duration-300">
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                   <img 
                     src={product.images?.[0]?.image_url || 'https://via.placeholder.com/400x250'} 
                     className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                     alt={product.title}
                   />
                   <div className="absolute top-4 right-4">
                      <Badge className={`${product.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} border-none px-2.5 py-1 font-bold text-[9px] uppercase tracking-wider rounded-md shadow-sm`}>
                        {product.status}
                      </Badge>
                   </div>
                   <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900/60 to-transparent">
                      <p className="text-[10px] font-bold text-white/80 uppercase tracking-wider mb-0.5">{product.category?.name || 'Uncategorized'}</p>
                      <h3 className="text-lg font-bold text-white leading-tight line-clamp-1">{product.title}</h3>
                   </div>
                </div>

                <CardContent className="p-6 space-y-6">
                   <div className="flex justify-between items-end">
                      <div className="space-y-0.5">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price</p>
                         <p className="text-2xl font-bold text-slate-900 tracking-tight">KSh {product.price.toLocaleString()}</p>
                      </div>
                      <Badge variant="outline" className="border-slate-100 bg-slate-50 text-slate-500 font-bold text-[9px] px-2.5 py-0.5 rounded-md">
                         {product.condition}
                      </Badge>
                   </div>

                   <div className="space-y-3 pt-5 border-t border-slate-50">
                      <div className="flex items-center gap-3">
                         <div className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center">
                            <User className="h-4 w-4 text-slate-500" />
                         </div>
                         <div className="space-y-0.5">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">Seller</p>
                            <p className="text-xs text-slate-900 font-bold">{product.seller?.first_name} {product.seller?.last_name}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center">
                            <Clock className="h-4 w-4 text-slate-500" />
                         </div>
                         <div className="space-y-0.5">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">Added</p>
                            <p className="text-xs text-slate-500 font-medium">{new Date(product.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-3 gap-2 pt-2">
                      <Button 
                        onClick={() => moderateProduct(product.id, 'ACTIVE')}
                        variant="outline"
                        className="bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border-none font-bold text-[10px] uppercase tracking-wider h-10 rounded-lg transition-all"
                      >
                         Approve
                      </Button>
                      <Button 
                        onClick={() => moderateProduct(product.id, 'FLAGGED')}
                        variant="outline"
                        className="bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white border-none font-bold text-[10px] uppercase tracking-wider h-10 rounded-lg transition-all"
                      >
                         Flag
                      </Button>
                      <Button 
                        onClick={() => moderateProduct(product.id, 'REJECTED')}
                        variant="outline"
                        className="bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border-none font-bold text-[10px] uppercase tracking-wider h-10 rounded-lg transition-all"
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
