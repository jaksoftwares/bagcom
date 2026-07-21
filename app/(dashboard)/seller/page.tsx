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
  ArrowRight,
  TrendingUp,
  Activity
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
    { title: 'Total Earnings', value: `KSh ${Number(stats.totalEarnings).toLocaleString()}`, icon: DollarSign, trend: 'Lifetime', gradient: 'from-emerald-500/10 via-emerald-400/5 to-transparent', iconColor: 'text-emerald-500', iconBg: 'bg-emerald-50' },
    { title: 'Pending Funds', value: `KSh ${Number(stats.pendingEscrow).toLocaleString()}`, icon: Clock, trend: 'Awaiting Delivery', gradient: 'from-amber-500/10 via-amber-400/5 to-transparent', iconColor: 'text-amber-500', iconBg: 'bg-amber-50' },
    { title: 'Active Products', value: stats.activeListings.toString(), icon: Package, trend: 'Active', gradient: 'from-blue-500/10 via-blue-400/5 to-transparent', iconColor: 'text-blue-500', iconBg: 'bg-blue-50' },
    { title: 'Total Orders', value: stats.totalOrders.toString(), icon: ShoppingCart, trend: 'Lifetime', gradient: 'from-purple-500/10 via-purple-400/5 to-transparent', iconColor: 'text-purple-500', iconBg: 'bg-purple-50' }
  ];

  return (
    <SellerLayout>
      <div className="max-w-[1600px] w-full mx-auto space-y-6 pb-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <Badge className="bg-primary/20 text-primary-foreground hover:bg-primary/20 mb-3 border-none backdrop-blur-md px-3 py-1 text-xs">
              Dashboard Overview
            </Badge>
            <h1 className="text-3xl font-semibold text-white tracking-tight">
              Welcome back, {profile?.first_name || 'Seller'}
            </h1>
            <p className="text-gray-400 font-medium mt-2 max-w-xl text-sm leading-relaxed">
              Here is what's happening with your store.
            </p>
          </div>
          <div className="flex gap-3 relative z-10 w-full md:w-auto">
             <Link href="/seller/inventory" className="w-full md:w-auto">
               <Button className="w-full md:w-auto font-medium shadow-sm h-12 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
                 <Package className="mr-2 h-5 w-5" />
                 Manage Inventory
               </Button>
             </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sellerStats.map((stat) => (
            <Card key={stat.title} className="border-none shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300 rounded-3xl relative bg-white">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-50`}></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className={`h-12 w-12 rounded-2xl ${stat.iconBg} ${stat.iconColor} flex items-center justify-center transition-transform duration-300`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="outline" className="bg-white/50 backdrop-blur-sm border-gray-100 text-[10px] font-medium uppercase tracking-wider text-gray-500 shadow-sm">
                    {stat.trend}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.title}</h3>
                  <p className="text-2xl font-semibold text-gray-900 tracking-tight">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Orders Table */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Activity className="h-5 w-5 text-gray-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              </div>
              <Link href="/seller/orders" className="text-primary font-medium text-sm hover:underline flex items-center gap-1 group">
                View all orders <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <Card className="border-gray-200/60 shadow-sm overflow-hidden rounded-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/80 border-b border-gray-100 backdrop-blur-sm">
                    <tr>
                      <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">Order ID</th>
                      <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">Product</th>
                      <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                      <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500 text-right">Earned</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 bg-white">
                    {recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-20 text-center">
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center">
                              <ShoppingCart className="h-8 w-8 text-gray-300" />
                            </div>
                            <p className="text-gray-500 font-medium">No transactions yet.</p>
                            <p className="text-xs text-gray-400 max-w-xs mx-auto">When customers place orders, they will appear here.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group cursor-default">
                          <td className="px-6 py-4">
                            <Link href={`/seller/orders/${order.id}`} className="font-mono text-xs font-medium text-gray-500 hover:text-primary transition-colors block">
                              {order.order_number}
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900 truncate max-w-[180px]">{order.product?.title || 'Unknown Product'}</span>
                              <span className="text-xs font-medium text-gray-400">{new Date(order.created_at).toLocaleDateString()}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ring-1 ring-inset ${getStatusStyle(order.status)}`}>
                              {getStatusLabel(order.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
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

          {/* Verification & Action Required */}
          <div className="space-y-6">
             <div className="flex items-center gap-3">
                 <div className="p-2 bg-indigo-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-indigo-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Account Status</h2>
             </div>
             
             {/* Verified Card */}
             <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-6 space-y-4 rounded-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 transition-transform duration-500 group-hover:scale-105">
                 <CheckCircle className="h-24 w-24" />
               </div>
               <div className="relative z-10 space-y-3">
                 <div>
                   <h3 className="text-xl font-semibold mt-1 tracking-tight">Verified Seller</h3>
                 </div>
                 <div className="h-px w-full bg-indigo-500/50"></div>
                 <p className="text-sm text-indigo-100/90 leading-relaxed font-medium">
                   Your account is verified. You can now withdraw funds to M-PESA.
                 </p>
               </div>
             </Card>
             
             {/* Pending Action Card */}
             {stats.pendingEscrow > 0 && (
               <Card className="p-6 border border-amber-200 bg-amber-50 shadow-sm space-y-4 rounded-2xl">
                 <div className="flex items-center gap-2 text-amber-800">
                    <div className="p-1.5 bg-amber-100 rounded-full">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider">Action Required</h4>
                 </div>
                 <p className="text-sm text-amber-900/80 leading-relaxed font-medium">
                    You have <span className="font-semibold text-amber-900">KSh {Number(stats.pendingEscrow).toLocaleString()}</span> in pending funds. Complete your deliveries to unlock these funds.
                 </p>
                 <Link href="/seller/orders" className="block pt-2">
                   <Button className="w-full h-10 font-medium bg-amber-500 text-white hover:bg-amber-600 shadow-sm rounded-lg transition-all">
                     View Pending Orders
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
