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
import SellerLayout from '@/components/layout/SellerLayout';
import { OrderActions } from '@/components/dashboard/seller/OrderActions';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function SellerOrderDetails() {
  const { orderId } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatLoading, setIsChatLoading] = useState(false);

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
    <SellerLayout>
      <div className="w-full mx-auto space-y-6 pb-8 px-4 sm:px-6 lg:px-8 py-6 max-w-5xl">
        <Link href="/seller/orders" className="flex items-center text-sm font-medium text-gray-500 hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Orders
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">Order #{order.order_number}</h1>
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
                <CardTitle className="text-lg font-semibold">Product Details</CardTitle>
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
                    <h3 className="text-lg font-semibold text-gray-900">{order.product?.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">Quantity: {order.quantity}</p>
                    <div className="flex items-center gap-4 mt-4">
                      <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Unit Price</p>
                        <p className="font-semibold text-gray-900">KSh {order.product?.price.toLocaleString()}</p>
                      </div>
                      <div className="h-8 w-px bg-gray-100" />
                      <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Earned</p>
                        <p className="font-semibold text-primary">KSh {order.seller_receivable.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200/60 shadow-sm">
              <CardHeader className="border-b border-gray-50">
                <CardTitle className="text-lg font-semibold">Delivery Instructions</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Pickup/Delivery Point</p>
                    <p className="text-base font-semibold text-gray-900">
                      {order.product?.location?.formatted_address || order.product?.location?.city || order.seller?.city || 'Default Pickup Location'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1 italic">Note: "{order.delivery_notes || "Please contact the buyer to arrange meeting details."}"</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Preferred Time</p>
                    <p className="text-base font-semibold text-gray-900">{order.delivery_time_preference || "Contact buyer to arrange"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card className="border-gray-200/60 shadow-sm">
              <CardHeader className="border-b border-gray-50">
                <CardTitle className="text-lg font-semibold">Buyer Information</CardTitle>
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
                    <p className="font-semibold text-gray-900">{order.buyer?.first_name} {order.buyer?.last_name}</p>
                    <p className="text-xs text-gray-500">Buyer since Jan 2024</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start font-medium h-11">
                    <Phone className="h-4 w-4 mr-3 text-gray-400" />
                    {order.buyer?.phone_number || 'No phone provided'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start font-medium h-11"
                    onClick={handleChatStart}
                    disabled={isChatLoading}
                  >
                    {isChatLoading ? <Loader2 className="h-4 w-4 mr-3 animate-spin" /> : <MessageCircle className="h-4 w-4 mr-3 text-gray-400" />}
                    Open Chat
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 text-white p-6 space-y-4 rounded-2xl shadow-sm border-none">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h4 className="text-sm font-medium uppercase tracking-wider">Escrow Protected</h4>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                The buyer paid <strong className="text-white">KSh {order.total_amount.toLocaleString()}</strong>. Funds are securely held in Escrow and will be released to you upon successful delivery.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
