'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  CheckCircle2,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Copy,
  ArrowLeft,
  Loader2,
  Package,
  Phone,
  MessageCircle,
  Truck,
  ShieldAlert,
  ChevronRight,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser } from '@/services/auth/authService';

const ORDER_STATUS_STEPS = [
  { key: 'PAYMENT_SUCCESS', label: 'Payment Confirmed', description: 'Funds are securely held in escrow.' },
  { key: 'PRODUCT_LOCKED', label: 'Item Reserved', description: 'Seller has been notified to prepare for delivery.' },
  { key: 'OUT_FOR_DELIVERY', label: 'In Transit', description: 'The item is on its way to you.' },
  { key: 'AWAITING_VERIFICATION', label: 'Ready for Pick-up', description: 'Verify the item and provide your code.' },
  { key: 'COMPLETED', label: 'Transaction Complete', description: 'Payment released to seller. Thank you!' },
];

export default function BuyerOrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push('/login');
          return;
        }
        setUser(currentUser);

        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        
        if (data.order) {
          setOrder(data.order);
        } else {
          toast({ title: "Order not found", variant: "destructive" });
          router.push('/buyer/orders');
        }
      } catch (error) {
        toast({ title: "Failed to load order", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    if (orderId) loadData();
  }, [orderId, router, toast]);

  const copyCode = () => {
    if (order?.delivery_code) {
      navigator.clipboard.writeText(order.delivery_code);
      toast({ title: "Code Copied", description: "Share this ONLY after you have inspected the item." });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
      </div>
    );
  }

  if (!order) return null;

  const currentStepIndex = ORDER_STATUS_STEPS.findIndex(s => s.key === order.status);
  const sellerName = order.seller?.first_name
    ? `${order.seller.first_name} ${order.seller.last_name || ''}`.trim()
    : 'Seller';

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            <Link href="/buyer/orders" className="hover:text-primary transition-colors">Orders</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-primary">Track Order</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900">
            Order #{order.order_number}
          </h1>
          <p className="text-gray-500 font-medium">Placed on {new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
        </div>
        
        <div className="flex gap-3">
          <Link href={`/buyer/disputes/new/${orderId}`}>
            <Button variant="outline" className="rounded-xl font-bold text-xs gap-2 border-red-100 text-red-500 hover:bg-red-50">
              <ShieldAlert className="h-4 w-4" /> Raise Issue
            </Button>
          </Link>
          <Button variant="outline" className="rounded-xl font-bold text-xs gap-2">
            <MessageCircle className="h-4 w-4" /> Chat with Seller
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Progress & Security */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Real-time Status Card */}
          <Card className="border-none shadow-soft overflow-hidden">
            <div className={`h-2 w-full ${order.status === 'COMPLETED' ? 'bg-green-500' : 'bg-primary'}`} />
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row justify-between gap-8">
                <div className="space-y-6 flex-1">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-gray-900 leading-tight">
                      {ORDER_STATUS_STEPS[currentStepIndex]?.label || 'In Progress'}
                    </h2>
                    <p className="text-sm text-gray-500 font-medium">
                      {ORDER_STATUS_STEPS[currentStepIndex]?.description || 'We are processing your order.'}
                    </p>
                  </div>

                  {/* Vertical Stepper */}
                  <div className="space-y-6 pt-4 relative">
                    {/* Line */}
                    <div className="absolute left-[13px] top-6 bottom-6 w-0.5 bg-gray-100" />
                    
                    {ORDER_STATUS_STEPS.map((step, index) => {
                      const isDone = index <= currentStepIndex;
                      const isCurrent = index === currentStepIndex;
                      return (
                        <div key={step.key} className="relative flex gap-6 group">
                          <div className={`z-10 h-7 w-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isDone ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30' : 'bg-white border-2 border-gray-100 text-gray-300'
                          }`}>
                            {isDone ? <CheckCircle2 className="h-4 w-4" /> : <div className="h-1.5 w-1.5 rounded-full bg-gray-200" />}
                          </div>
                          <div className="space-y-0.5">
                            <p className={`text-sm font-black uppercase tracking-tight transition-colors ${
                              isDone ? 'text-gray-900' : 'text-gray-400'
                            }`}>
                              {step.label}
                            </p>
                            {isCurrent && (
                              <p className="text-xs text-primary font-bold animate-in fade-in slide-in-from-left-2 duration-500">
                                Current Status
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tracking Action / Code */}
                {order.status !== 'COMPLETED' && (
                  <div className="md:w-72 space-y-4">
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
                       <div className="flex items-center gap-2">
                          <ShieldCheck className="h-5 w-5 text-primary" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Escrow Protected</p>
                       </div>
                       <div>
                          <p className="text-xs font-bold text-gray-500 mb-2">Delivery Verification Code</p>
                          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-gray-200">
                             <span className="font-mono text-xl font-black tracking-widest text-gray-900">
                                {order.delivery_code || '---'}
                             </span>
                             <button onClick={copyCode} className="text-primary hover:scale-110 transition-transform">
                                <Copy className="h-4 w-4" />
                             </button>
                          </div>
                       </div>
                       <p className="text-[10px] leading-relaxed text-gray-400 font-medium">
                          Share this code with the seller <span className="text-gray-900 font-bold">only after</span> you have received and inspected the item.
                       </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Map/Location Placeholder */}
          <Card className="border-none shadow-soft overflow-hidden">
             <CardContent className="p-0 relative h-64 bg-gray-100 flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000')] bg-cover opacity-20 grayscale" />
                <div className="relative z-10 text-center space-y-4">
                   <div className="h-12 w-12 bg-white rounded-2xl shadow-xl flex items-center justify-center mx-auto text-primary animate-bounce">
                      <MapPin className="h-6 w-6" />
                   </div>
                   <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Awaiting Courier Assignment</p>
                </div>
             </CardContent>
          </Card>
        </div>

        {/* Right Column: Order Details */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Product Card */}
          <Card className="border-none shadow-soft overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-4 px-6">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-gray-400">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex gap-4">
                <div className="h-20 w-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                   {order.product?.images?.[0]?.image_url ? (
                     <img src={order.product.images[0].image_url} alt="" className="h-full w-full object-cover" />
                   ) : (
                     <div className="h-full w-full flex items-center justify-center text-gray-300">
                        <Package className="h-8 w-8" />
                     </div>
                   )}
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">{order.product?.title}</h3>
                  <p className="text-lg font-black text-primary">KSh {order.total_amount.toLocaleString()}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50 space-y-3">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-bold uppercase tracking-widest">Condition</span>
                    <span className="text-gray-900 font-bold">{order.product?.condition || 'Used'}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-bold uppercase tracking-widest">Quantity</span>
                    <span className="text-gray-900 font-bold">1 Unit</span>
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* Seller Contact */}
          <Card className="border-none shadow-soft bg-primary text-white">
            <CardContent className="p-6 space-y-6">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-white/20 border border-white/30 p-0.5">
                     <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-primary font-black">
                        {sellerName[0]}
                     </div>
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Seller Identity</p>
                     <p className="text-sm font-bold">{sellerName}</p>
                  </div>
               </div>
               
               <div className="grid gap-2">
                  <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold rounded-xl gap-2 h-11">
                     <MessageCircle className="h-4 w-4" /> Message Seller
                  </Button>
                  <Button variant="outline" className="w-full border-white/30 hover:bg-white/10 text-white font-bold rounded-xl gap-2 h-11">
                     <Phone className="h-4 w-4" /> Call {order.seller?.phone_number || 'Seller'}
                  </Button>
               </div>
            </CardContent>
          </Card>

          {/* Payment Status */}
          <div className="px-6 space-y-4">
             <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Payment Status</p>
                <Badge className="bg-emerald-100 text-emerald-700 border-none px-3 font-black text-[9px] uppercase tracking-widest">Verified</Badge>
             </div>
             <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                Funds are held in Bagcom Escrow and will only be released to the seller once you verify receipt of the item using the security code.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
