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
    <div className="w-full mx-auto space-y-4 sm:space-y-6 pb-8 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <Link href="/buyer">
            <Button variant="ghost" size="icon" className="rounded-full shrink-0 bg-gray-50 hover:bg-gray-100">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">My Orders</h1>
            <p className="text-gray-500 font-medium mt-1 text-sm">Track your purchases.</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-gray-100 shadow-sm rounded-2xl bg-white overflow-hidden">
          <CardContent className="p-4 sm:p-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by order number or product..." 
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50 hover:bg-white transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
              <select 
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white font-medium text-gray-700 shrink-0"
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
              <Button variant="outline" className="gap-2 rounded-xl h-auto py-2.5 shrink-0 border-gray-200 text-gray-600 font-medium hidden sm:flex">
                <Filter className="h-4 w-4" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-4 sm:space-y-6">
          {filteredOrders.length === 0 ? (
            <Card className="border-gray-100 shadow-sm rounded-2xl bg-white">
              <CardContent className="p-16 text-center">
                <Package className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">No orders found</h3>
                <p className="text-sm font-medium text-gray-500 mt-1">Try adjusting your search or filters.</p>
                <Button variant="link" onClick={() => {setSearchQuery(''); setStatusFilter('all');}} className="mt-4 text-primary">Clear all filters</Button>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => {
              const StatusIcon = getStatusIcon(order.status);
              return (
                <Card key={order.id} className="overflow-hidden border border-gray-100 shadow-sm rounded-2xl bg-white hover:shadow-md transition-shadow">
                  <div className="bg-gray-50/50 px-5 sm:px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 text-sm">
                    <div className="grid grid-cols-2 sm:flex sm:gap-8 gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Order Placed</p>
                        <p className="text-gray-900 font-semibold mt-0.5">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Total</p>
                        <p className="text-gray-900 font-semibold mt-0.5">KSh {order.total_amount.toLocaleString()}</p>
                      </div>
                      <div className="col-span-2 sm:col-span-1 border-t sm:border-0 pt-3 sm:pt-0 border-gray-200">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Seller</p>
                        <p className="text-gray-900 font-semibold mt-0.5 hover:text-primary cursor-pointer truncate max-w-[150px]">
                          {order.seller?.first_name} {order.seller?.last_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col justify-between sm:justify-end items-center sm:items-end border-t sm:border-0 pt-3 sm:pt-0 border-gray-200 w-full sm:w-auto">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Order #{order.order_number}</p>
                      <Link href={`/buyer/orders/${order.id}`} className="text-primary font-semibold text-sm hover:underline mt-0.5">View Details</Link>
                    </div>
                  </div>
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex flex-col sm:flex-row gap-5 w-full">
                        <div className="h-20 w-20 sm:h-24 sm:w-24 bg-gray-50 border border-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                          {order.product?.images?.[0]?.image_url ? (
                            <img src={order.product.images[0].image_url} alt={order.product.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-1.5 flex-1">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2">{order.product?.title}</h3>
                          <p className="text-sm font-medium text-gray-500 line-clamp-1">{order.product?.condition} Condition</p>
                          <div className="flex flex-wrap items-center gap-3 pt-2">
                            <Badge className={`${getStatusColor(order.status)} text-white shadow-sm border-none text-[10px] uppercase tracking-wider px-2.5 py-0.5 font-bold`}>
                              <StatusIcon className="h-3 w-3 mr-1.5" />
                              {order.status.replace('_', ' ')}
                            </Badge>
                            {order.status === 'PAYMENT_SUCCESS' && (
                              <div className="flex items-center text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100/50">
                                <Clock className="h-3 w-3 mr-1.5" />
                                Code: {order.delivery_code}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 min-w-[200px] w-full md:w-auto shrink-0 pt-4 md:pt-0 border-t md:border-0 border-gray-100">
                        <Link href={`/buyer/orders/${order.id}`} className="w-full">
                          <Button className="w-full h-10 rounded-xl shadow-sm font-medium">Track Package</Button>
                        </Link>
                        <Button variant="outline" className="w-full h-10 rounded-xl border-gray-200 text-gray-600 font-medium">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Chat
                        </Button>
                        {order.status === 'COMPLETED' && (
                          <Link href={`/buyer/reviews/${order.id}`} className="w-full">
                            <Button variant="outline" className="w-full h-10 rounded-xl font-medium text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-200/50">
                              <Star className="h-4 w-4 mr-2" />
                              Rate
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
