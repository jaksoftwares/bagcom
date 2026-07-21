'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  MapPin, 
  PhoneCall, 
  CreditCard,
  Loader2, 
  ArrowRight,
  Package,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import SellerLayout from '@/components/layout/SellerLayout';
import { OrderActions } from '@/components/dashboard/seller/OrderActions';
import { getCurrentUser } from '@/services/auth/authService';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function SellerOrdersPage() {
  const { toast } = useToast();
  
  // Data State
  const [orders, setOrders] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchOrders = useCallback(async (userId: string, page: number) => {
    setIsFetching(true);
    try {
      const res = await fetch(`/api/orders?userId=${userId}&role=seller&page=${page}&limit=${itemsPerPage}`);
      const data = await res.json();
      
      if (res.ok) {
        setOrders(data.orders || []);
        setTotalCount(data.count || 0);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({ title: "Failed to load orders", variant: "destructive" });
    } finally {
      setIsFetching(false);
      setIsLoading(false);
    }
  }, [itemsPerPage, toast]);

  useEffect(() => {
    let active = true;
    async function init() {
      const currentUser = await getCurrentUser();
      if (!currentUser || !active) return;
      if (!user) setUser(currentUser);
      await fetchOrders(currentUser.id, currentPage);
    }
    init();
    return () => { active = false; };
  }, [currentPage, fetchOrders, user]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'COMPLETED': 
        return { label: 'Completed', style: 'bg-emerald-50 text-emerald-600 ring-emerald-500/20', dot: 'bg-emerald-500' };
      case 'PAYMENT_SUCCESS': 
      case 'HELD_IN_ESCROW': 
        return { label: 'Processing', style: 'bg-blue-50 text-blue-600 ring-blue-500/20', dot: 'bg-blue-500 animate-pulse' };
      case 'PENDING_PAYMENT': 
        return { label: 'Pending Payment', style: 'bg-amber-50 text-amber-600 ring-amber-500/20', dot: 'bg-amber-500' };
      case 'DISPUTED': 
        return { label: 'Disputed', style: 'bg-red-50 text-red-600 ring-red-500/20', dot: 'bg-red-500 animate-pulse' };
      case 'DELIVERED': 
        return { label: 'Delivered', style: 'bg-teal-50 text-teal-600 ring-teal-500/20', dot: 'bg-teal-500' };
      default: 
        return { label: status, style: 'bg-gray-50 text-gray-600 ring-gray-500/20', dot: 'bg-gray-400' };
    }
  };

  const getDeliveryPreference = (order: any) => {
    if (order.product?.location?.city) return order.product.location.city;
    if (order.product?.location?.formatted_address) return order.product.location.formatted_address;
    if (order.seller?.city) return order.seller.city;
    return 'Default Pickup Location';
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  if (isLoading) {
    return (
      <SellerLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-gray-500 tracking-wider uppercase animate-pulse">Loading Orders</p>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className="w-full mx-auto space-y-4 sm:space-y-6 pb-8 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl overflow-x-hidden">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Orders</h1>
            <p className="text-gray-500 font-medium mt-1 text-sm">Manage active and completed orders.</p>
          </div>
          <div className="bg-primary/5 px-4 py-3 rounded-2xl flex items-center gap-3">
             <div className="p-2 bg-primary/10 rounded-xl">
               <Package className="h-5 w-5 text-primary" />
             </div>
             <div>
               <p className="text-xs font-medium uppercase tracking-wider text-primary/70">Total Orders</p>
               <p className="text-xl font-semibold text-primary leading-none mt-1">{totalCount}</p>
             </div>
          </div>
        </div>

        {/* Content Area */}
        <div className={cn("transition-opacity duration-300", isFetching ? "opacity-50 pointer-events-none" : "opacity-100")}>
          {orders.length === 0 ? (
            <Card className="py-24 text-center bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
              <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">No orders received yet</h3>
              <p className="text-gray-500 mt-2 max-w-sm mx-auto font-medium text-sm">New orders will appear here.</p>
            </Card>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {orders.map((order) => {
                const statusConf = getStatusConfig(order.status);
                
                return (
                  <Card key={order.id} className="border border-gray-100 shadow-sm overflow-hidden bg-white rounded-2xl group transition-all duration-300 hover:shadow-md">
                    <div className="flex flex-col md:flex-row">
                      {/* Left Pane: Order Info */}
                      <div className="p-5 sm:p-6 md:p-8 flex-1 border-b md:border-b-0 md:border-r border-gray-100">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-mono font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-lg">#{order.order_number}</span>
                            <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ring-1 ring-inset", statusConf.style)}>
                              <span className={cn("h-1.5 w-1.5 rounded-full", statusConf.dot)}></span>
                              {statusConf.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </div>
                        </div>

                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 group-hover:text-primary transition-colors">{order.product?.title || 'Unknown Product'}</h3>

                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 bg-gray-50/50 p-4 sm:p-5 rounded-xl border border-gray-100">
                          <div className="space-y-1">
                            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                              <MapPin className="h-3 w-3" /> Delivery Preference
                            </p>
                            <p className="text-sm font-medium text-gray-800 line-clamp-1">{getDeliveryPreference(order)}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                              <PhoneCall className="h-3 w-3" /> Buyer Contact
                            </p>
                            <p className="text-sm font-medium text-gray-800">
                              {order.buyer?.first_name} {order.buyer?.last_name} &bull; <span className="text-primary">{order.buyer?.phone_number || 'N/A'}</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right Pane: Financials & Actions */}
                      <div className="p-5 sm:p-6 md:p-8 md:w-[320px] bg-gray-50/30 flex flex-col justify-between gap-6 shrink-0">
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                            Earnings
                          </p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg font-medium text-gray-500">KSh</span>
                            <span className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
                              {Number(order.seller_receivable).toLocaleString()}
                            </span>
                          </div>
                          
                          {/* Financial Breakdown */}
                          <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                            <div className="flex justify-between text-xs font-medium text-gray-500">
                              <span>Customer Paid</span>
                              <span>KSh {Number(order.total_amount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs font-medium text-gray-400">
                              <span>Service Fee</span>
                              <span>- KSh {Number(order.commission_amount).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 mt-4">
                          <OrderActions order={order} onUpdate={() => fetchOrders(user.id, currentPage)} />
                          <Link href={`/seller/orders/${order.id}`} className="block">
                            <Button variant="outline" className="w-full font-medium h-10 sm:h-11 rounded-xl bg-white border-gray-200 text-gray-600 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all">
                              View Details <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 sm:px-6 sm:py-4 rounded-2xl shadow-sm mt-6 border border-gray-100 gap-4">
              <p className="text-sm text-gray-500 font-medium">
                Showing <span className="font-semibold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(currentPage * itemsPerPage, totalCount)}</span> of <span className="font-semibold text-gray-900">{totalCount}</span>
              </p>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <Button
                  variant="outline"
                  className="font-medium rounded-xl h-10 px-4 border-gray-200 hover:bg-gray-50"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" /> Prev
                </Button>
                <span className="text-sm font-medium text-gray-900 px-2 sm:hidden">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  className="font-medium rounded-xl h-10 px-4 border-gray-200 hover:bg-gray-50"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </SellerLayout>
  );
}
