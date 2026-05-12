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
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProductModeration() {
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products?sellerView=true'); // Reusing existing API with sellerView
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white">Product Moderation</h1>
            <p className="text-gray-400 font-medium mt-2">Review and approve marketplace listings to ensure quality and safety.</p>
          </div>
          <div className="flex gap-3">
             <Badge className="bg-primary/20 text-primary border-none px-4 py-2 font-bold">{products.length} Total Listings</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="bg-[#1E293B] border-white/5 shadow-xl overflow-hidden group hover:border-primary/20 transition-all">
              <div className="relative aspect-video bg-gray-900">
                 <img 
                   src={product.images?.[0]?.image_url || 'https://via.placeholder.com/400x225'} 
                   className="w-full h-full object-cover transition-transform group-hover:scale-105"
                   alt={product.title}
                 />
                 <div className="absolute top-4 right-4 flex gap-2">
                    <Badge className={`${product.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'} border-none`}>
                      {product.status}
                    </Badge>
                 </div>
              </div>

              <CardContent className="p-6 space-y-6">
                 <div>
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{product.category?.name || 'Uncategorized'}</p>
                    <h3 className="text-lg font-bold text-white leading-tight group-hover:text-primary transition-colors">{product.title}</h3>
                    <p className="text-xl font-black text-white mt-2">KSh {product.price.toLocaleString()}</p>
                 </div>

                 <div className="space-y-3 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                       <User className="h-3.5 w-3.5" />
                       <span>Seller: <span className="text-white font-bold">{product.seller?.first_name} {product.seller?.last_name}</span></span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                       <Clock className="h-3.5 w-3.5" />
                       <span>Listed on {new Date(product.created_at).toLocaleDateString()}</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-3 gap-2 pt-2">
                    <Button 
                      onClick={() => moderateProduct(product.id, 'ACTIVE')}
                      className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white font-bold text-xs h-10 border-none"
                    >
                       Approve
                    </Button>
                    <Button 
                      onClick={() => moderateProduct(product.id, 'FLAGGED')}
                      className="bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white font-bold text-xs h-10 border-none"
                    >
                       Flag
                    </Button>
                    <Button 
                      onClick={() => moderateProduct(product.id, 'REJECTED')}
                      className="bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white font-bold text-xs h-10 border-none"
                    >
                       Reject
                    </Button>
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
