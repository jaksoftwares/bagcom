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
  ExternalLink,
  RotateCcw
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
  { key: 'DISPUTED', label: 'Dispute Active', description: 'Administrative mediation is currently in progress.' },
  { key: 'COMPLETED', label: 'Transaction Complete', description: 'Payment released to seller. Thank you!' },
  { key: 'REFUNDED', label: 'Order Refunded', description: 'Funds have been returned to your M-PESA.' },
];

export default function BuyerOrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isChatLoading, setIsChatLoading] = useState(false);

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

  const handleChatStart = async () => {
    if (!order) return;
    setIsChatLoading(true);
    try {
      const res = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer_id: order.buyer_id,
          seller_id: order.seller_id,
          product_id: order.product_id,
          order_id: order.id
        })
      });
      const data = await res.json();
      if (data.conversation) {
        router.push(`/chat?id=${data.conversation.id}`);
      } else {
        throw new Error('Failed to create chat');
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to start chat.", variant: "destructive" });
    } finally {
      setIsChatLoading(false);
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
    <div className="w-full mx-auto space-y-6 sm:space-y-8 pb-8 px-4 sm:px-6 lg:px-8 py-6 max-w-5xl">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
            <Link href="/buyer/orders" className="hover:text-primary transition-colors">Orders</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-primary">Details</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            Order #{order.order_number}
          </h1>
          <p className="text-gray-500 font-medium text-sm">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link href={`/buyer/disputes/new/${orderId}`} className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto rounded-xl font-medium text-red-600 hover:bg-red-50 border-red-200">
              <ShieldAlert className="h-4 w-4 mr-2" /> Raise Issue
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="w-full sm:w-auto rounded-xl font-medium text-gray-700 border-gray-200"
            onClick={handleChatStart}
            disabled={isChatLoading}
          >
            {isChatLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <MessageCircle className="h-4 w-4 mr-2" />} 
            Chat
          </Button>
        </div>
      </div>
      {/* Dispute Alert Banner */}
      {order.status === 'DISPUTED' && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 shadow-sm">
           <div className="h-12 w-12 sm:h-14 sm:w-14 bg-red-100 rounded-xl flex items-center justify-center text-red-600 shrink-0">
              <ShieldAlert className="h-6 w-6 sm:h-8 sm:w-8" />
           </div>
           <div className="space-y-1">
              <p className="text-xs font-bold text-red-900 uppercase tracking-widest">Under Mediation</p>
              <p className="text-sm text-red-700 font-medium leading-relaxed">Dispute raised. Our team is reviewing the evidence. Funds are frozen in escrow.</p>
           </div>
        </div>
      )}

      {order.status === 'REFUNDED' && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 shadow-sm">
           <div className="h-12 w-12 sm:h-14 sm:w-14 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
              <RotateCcw className="h-6 w-6 sm:h-8 sm:w-8" />
           </div>
           <div className="space-y-1">
              <p className="text-xs font-bold text-emerald-900 uppercase tracking-widest">Refund Processed</p>
              <p className="text-sm text-emerald-700 font-medium leading-relaxed">Dispute resolved in your favor. Funds returned to your wallet.</p>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Left Column: Progress & Security */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          
          {/* Real-time Status Card */}
          <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white overflow-hidden">
            <div className={`h-1.5 w-full ${order.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-primary'}`} />
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col md:flex-row justify-between gap-8">
                <div className="space-y-1 flex-1">
                  <div className="space-y-1">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                      {ORDER_STATUS_STEPS[currentStepIndex]?.label || 'In Progress'}
                    </h2>
                    <p className="text-sm text-gray-500 font-medium">
                      {ORDER_STATUS_STEPS[currentStepIndex]?.description || 'Processing your order.'}
                    </p>
                  </div>

                  {/* Vertical Stepper */}
                  <div className="space-y-6 pt-6 relative">
                    {/* Line */}
                    <div className="absolute left-[13px] top-8 bottom-6 w-[2px] bg-gray-100" />
                    
                    {ORDER_STATUS_STEPS.map((step, index) => {
                      const isDone = index <= currentStepIndex;
                      const isCurrent = index === currentStepIndex;
                      return (
                        <div key={step.key} className="relative flex gap-6 group">
                          <div className={`z-10 h-7 w-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isDone ? 'bg-primary text-white shadow-md' : 'bg-white border-2 border-gray-200 text-gray-300'
                          }`}>
                            {isDone ? <CheckCircle2 className="h-4 w-4" /> : <div className="h-1.5 w-1.5 rounded-full bg-gray-300" />}
                          </div>
                          <div className="space-y-0.5 pt-0.5">
                            <p className={`text-sm font-bold uppercase tracking-wider transition-colors ${
                              isDone ? 'text-gray-900' : 'text-gray-400'
                            }`}>
                              {step.label}
                            </p>
                            {isCurrent && (
                              <p className="text-xs text-primary font-bold">
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
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-5">
                       <div className="flex items-center gap-2">
                          <ShieldCheck className="h-5 w-5 text-primary" />
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Escrow Protected</p>
                       </div>
                       <div>
                          <p className="text-xs font-semibold text-gray-600 mb-2">Delivery Verification Code</p>
                          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm">
                             <span className="font-mono text-xl font-bold tracking-widest text-gray-900">
                                {order.delivery_code || '---'}
                             </span>
                             <button onClick={copyCode} className="text-gray-400 hover:text-primary transition-colors">
                                <Copy className="h-5 w-5" />
                             </button>
                          </div>
                       </div>
                       <p className="text-xs leading-relaxed text-gray-500 font-medium">
                          Share this code with the seller <span className="text-gray-900 font-semibold">only after</span> receiving the item.
                       </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Order Details */}
        <div className="lg:col-span-4 space-y-6 sm:space-y-8">
          
          {/* Product Card */}
          <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-4 px-6">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Order Summary</CardTitle>
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
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">{order.product?.title}</h3>
                  <p className="text-lg font-bold text-gray-900">KSh {order.total_amount.toLocaleString()}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50 space-y-3">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Condition</span>
                    <span className="text-gray-900 font-semibold">{order.product?.condition || 'Used'}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Quantity</span>
                    <span className="text-gray-900 font-semibold">1 Unit</span>
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* Seller Contact */}
          <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white overflow-hidden">
            <CardContent className="p-6 space-y-6">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                     {sellerName[0]}
                  </div>
                  <div>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Seller Identity</p>
                     <p className="text-sm font-semibold text-gray-900">{sellerName}</p>
                  </div>
               </div>
               
               <div className="grid gap-3">
                  <Button 
                    variant="outline" 
                    className="w-full font-medium rounded-xl border-gray-200 text-gray-700 h-11 hover:bg-gray-50"
                    onClick={handleChatStart}
                    disabled={isChatLoading}
                  >
                     {isChatLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <MessageCircle className="h-4 w-4 mr-2" />} Message Seller
                  </Button>
                  <Button variant="outline" className="w-full font-medium rounded-xl border-gray-200 text-gray-700 h-11 hover:bg-gray-50">
                     <Phone className="h-4 w-4 mr-2" /> Call Seller
                  </Button>
               </div>
            </CardContent>
          </Card>

          {/* Payment Status */}
          <div className="px-2 space-y-3">
             <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Payment Status</p>
                <Badge className="bg-emerald-50 text-emerald-600 border-none px-2.5 py-0.5 font-bold text-[10px] uppercase tracking-wider">Verified</Badge>
             </div>
             <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Funds are held in Escrow and will be released to the seller once you verify receipt.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
