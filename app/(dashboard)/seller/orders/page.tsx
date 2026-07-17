'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, MapPin, Users, Package, Loader2, ArrowRight } from 'lucide-react';
import SellerLayout from '@/components/layout/SellerLayout';
import { OrderActions } from '@/components/dashboard/seller/OrderActions';
import { getCurrentUser } from '@/services/auth/authService';
import Link from 'next/link';

export default function SellerOrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const fetchOrders = async (userId: string) => {
    try {
      const res = await fetch(`/api/orders?userId=${userId}&role=seller`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      toast({ title: "Failed to load orders", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      const currentUser = await getCurrentUser();
      if (!currentUser) return;
      setUser(currentUser);
      await fetchOrders(currentUser.id);
    }
    init();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-500 text-white';
      case 'PAYMENT_SUCCESS': return 'bg-blue-500 text-white';
      case 'HELD_IN_ESCROW': return 'bg-blue-500 text-white';
      case 'PENDING_PAYMENT': return 'bg-yellow-500 text-white';
      case 'DISPUTED': return 'bg-red-500 text-white';
      case 'DELIVERED': return 'bg-emerald-400 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (isLoading) {
    return (
      <SellerLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Active Orders</h1>
            <p className="text-gray-500 font-medium">Manage pending deliveries and verify completed transactions.</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <Card className="py-20 text-center border-dashed">
            <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No orders received yet</h3>
            <p className="text-gray-500 max-w-sm mx-auto mt-2">When buyers purchase your items, their orders will appear here for processing.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="border-gray-200/60 shadow-sm overflow-hidden hover:border-primary/20 transition-colors">
                <div className="flex flex-col md:flex-row">
                  <div className="p-6 md:w-2/3 border-b md:border-b-0 md:border-r border-gray-50 space-y-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(order.status)} border-none`}>{order.status.replace(/_/g, ' ')}</Badge>
                          <span className="text-xs font-mono text-gray-400 font-bold">#{order.order_number}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mt-2">{order.product?.title || 'Unknown Product'}</h3>
                        <p className="text-sm font-medium text-gray-500">
                          Ordered by <span className="text-gray-900 font-bold">{order.buyer?.first_name} {order.buyer?.last_name}</span> on {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Your Earnings</p>
                        <p className="text-2xl font-black text-primary">KSh {Number(order.seller_receivable).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-gray-50">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><MapPin className="h-3 w-3" /> Delivery Preference</p>
                        <p className="text-sm font-bold text-gray-700 truncate">Standard Pickup Location</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Users className="h-3 w-3" /> Buyer Phone</p>
                        <p className="text-sm font-bold text-gray-700">{order.buyer?.phone_number || 'Confidential'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Package className="h-3 w-3" /> Escrow Status</p>
                        <p className={`text-sm font-bold ${order.status === 'COMPLETED' ? 'text-green-600' : 'text-amber-600'}`}>
                           {order.status === 'COMPLETED' ? 'FUNDS RELEASED' : 'HELD IN ESCROW'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 md:w-1/3 bg-gray-50/50 flex flex-col justify-center gap-6">
                    <OrderActions order={order} onUpdate={() => fetchOrders(user.id)} />
                    <Link href={`/seller/orders/${order.id}`}>
                       <Button variant="ghost" className="w-full font-bold text-gray-500 hover:text-primary gap-2">
                         View Full Details <ArrowRight className="h-4 w-4" />
                       </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </SellerLayout>
  );
}
