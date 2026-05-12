'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  CheckCircle2,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Copy,
  ArrowRight,
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
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import StorefrontLayout from '@/components/layout/StorefrontLayout';

const ORDER_STATUS_STEPS = [
  { key: 'PAYMENT_SUCCESS', label: 'Payment Confirmed', description: 'Funds are securely held in escrow.' },
  { key: 'PRODUCT_LOCKED', label: 'Item Reserved', description: 'Seller has been notified to prepare for delivery.' },
  { key: 'OUT_FOR_DELIVERY', label: 'In Transit', description: 'The item is on its way to you.' },
  { key: 'AWAITING_VERIFICATION', label: 'Ready for Pick-up', description: 'Verify the item and provide your code.' },
  { key: 'COMPLETED', label: 'Transaction Complete', description: 'Payment released to seller. Thank you!' },
];

export default function GuestOrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (data.order) {
          setOrder(data.order);
        } else {
          router.push('/products');
        }
      } catch {
        router.push('/products');
      } finally {
        setIsLoading(false);
      }
    }
    if (orderId) fetchOrder();
  }, [orderId, router]);

  const copyCode = () => {
    if (order?.delivery_code) {
      navigator.clipboard.writeText(order.delivery_code);
      toast({ title: "Code Copied", description: "Share this ONLY after you have inspected the item." });
    }
  };

  if (isLoading) {
    return (
      <StorefrontLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
        </div>
      </StorefrontLayout>
    );
  }

  if (!order) return null;

  const currentStepIndex = ORDER_STATUS_STEPS.findIndex(s => s.key === order.status);
  const sellerName = order.seller?.first_name
    ? `${order.seller.first_name} ${order.seller.last_name || ''}`.trim()
    : 'Seller';

  return (
    <StorefrontLayout>
      <div className="bg-[#F8FAFC] min-h-screen py-16 sm:py-24">
        <div className="container mx-auto px-4 max-w-4xl space-y-12">
          
          {/* Status Alert Banner */}
          <div className="bg-white border border-primary/10 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-soft">
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                <Package className="h-8 w-8" />
              </div>
              <div className="space-y-1 text-center md:text-left">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Track Order #{order.order_number}</h1>
                <p className="text-sm font-medium text-gray-500">
                  {order.status === 'COMPLETED' ? 'Your order has been completed.' : 'Your order is being processed securely.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
               <Badge className="bg-emerald-100 text-emerald-700 border-none px-4 py-1.5 font-black text-[10px] uppercase tracking-widest">
                  Escrow Active
               </Badge>
               <Button variant="outline" size="sm" className="rounded-xl border-gray-200 font-bold gap-2">
                  <ExternalLink className="h-4 w-4" /> Help Center
               </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Main Progress Section */}
            <div className="lg:col-span-7 space-y-10">
              
              {/* Stepper Card */}
              <div className="space-y-8">
                 <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">Order Progress</h2>
                 <div className="space-y-8 relative pl-4">
                    {/* Continuous Progress Line */}
                    <div className="absolute left-[29px] top-4 bottom-4 w-0.5 bg-gray-100" />
                    
                    {ORDER_STATUS_STEPS.map((step, index) => {
                      const isDone = index <= currentStepIndex;
                      const isCurrent = index === currentStepIndex;
                      return (
                        <div key={step.key} className="relative flex gap-8 group">
                          <div className={`z-10 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                            isDone ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : 'bg-white border-2 border-gray-100 text-gray-300'
                          }`}>
                            {isDone ? <CheckCircle2 className="h-4 w-4" /> : <div className="h-1.5 w-1.5 rounded-full bg-gray-200" />}
                          </div>
                          <div className="space-y-1">
                            <h3 className={`text-base font-bold tracking-tight uppercase transition-colors ${
                              isDone ? 'text-gray-900' : 'text-gray-400'
                            }`}>
                              {step.label}
                            </h3>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-md">
                              {step.description}
                            </p>
                            {isCurrent && (
                              <div className="mt-2 inline-flex items-center px-3 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                                 Your Current Status
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                 </div>
              </div>

              {/* Delivery Instruction Section */}
              <div className="p-8 bg-amber-50 rounded-3xl border border-amber-100 space-y-4">
                 <div className="flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6 text-amber-600" />
                    <h3 className="text-lg font-black text-amber-900 tracking-tight">Escrow Security Protocols</h3>
                 </div>
                 <p className="text-sm text-amber-800/80 font-medium leading-relaxed">
                    We've confirmed your payment of <span className="font-bold">KSh {(order.total_amount || 0).toLocaleString()}</span>. This amount will remain safely in our vault until you provide the verification code to the seller.
                 </p>
                 <div className="grid gap-2 pt-2">
                    {[
                      "Inspect the item thoroughly before sharing your code.",
                      "Ensure all parts and conditions match the description.",
                      "Never share the code over phone or chat before meeting."
                    ].map((tip, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs text-amber-900/60 font-bold">
                         <div className="h-1 w-1 bg-amber-400 rounded-full" />
                         {tip}
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            {/* Sidebar Details Column */}
            <div className="lg:col-span-5 space-y-8">
               
               {/* Verification Code Hero */}
               {order.status !== 'COMPLETED' && (
                 <div className="bg-primary rounded-3xl p-8 text-white shadow-2xl shadow-primary/20 space-y-6">
                    <div>
                       <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Verification Identity</p>
                       <h3 className="text-xl font-bold mt-1">Proof of Delivery</h3>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 flex items-center justify-between">
                       <div>
                          <p className="text-3xl font-bold tracking-[0.2em] font-mono">
                             {order.delivery_code || '---'}
                          </p>
                       </div>
                       <button onClick={copyCode} className="h-12 w-12 bg-white text-primary rounded-xl flex items-center justify-center hover:scale-105 transition-transform">
                          <Copy className="h-5 w-5" />
                       </button>
                    </div>

                    <p className="text-xs font-medium opacity-80 leading-relaxed text-center">
                       Provide this code to the seller when you are satisfied with the item to release payment.
                    </p>
                 </div>
               )}

               {/* Product Summary */}
               <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-soft space-y-6">
                  <div className="flex gap-5">
                     <div className="h-20 w-20 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                        {order.product?.images?.[0]?.image_url ? (
                          <img src={order.product.images[0].image_url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-300">
                             <Package className="h-8 w-8" />
                          </div>
                        )}
                     </div>
                     <div className="space-y-1">
                        <h4 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">{order.product?.title}</h4>
                        <p className="text-xl font-black text-primary">KSh {order.total_amount.toLocaleString()}</p>
                     </div>
                  </div>

                  <div className="pt-6 border-t border-gray-50 space-y-4">
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Seller</span>
                        <span className="text-sm font-bold text-gray-900">{sellerName}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Delivery Point</span>
                        <div className="text-right">
                           <p className="text-sm font-bold text-gray-900 flex items-center justify-end gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-gray-400" /> Local Pickup
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className="pt-6 space-y-3">
                     <Button className="w-full h-12 rounded-xl font-bold gap-2 shadow-lg shadow-primary/10">
                        <MessageCircle className="h-4 w-4" /> Chat with Seller
                     </Button>
                     <Button variant="ghost" className="w-full text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest gap-2">
                        <ShieldAlert className="h-3.5 w-3.5" /> Raise Dispute
                     </Button>
                  </div>
               </div>

               {/* Footer Note */}
               <div className="px-6 text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose">
                     Protected by Bagcom Escrow Technology<br/>
                     Encrypted Secure Transaction
                  </p>
               </div>

            </div>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
