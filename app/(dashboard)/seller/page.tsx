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
  TrendingUp,
  Loader2,
  CheckCircle,
  AlertCircle
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

  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    activeListings: 0,
    totalOrders: 0,
    pendingEscrow: 0
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

        // Fetch Orders
        const ordersRes = await fetch(`/api/orders?userId=${currentUser.id}&role=seller`);
        const ordersData = await ordersRes.json();
        const liveOrders = ordersData.orders || [];

        // Fetch Products to count active listings
        const productsRes = await fetch(`/api/products?sellerId=${currentUser.id}&sellerView=true`);
        const productsData = await productsRes.json();
        const liveProducts = productsData.products || [];

        setOrders(liveOrders);

        // Calculate Stats
        const completedOrders = liveOrders.filter((o: any) => o.status === 'COMPLETED');
        const totalEarnings = completedOrders.reduce((sum: number, o: any) => sum + Number(o.seller_receivable || 0), 0);
        
        const escrowOrders = liveOrders.filter((o: any) => ['PAYMENT_SUCCESS', 'HELD_IN_ESCROW', 'DELIVERED'].includes(o.status));
        const pendingEscrow = escrowOrders.reduce((sum: number, o: any) => sum + Number(o.seller_receivable || 0), 0);

        setStats({
          totalEarnings,
          activeListings: liveProducts.filter((p: any) => p.is_available).length,
          totalOrders: liveOrders.length,
          pendingEscrow
        });

      } catch (error) {
        console.error('Dashboard Load Error:', error);
        toast({ title: "Failed to load dashboard", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-500 text-white';
      case 'PAYMENT_SUCCESS': 
      case 'HELD_IN_ESCROW': return 'bg-blue-500 text-white';
      case 'PENDING_PAYMENT': return 'bg-yellow-500 text-white';
      case 'DISPUTED': return 'bg-red-500 text-white';
      case 'DELIVERED': return 'bg-emerald-400 text-white';
      default: return 'bg-gray-100 text-gray-500';
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

  const sellerStats = [
    { title: 'Total Earnings', value: `KSh ${stats.totalEarnings.toLocaleString()}`, icon: DollarSign, trend: 'Lifetime', color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Pending Escrow', value: `KSh ${stats.pendingEscrow.toLocaleString()}`, icon: Clock, trend: 'Action Required', color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Live Products', value: stats.activeListings.toString(), icon: Package, trend: 'Active', color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Total Orders', value: stats.totalOrders.toString(), icon: ShoppingCart, trend: 'Lifetime', color: 'text-purple-600', bg: 'bg-purple-50' }
  ];

  return (
    <SellerLayout>
      <div className="space-y-10">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Performance Overview</h1>
            <p className="text-gray-500 font-medium">Track your sales, pending escrow, and active orders.</p>
          </div>
          <div className="flex gap-3">
             <Link href="/seller/inventory">
               <Button className="font-bold shadow-md">
                 Manage Inventory
               </Button>
             </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {sellerStats.map((stat) => (
            <Card key={stat.title} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{stat.trend}</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-tight">{stat.title}</h3>
                  <p className="text-2xl font-black text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`h-1 w-full ${stat.bg.replace('50', '200')}`} />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Orders Table */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
              <Link href="/seller/orders" className="text-primary font-bold text-sm">
                View all orders &rarr;
              </Link>
            </div>
            <Card className="border-gray-200/60 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Order Ref</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Product</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Earned</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.length === 0 ? (
                      <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-medium italic">No transactions yet.</td></tr>
                    ) : (
                      orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-6 py-4 font-mono text-xs font-bold text-gray-400">
                            <Link href={`/seller/orders/${order.id}`} className="hover:text-primary transition-colors">
                              {order.order_number}
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-bold text-gray-900 truncate max-w-[150px]">{order.product?.title || 'Unknown Product'}</p>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={`${getStatusColor(order.status)} text-[10px] h-5 px-2 border-none`}>
                              {order.status.replace(/_/g, ' ')}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p className="text-sm font-black text-primary">KSh {Number(order.seller_receivable || 0).toLocaleString()}</p>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Verification Status */}
          <div className="space-y-6">
             <h2 className="text-lg font-bold text-gray-900">Store Status</h2>
             <Card className="border-none shadow-sm bg-indigo-600 text-white p-6 space-y-4">
               <div className="flex justify-between items-start">
                 <div>
                   <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Store Tier</p>
                   <h3 className="text-2xl font-black mt-1">Verified Seller</h3>
                 </div>
                 <div className="bg-white/20 p-2 rounded-lg">
                   <CheckCircle className="h-5 w-5 text-white" />
                 </div>
               </div>
               <p className="text-xs text-indigo-100/80 leading-relaxed pt-2">
                 Your KYC is verified and you are eligible to receive M-PESA payouts immediately after escrow release.
               </p>
             </Card>
             
             {stats.pendingEscrow > 0 && (
               <Card className="p-6 border-amber-200 bg-amber-50 shadow-sm space-y-3">
                 <div className="flex items-center gap-3 text-amber-800">
                    <AlertCircle className="h-5 w-5" />
                    <h4 className="text-sm font-bold">Action Required</h4>
                 </div>
                 <p className="text-xs text-amber-700 leading-relaxed font-medium">
                    You have <span className="font-bold">KSh {stats.pendingEscrow.toLocaleString()}</span> held in escrow. Please deliver the pending orders and enter the buyer's Verification Code to release the funds.
                 </p>
                 <Link href="/seller/orders" className="block pt-2">
                   <Button size="sm" variant="outline" className="w-full font-bold border-amber-300 text-amber-800 hover:bg-amber-100">
                     Go to Pending Orders
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
