'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Package, 
  DollarSign, 
  Clock,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { getCurrentUser, getUserProfile } from '@/services/auth/authService';
import SellerLayout from '@/components/layout/SellerLayout';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function SellerDashboardOverview() {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    activeListings: 0,
    totalOrders: 0,
    pendingEscrow: 0,
    availableBalance: 0
  });

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          window.location.href = '/login';
          return;
        }
        setUser(currentUser);
        
        const userProfile = await getUserProfile(currentUser.id);
        setProfile(userProfile);

        // Fetch Stats & Recent Orders via our unified endpoint
        const response = await fetch(`/api/seller/dashboard?userId=${currentUser.id}`);
        const data = await response.json();

        if (response.ok) {
          setStats(data.stats);
          setRecentOrders(data.recentOrders);
        } else {
          // If RPC is missing (e.g., migration not run), show friendly warning
          if (data.error?.includes('function get_seller_dashboard_stats does not exist')) {
            toast({
              title: "Setup Required",
              description: "Please run the database migration to enable stats.",
              variant: "destructive"
            });
          } else {
             throw new Error(data.error);
          }
        }
      } catch (error) {
        console.error('Dashboard Load Error:', error);
        toast({ title: "Failed to load dashboard", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-600 ring-emerald-500/20';
      case 'PAYMENT_SUCCESS': 
      case 'HELD_IN_ESCROW': return 'bg-blue-50 text-blue-600 ring-blue-500/20';
      case 'PENDING_PAYMENT': return 'bg-amber-50 text-amber-600 ring-amber-500/20';
      case 'DISPUTED': return 'bg-red-50 text-red-600 ring-red-500/20';
      case 'DELIVERED': return 'bg-teal-50 text-teal-600 ring-teal-500/20';
      default: return 'bg-gray-50 text-gray-600 ring-gray-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      COMPLETED: 'Completed',
      PAYMENT_SUCCESS: 'Processing',
      HELD_IN_ESCROW: 'Processing',
      PENDING_PAYMENT: 'Pending',
      DISPUTED: 'Disputed',
      DELIVERED: 'Delivered'
    };
    return labels[status] || status;
  };

  if (isLoading) {
    return (
      <SellerLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-gray-500 tracking-wider uppercase animate-pulse">Loading Dashboard</p>
        </div>
      </SellerLayout>
    );
  }

  const sellerStats = [
    { title: 'Earnings', value: `KSh ${Number(stats.totalEarnings).toLocaleString()}`, icon: DollarSign, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-100' },
    { title: 'Pending Funds', value: `KSh ${Number(stats.pendingEscrow).toLocaleString()}`, icon: Clock, iconColor: 'text-amber-600', iconBg: 'bg-amber-100' },
    { title: 'Active Products', value: stats.activeListings.toString(), icon: Package, iconColor: 'text-blue-600', iconBg: 'bg-blue-100' },
    { title: 'Total Orders', value: stats.totalOrders.toString(), icon: ShoppingCart, iconColor: 'text-purple-600', iconBg: 'bg-purple-100' }
  ];

  return (
    <SellerLayout>
      <div className="w-full mx-auto space-y-6 pb-8 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl overflow-x-hidden">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-900 p-6 md:p-8 rounded-2xl shadow-md">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              Welcome, {profile?.first_name || 'Seller'}
            </h1>
            <p className="text-gray-300 mt-1 text-sm">
              Here is your store overview.
            </p>
          </div>
          <Link href="/seller/inventory" className="w-full md:w-auto">
            <Button className="w-full md:w-auto font-medium h-11 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
              <Package className="mr-2 h-4 w-4" />
              Manage Inventory
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {sellerStats.map((stat) => (
            <Card key={stat.title} className="border border-gray-100 shadow-sm rounded-2xl bg-white">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl flex-shrink-0 ${stat.iconBg} ${stat.iconColor} flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.title}</h3>
                  <p className="text-xl md:text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Recent Orders Table */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Link href="/seller/orders" className="text-primary font-medium text-sm hover:underline flex items-center gap-1 group">
                View all <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">Order ID</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">Product</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 text-right">Earned</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 bg-white">
                    {recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-12 text-center text-gray-500 text-sm">
                          No recent orders.
                        </td>
                      </tr>
                    ) : (
                      recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3">
                            <Link href={`/seller/orders/${order.id}`} className="font-mono text-xs font-medium text-gray-600 hover:text-primary block">
                              {order.order_number}
                            </Link>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900 max-w-[150px] sm:max-w-[200px] truncate">{order.product?.title || 'Unknown Product'}</span>
                              <span className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide ${getStatusStyle(order.status)}`}>
                              {getStatusLabel(order.status)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <p className="text-sm font-semibold text-gray-900">KSh {Number(order.seller_receivable || 0).toLocaleString()}</p>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Account Status Section */}
          <div className="space-y-4">
             <h2 className="text-lg font-semibold text-gray-900">Account Status</h2>
             
             {/* Verified Card */}
             <Card className="border border-indigo-100 bg-indigo-50 shadow-sm p-5 rounded-2xl">
               <div className="flex items-center gap-3 mb-2">
                 <CheckCircle className="h-5 w-5 text-indigo-600" />
                 <h3 className="text-sm font-semibold text-indigo-900">Verified Seller</h3>
               </div>
               <p className="text-sm text-indigo-800/80">
                 Your account is verified. M-PESA withdrawals are enabled.
               </p>
             </Card>
             
             {/* Pending Action Card */}
             {stats.pendingEscrow > 0 && (
               <Card className="border border-amber-200 bg-amber-50 shadow-sm p-5 rounded-2xl">
                 <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    <h4 className="text-sm font-semibold text-amber-900">Pending Funds</h4>
                 </div>
                 <p className="text-sm text-amber-800/80 mb-4">
                    KSh {Number(stats.pendingEscrow).toLocaleString()} requires delivery confirmation.
                 </p>
                 <Link href="/seller/orders" className="block">
                   <Button className="w-full h-10 text-sm font-medium bg-amber-500 text-white hover:bg-amber-600 rounded-xl transition-all">
                     View Orders
                   </Button>
                 </Link>
               </Card>
             )}
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
