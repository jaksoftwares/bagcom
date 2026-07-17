'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  ShoppingBag, 
  CheckCircle2, 
  AlertTriangle, 
  Ban, 
  Clock, 
  User, 
  Tag, 
  MapPin,
  ExternalLink,
  Shield,
  Activity,
  Package,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface ProductDetailDrawerProps {
  productId: string | null;
  onClose: () => void;
  onUpdate: () => void;
}

export default function ProductDetailDrawer({ productId, onClose, onUpdate }: ProductDetailDrawerProps) {
  const { toast } = useToast();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  async function fetchProduct() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/products/${productId}`);
      const data = await res.json();
      if (res.ok) {
        setProduct(data.product);
      } else {
        setError(data.error || 'Failed to load product details');
      }
    } catch (err) {
      setError('Network error');
      toast({ title: "Load failed", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  const moderate = async (action: 'ACTIVE' | 'FLAGGED' | 'REJECTED') => {
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, status: action })
      });
      if (res.ok) {
        toast({ title: `Marked as ${action}` });
        fetchProduct();
        onUpdate();
      }
    } catch (error) {
      toast({ title: "Moderation failed", variant: "destructive" });
    }
  };

  if (!productId) return null;

  return (
    <div className={`fixed inset-0 z-[110] transition-all duration-500 ${productId ? 'visible' : 'invisible'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-500 ${productId ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose}
      />
      
      {/* Drawer Panel */}
      <div className={`absolute inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl transition-transform duration-500 ease-out border-l border-border/40 flex flex-col ${productId ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-6 border-b border-border/40 flex items-center justify-between bg-muted/5">
          <div className="flex items-center gap-4">
             <div className="h-10 w-10 bg-white border border-border/20 rounded flex items-center justify-center text-muted-foreground/40">
                <ShoppingBag className="h-5 w-5" />
             </div>
             <div>
                <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">Product</h2>
                <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-0.5">ID: {productId.slice(0, 8)}</p>
             </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground/40 hover:text-foreground rounded-full h-10 w-10">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          {isLoading ? (
             <div className="py-24 flex flex-col items-center gap-4">
                <div className="h-8 w-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Loading...</p>
             </div>
          ) : error ? (
            <div className="py-32 text-center space-y-4">
               <div className="h-16 w-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle className="h-8 w-8" />
               </div>
               <p className="text-sm font-bold text-slate-900 uppercase tracking-widest">{error}</p>
               <Button variant="outline" size="sm" onClick={fetchProduct} className="h-10 px-8 rounded font-bold text-[10px] uppercase tracking-widest">Retry</Button>
            </div>
          ) : product ? (
            <>
              {/* Media Gallery */}
              <div className="space-y-4">
                 <div className="aspect-[16/10] bg-muted/5 rounded-md border border-border/20 overflow-hidden relative group">
                    <img 
                      src={product.images?.[activeImage]?.image_url || 'https://via.placeholder.com/800x500?text=NO+IMAGE'} 
                      className="w-full h-full object-contain bg-slate-900"
                      alt=""
                    />
                    {product.images?.length > 1 && (
                      <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button 
                           variant="outline" 
                           size="icon" 
                           className="bg-white/90 backdrop-blur rounded-full h-8 w-8"
                           onClick={() => setActiveImage(prev => (prev > 0 ? prev - 1 : product.images.length - 1))}
                         >
                            <ChevronLeft className="h-4 w-4" />
                         </Button>
                         <Button 
                           variant="outline" 
                           size="icon" 
                           className="bg-white/90 backdrop-blur rounded-full h-8 w-8"
                           onClick={() => setActiveImage(prev => (prev < product.images.length - 1 ? prev + 1 : 0))}
                         >
                            <ChevronRight className="h-4 w-4" />
                         </Button>
                      </div>
                    )}
                 </div>
                 {product.images?.length > 1 && (
                   <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                      {product.images.map((img: any, idx: number) => (
                        <button 
                          key={img.id}
                          onClick={() => setActiveImage(idx)}
                          className={`h-16 w-20 rounded border-2 transition-all shrink-0 overflow-hidden ${activeImage === idx ? 'border-primary' : 'border-transparent opacity-50 hover:opacity-100'}`}
                        >
                           <img src={img.image_url} className="h-full w-full object-cover" alt="" />
                        </button>
                      ))}
                   </div>
                 )}
              </div>

              {/* Core Info */}
              <div className="space-y-6">
                 <div className="flex justify-between items-start gap-6">
                    <div className="space-y-1">
                       <h1 className="text-2xl font-bold text-foreground tracking-tight">{product.title || 'Untitled Listing'}</h1>
                       <p className="text-primary font-bold text-xl tracking-tight">KSh {(product.price || 0).toLocaleString()}</p>
                    </div>
                    <Badge className={`border-none px-3 py-1 font-bold uppercase text-[9px] tracking-widest rounded ${
                       product.status === 'ACTIVE' ? 'bg-emerald-500 text-white' : 
                       product.status === 'FLAGGED' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
                    }`}>
                       {product.status || 'UNKNOWN'}
                    </Badge>
                 </div>

                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-border/20">
                    <div className="space-y-1">
                       <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Condition</p>
                       <p className="text-xs font-bold text-foreground">{product.condition}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Category</p>
                       <p className="text-xs font-bold text-foreground">{product.category?.name || 'Uncategorized'}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Location</p>
                       <p className="text-xs font-bold text-foreground">{product.location || 'Not set'}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Created</p>
                       <p className="text-xs font-bold text-foreground">{new Date(product.created_at).toLocaleDateString()}</p>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Description</p>
                    <div className="text-xs text-muted-foreground leading-relaxed font-medium whitespace-pre-wrap bg-muted/5 p-6 rounded-md border border-border/20">
                       {product.description || 'No description provided.'}
                    </div>
                 </div>

                 {/* Merchant Card */}
                 <div className="space-y-3">
                    <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Merchant Store</p>
                    <div className="flex items-center gap-4 p-4 bg-muted/5 rounded-md border border-border/20">
                       <div className="h-10 w-10 bg-white border border-border/20 rounded flex items-center justify-center text-muted-foreground/40">
                          <User className="h-5 w-5" />
                       </div>
                       <div className="flex-1">
                          <p className="text-xs font-bold text-foreground">{product.seller?.business_name || 'Individual Merchant'}</p>
                          <p className="text-[10px] font-bold text-muted-foreground/40">{product.seller?.email}</p>
                       </div>
                       <Button variant="ghost" size="sm" className="text-[9px] font-bold uppercase tracking-widest text-primary h-8">
                          Profile <ExternalLink className="ml-2 h-3 w-3" />
                       </Button>
                    </div>
                 </div>
              </div>

              {/* Audit History */}
              <div className="space-y-6 pt-10 border-t border-border/40">
                 <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground/20" />
                    <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">Moderation History</p>
                 </div>
                 {product.audit_logs?.length === 0 ? (
                   <p className="text-[10px] font-bold text-muted-foreground/20 uppercase tracking-widest text-center py-8">No previous moderation history.</p>
                 ) : (
                   <div className="space-y-4">
                      {product.audit_logs.map((log: any) => (
                        <div key={log.id} className="flex gap-4">
                           <div className="h-2 w-2 bg-primary rounded-full mt-1.5 shrink-0" />
                           <div className="space-y-1">
                              <p className="text-[11px] font-bold text-foreground">
                                {log.action.replace('_', ' ')} by {log.admin?.first_name}
                              </p>
                              <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                                {new Date(log.created_at).toLocaleString()}
                              </p>
                           </div>
                        </div>
                      ))}
                   </div>
                 )}
              </div>
            </>
          ) : null}
        </div>

        {/* Action Footer */}
        {!isLoading && product && (
          <div className="p-8 border-t border-border/40 bg-muted/5 flex gap-4">
             {product.status === 'ACTIVE' ? (
                <Button 
                  onClick={() => moderate('FLAGGED')}
                  className="flex-1 h-12 bg-amber-500 hover:bg-amber-600 text-white font-bold uppercase tracking-widest text-[10px] rounded-md shadow-none"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" /> Flag Listing
                </Button>
             ) : (
                <Button 
                  onClick={() => moderate('ACTIVE')}
                  className="flex-1 h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-bold uppercase tracking-widest text-[10px] rounded-md shadow-none"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" /> Activate
                </Button>
             )}
             <Button 
               onClick={() => moderate('REJECTED')}
               variant="outline"
               className="flex-1 h-12 border-rose-200 bg-white text-rose-600 hover:bg-rose-50 font-bold uppercase tracking-widest text-[10px] rounded-md shadow-none"
             >
               <Ban className="h-4 w-4 mr-2" /> Reject
             </Button>
          </div>
        )}
      </div>
    </div>
  );
}
