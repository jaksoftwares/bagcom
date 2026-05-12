'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Search, 
  Filter,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ChevronRight,
  MessageCircle,
  Star
} from 'lucide-react';
import { getCurrentUser } from '@/services/auth/authService';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function BuyerOrdersPage() {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function loadOrders() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          window.location.href = '/login';
          return;
        }
        setUser(currentUser);

        const res = await fetch(`/api/orders?userId=${currentUser.id}&role=buyer`);
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error('Error loading orders:', error);
        toast({ title: "Failed to load orders", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    loadOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-500';
      case 'DELIVERED': return 'bg-green-400';
      case 'PAYMENT_SUCCESS': return 'bg-blue-500';
      case 'PENDING_PAYMENT': return 'bg-yellow-500';
      case 'FAILED': return 'bg-red-500';
      case 'DISPUTED': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return CheckCircle;
      case 'DELIVERED': return Package;
      case 'PAYMENT_SUCCESS': return Clock;
      case 'PENDING_PAYMENT': return Clock;
      case 'FAILED': return AlertCircle;
      default: return Clock;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         order.product?.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/buyer">
            <Button variant="ghost" size="sm" className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600">View and track all your purchases on Bagcom.</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by order number or product..." 
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select 
                className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="PENDING_PAYMENT">Pending Payment</option>
                <option value="PAYMENT_SUCCESS">Paid</option>
                <option value="DELIVERED">Delivered</option>
                <option value="COMPLETED">Completed</option>
                <option value="DISPUTED">Disputed</option>
              </select>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">No orders found</h3>
                <p className="text-gray-500">Try adjusting your search or filters.</p>
                <Button variant="link" onClick={() => {setSearchQuery(''); setStatusFilter('all');}}>Clear all filters</Button>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => {
              const StatusIcon = getStatusIcon(order.status);
              return (
                <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="bg-gray-50 px-6 py-3 border-b flex flex-wrap justify-between items-center gap-4 text-sm">
                    <div className="flex gap-8">
                      <div>
                        <p className="text-gray-500 font-medium">ORDER PLACED</p>
                        <p className="text-gray-900 font-bold">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium">TOTAL</p>
                        <p className="text-gray-900 font-bold">KSh {order.total_amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium">SELLER</p>
                        <p className="text-gray-900 font-bold hover:text-primary cursor-pointer">
                          {order.seller?.first_name} {order.seller?.last_name}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium text-right uppercase tracking-tight">Order #{order.order_number}</p>
                      <Link href={`/buyer/orders/${order.id}`} className="text-primary font-bold hover:underline">View Order Details</Link>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex gap-6">
                        <div className="h-24 w-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                          {order.product?.images?.[0]?.image_url ? (
                            <img src={order.product.images[0].image_url} alt={order.product.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-8 w-8 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-lg font-bold text-gray-900">{order.product?.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{order.product?.condition} Condition · KSh {order.product?.price.toLocaleString()}</p>
                          <div className="flex items-center gap-4 mt-4">
                            <Badge className={`${getStatusColor(order.status)} text-white`}>
                              <StatusIcon className="h-3.5 w-3.5 mr-1.5" />
                              {order.status.replace('_', ' ')}
                            </Badge>
                            {order.status === 'PAYMENT_SUCCESS' && (
                              <div className="flex items-center text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                                <Clock className="h-3 w-3 mr-1" />
                                Delivery Verification Code: {order.delivery_code}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 min-w-[180px]">
                        <Link href={`/buyer/orders/${order.id}`} className="w-full">
                          <Button className="w-full h-10 font-bold">Track Package</Button>
                        </Link>
                        <Button variant="outline" className="w-full h-10 font-bold gap-2">
                          <MessageCircle className="h-4 w-4" />
                          Chat with Seller
                        </Button>
                        {order.status === 'COMPLETED' && (
                          <Link href={`/buyer/reviews/${order.id}`}>
                            <Button variant="outline" className="w-full h-10 font-bold gap-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 border-yellow-200">
                              <Star className="h-4 w-4" />
                              Rate Seller
                            </Button>
                          </Link>
                        )}

                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
  );
}
