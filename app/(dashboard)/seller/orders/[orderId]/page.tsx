'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  ShieldCheck,
  CreditCard,
  User,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/navigation/Header';
import { OrderActions } from '@/components/dashboard/seller/OrderActions';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function SellerOrderDetails() {
  const { orderId } = useParams();
  const router = useRouter();
  const { toast } = useToast();
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
          toast({ title: "Order not found", variant: "destructive" });
          router.push('/seller');
        }
      } catch (error) {
        toast({ title: "Error loading order", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-500';
      case 'PAYMENT_SUCCESS': return 'bg-blue-500';
      case 'DISPUTED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Header isLoggedIn={true} setIsLoggedIn={() => {}} userRole="seller" />
      
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/seller" className="flex items-center text-sm font-bold text-gray-500 hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-gray-900">Order #{order.order_number}</h1>
              <Badge className={`${getStatusColor(order.status)} text-white`}>{order.status.replace('_', ' ')}</Badge>
            </div>
            <p className="text-gray-500 font-medium mt-1">Placed on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}</p>
          </div>
          <div className="flex gap-3">
             <OrderActions order={order} onUpdate={() => router.refresh()} />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-gray-200/60 shadow-sm">
              <CardHeader className="border-b border-gray-50">
                <CardTitle className="text-lg font-bold">Product Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={order.product?.images?.[0]?.image_url || 'https://via.placeholder.com/100'} 
                      className="w-full h-full object-cover" 
                      alt={order.product?.title}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{order.product?.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">Quantity: {order.quantity}</p>
                    <div className="flex items-center gap-4 mt-4">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unit Price</p>
                        <p className="font-bold text-gray-900">KSh {order.product?.price.toLocaleString()}</p>
                      </div>
                      <div className="h-8 w-px bg-gray-100" />
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Earned</p>
                        <p className="font-black text-primary">KSh {order.seller_receivable.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200/60 shadow-sm">
              <CardHeader className="border-b border-gray-50">
                <CardTitle className="text-lg font-bold">Delivery Instructions</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Pickup/Delivery Point</p>
                    <p className="text-base font-bold text-gray-900">Student Center, Gate A, Strathmore University</p>
                    <p className="text-sm text-gray-500 mt-1 italic">Note: "Please meet at the fountain outside the student center."</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Preferred Time</p>
                    <p className="text-base font-bold text-gray-900">After 4:00 PM (Weekdays)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card className="border-gray-200/60 shadow-sm">
              <CardHeader className="border-b border-gray-50">
                <CardTitle className="text-lg font-bold">Buyer Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                    {order.buyer?.profile_photo_url ? (
                      <img src={order.buyer.profile_photo_url} className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{order.buyer?.first_name} {order.buyer?.last_name}</p>
                    <p className="text-xs text-gray-500">Buyer since Jan 2024</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start font-bold h-11">
                    <Phone className="h-4 w-4 mr-3 text-gray-400" />
                    {order.buyer?.phone_number || 'No phone provided'}
                  </Button>
                  <Button variant="outline" className="w-full justify-start font-bold h-11">
                    <MessageCircle className="h-4 w-4 mr-3 text-gray-400" />
                    Open Chat
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 text-white p-6 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h4 className="text-sm font-bold uppercase tracking-widest">Escrow Protected</h4>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                The buyer has already paid **KSh {order.total_amount.toLocaleString()}**. These funds are safely held in Bagcom's escrow account and will be released to you as soon as you enter the verification code provided by the buyer.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
