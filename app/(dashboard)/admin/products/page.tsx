'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Loader2,
  TrendingUp,
  Ban,
  MoreVertical,
  ArrowRight,
  Archive
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { useSearchParams } from 'next/navigation';
import UserDetailDrawer from '@/components/admin/UserDetailDrawer';
import ProductDetailDrawer from '@/components/admin/ProductDetailDrawer';

export default function ProductModeration() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const filterSellerId = searchParams.get('sellerId');
  
  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [sellers, setSellers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchStats();
    fetchSellers();
  }, [activeTab, filterSellerId]);

  async function fetchSellers() {
    try {
      const res = await fetch('/api/admin/sellers?status=APPROVED');
      const data = await res.json();
      setSellers(data.sellers || []);
    } catch (e) {}
  }

  async function fetchProducts() {
    setIsLoading(true);
    try {
      const url = new URL('/api/admin/products', window.location.origin);
      url.searchParams.set('status', activeTab);
      if (filterSellerId) url.searchParams.set('sellerId', filterSellerId);
      
      const res = await fetch(url.toString());
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      toast({ title: "Failed to load listings", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchStats() {
    try {
      const res = await fetch('/api/admin/products?type=STATS');
      const data = await res.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Stats load failed');
    }
  }

  const moderateProduct = async (id: string, action: 'ACTIVE' | 'FLAGGED' | 'REJECTED' | 'ARCHIVED') => {
    try {
      const res = await fetch(`/api/admin/products`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id, status: action })
      });
      if (res.ok) {
        toast({ title: `Listing marked as ${action}` });
        fetchProducts();
        fetchStats();
      }
    } catch (error) {
      toast({ title: "Moderation failed", variant: "destructive" });
    }
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.seller?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.seller?.last_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase tracking-widest">
              Catalog
            </h1>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3">
                <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Store:</p>
                <select 
                  className="bg-transparent border-none text-[10px] font-bold uppercase tracking-widest text-primary focus:ring-0 cursor-pointer"
                  value={filterSellerId || 'ALL'}
                  onChange={(e) => {
                    const val = e.target.value;
                    const url = val === 'ALL' ? '/admin/products' : `/admin/products?sellerId=${val}`;
                    window.location.href = url;
                  }}
                >
                   <option value="ALL">Global Catalog</option>
                   {sellers.map(s => (
                     <option key={s.id} value={s.id}>{s.business_name || `${s.first_name} ${s.last_name}`}</option>
                   ))}
                </select>
             </div>
             {filterSellerId && (
               <Button 
                 variant="ghost" 
                 className="h-8 text-[9px] font-bold uppercase tracking-widest text-rose-600 hover:bg-rose-50 px-3 rounded"
                 onClick={() => window.location.href = '/admin/products'}
               >
                 Clear
               </Button>
             )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           <Card className="p-8 bg-white border-border/40 shadow-none rounded-md flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                 <div className="h-12 w-12 bg-muted/5 rounded-md flex items-center justify-center text-primary border border-border/10">
                    <ShoppingBag className="h-6 w-6" />
                 </div>
              </div>
              <div>
                 <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest mb-1.5">Active</p>
                 <p className="text-3xl font-bold text-foreground tracking-tight">{stats?.active || 0}</p>
              </div>
           </Card>
           <Card className="p-8 bg-white border-border/40 shadow-none rounded-md flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                 <div className="h-12 w-12 bg-muted/5 rounded-md flex items-center justify-center text-amber-600 border border-border/10">
                    <AlertTriangle className="h-6 w-6" />
                 </div>
                 <div className="px-2 py-1 bg-amber-50 rounded text-[9px] font-bold text-amber-600 uppercase tracking-widest border border-amber-100">Review</div>
              </div>
              <div>
                 <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest mb-1.5">Flagged</p>
                 <p className="text-3xl font-bold text-foreground tracking-tight">{stats?.flagged || 0}</p>
              </div>
           </Card>
           <Card className="p-8 bg-white border-border/40 shadow-none rounded-md flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                 <div className="h-12 w-12 bg-muted/5 rounded-md flex items-center justify-center text-emerald-600 border border-border/10">
                    <TrendingUp className="h-6 w-6" />
                 </div>
              </div>
              <div>
                 <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest mb-1.5">Sold</p>
                 <p className="text-3xl font-bold text-foreground tracking-tight">{stats?.sold || 0}</p>
              </div>
           </Card>
           <Card className="p-8 bg-foreground border-foreground shadow-none rounded-md flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                 <div className="h-12 w-12 bg-white/10 rounded-md flex items-center justify-center text-white border border-white/10">
                    <Tag className="h-6 w-6" />
                 </div>
              </div>
              <div>
                 <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1.5">Total</p>
                 <p className="text-3xl font-bold text-white tracking-tight">{stats?.total || 0}</p>
              </div>
           </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
           <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-border/40">
              <TabsList className="bg-transparent p-0 h-auto w-full md:w-auto justify-start rounded-none gap-8">
                <TabsTrigger value="ACTIVE" className="rounded-none border-b-2 border-transparent px-0 py-4 font-bold text-[10px] uppercase tracking-[0.2em] data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:shadow-none transition-all">Active</TabsTrigger>
                <TabsTrigger value="FLAGGED" className="rounded-none border-b-2 border-transparent px-0 py-4 font-bold text-[10px] uppercase tracking-[0.2em] data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:shadow-none transition-all">Flagged</TabsTrigger>
                <TabsTrigger value="SOLD" className="rounded-none border-b-2 border-transparent px-0 py-4 font-bold text-[10px] uppercase tracking-[0.2em] data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:shadow-none transition-all">Sold</TabsTrigger>
                <TabsTrigger value="ALL" className="rounded-none border-b-2 border-transparent px-0 py-4 font-bold text-[10px] uppercase tracking-[0.2em] data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:shadow-none transition-all">All</TabsTrigger>
              </TabsList>

              <div className="relative w-full md:w-72 pb-2 md:pb-0">
                 <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40" />
                 <Input 
                   placeholder="SEARCH..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="border-none bg-transparent pl-7 pr-0 h-10 text-[10px] font-bold uppercase tracking-widest focus-visible:ring-0 placeholder:text-muted-foreground/30 shadow-none"
                 />
              </div>
           </div>

           <TabsContent value={activeTab} className="outline-none">
              {isLoading ? (
                <div className="py-24 flex flex-col items-center gap-6">
                  <div className="h-10 w-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">Synchronizing inventory...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="py-32 text-center border border-dashed border-border/40 rounded-md bg-muted/5">
                  <ShoppingBag className="h-8 w-8 text-muted-foreground/20 mx-auto mb-4" />
                  <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">No matching listings found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="bg-white border-border/40 shadow-none rounded-md overflow-hidden group hover:border-primary/20 transition-all duration-300">
                      <div className="flex flex-col md:flex-row items-center p-4 gap-6">
                         {/* Product Image Thumb */}
                         <div className="h-20 w-24 bg-muted/5 rounded border border-border/20 overflow-hidden shrink-0">
                            <img 
                              src={product.images?.[0]?.image_url || 'https://via.placeholder.com/100x80?text=NO+IMAGE'} 
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                              alt={product.title}
                            />
                         </div>

                         {/* Core Info */}
                         <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-3">
                               <h3 className="text-sm font-bold text-foreground truncate uppercase tracking-tight">{product.title}</h3>
                               <Badge className="bg-muted/5 text-muted-foreground/40 border-none font-bold text-[8px] px-2 py-0.5 uppercase tracking-widest rounded">{product.condition}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                               <span className="text-primary">KSh {product.price.toLocaleString()}</span>
                               <div className="h-1 w-1 bg-border rounded-full" />
                               <span>{product.category?.name || 'General'}</span>
                            </div>
                         </div>

                         {/* Seller Info */}
                         <div className="hidden lg:flex flex-col gap-1 w-48">
                            <p className="text-[9px] font-bold text-muted-foreground/20 uppercase tracking-widest">Merchant</p>
                            <button 
                              onClick={() => setSelectedUserId(product.seller?.id)}
                              className="text-[11px] font-bold text-foreground hover:text-primary text-left truncate transition-colors flex items-center gap-2"
                            >
                               {product.seller?.first_name} {product.seller?.last_name}
                               <ExternalLink className="h-2.5 w-2.5 opacity-40" />
                            </button>
                         </div>

                         {/* Status */}
                         <div className="hidden xl:flex flex-col gap-1 w-32">
                            <p className="text-[9px] font-bold text-muted-foreground/20 uppercase tracking-widest">Status</p>
                            <Badge className={`w-fit border-none px-2 py-0.5 font-bold uppercase text-[8px] tracking-widest rounded ${
                              product.status === 'ACTIVE' ? 'bg-emerald-500 text-white' : 
                              product.status === 'FLAGGED' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
                            }`}>
                              {product.status}
                            </Badge>
                         </div>

                         {/* Actions */}
                         <div className="flex items-center gap-2">
                            {activeTab === 'FLAGGED' && (
                              <Button 
                                onClick={() => moderateProduct(product.id, 'ACTIVE')}
                                className="h-9 w-9 p-0 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white border-none rounded shadow-none"
                              >
                                 <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            {activeTab === 'ACTIVE' && (
                              <Button 
                                onClick={() => moderateProduct(product.id, 'FLAGGED')}
                                className="h-9 w-9 p-0 bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white border-none rounded shadow-none"
                              >
                                 <AlertTriangle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button 
                              onClick={() => moderateProduct(product.id, 'REJECTED')}
                              className="h-9 w-9 p-0 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white border-none rounded shadow-none"
                            >
                               <Ban className="h-4 w-4" />
                            </Button>
                            <div className="h-8 w-px bg-border/40 mx-2" />
                            <Button 
                              variant="ghost" 
                              className="h-9 px-4 text-muted-foreground/40 hover:text-primary font-bold text-[9px] uppercase tracking-widest gap-2"
                              onClick={() => setSelectedProductId(product.id)}
                            >
                               View <ArrowRight className="h-3 w-3" />
                            </Button>
                         </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
           </TabsContent>
        </Tabs>
      </div>

      <UserDetailDrawer 
        userId={selectedUserId}
        onClose={() => setSelectedUserId(null)}
        onUpdate={() => {
          fetchProducts();
          fetchStats();
        }}
      />

      <ProductDetailDrawer
        productId={selectedProductId}
        onClose={() => setSelectedProductId(null)}
        onUpdate={() => {
          fetchProducts();
          fetchStats();
        }}
      />
    </AdminLayout>
  );
}
