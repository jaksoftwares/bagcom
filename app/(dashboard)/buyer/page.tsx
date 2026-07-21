'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart, 
  Package, 
  DollarSign, 
  Plus,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Heart,
  MessageCircle,
  Loader2,
  ChevronRight
} from 'lucide-react';
import Header from '@/components/navigation/Header';
import Link from 'next/link';
import { getCurrentUser, getUserProfile } from '@/services/auth/authService';
import { useToast } from '@/hooks/use-toast';

export default function BuyerDashboard() {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          window.location.href = '/login';
          return;
        }
        setUser(currentUser);

        const [userProfile, ordersData, favoritesData] = await Promise.all([
          getUserProfile(currentUser.id).catch(() => null),
          fetch(`/api/orders?userId=${currentUser.id}&role=buyer`).then(res => res.json()),
          fetch(`/api/favorites?userId=${currentUser.id}`).then(res => res.json())
        ]);

        setProfile(userProfile);
        setOrders(ordersData.orders || []);
        setFavorites(favoritesData.favorites || []);
      } catch (error) {
        console.error('Error loading dashboard:', error);
        toast({ title: "Failed to load dashboard", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardData();
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

  const stats = [
    {
      title: 'Total Orders',
      value: orders.length.toString(),
      icon: ShoppingCart,
      color: 'text-blue-600'
    },
    {
      title: 'Saved Items',
      value: favorites.length.toString(),
      icon: Heart,
      color: 'text-red-600'
    },
    {
      title: 'Active Orders',
      value: orders.filter(o => !['COMPLETED', 'FAILED', 'REFUNDED'].includes(o.status)).length.toString(),
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      title: 'Total Spent',
      value: `KSh ${orders.filter(o => o.status === 'COMPLETED').reduce((sum, o) => sum + o.total_amount, 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto space-y-4 sm:space-y-6 pb-8 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
        <div className="mb-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Overview</h1>
          <p className="text-gray-500 font-medium mt-1 text-sm">Welcome back, {profile?.first_name || 'there'}. Here's a summary of your activity.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="border border-gray-100 shadow-sm overflow-hidden bg-white rounded-2xl transition-all duration-300 hover:shadow-md">
                <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{stat.title}</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight mt-1">{stat.value}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-xl flex-shrink-0 bg-gray-50 flex items-center justify-center ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="flex w-full sm:w-auto overflow-x-auto bg-gray-50/50 p-1.5 rounded-xl shadow-sm border border-gray-100 max-w-fit scrollbar-hide">
            <TabsTrigger value="orders" className="rounded-lg py-2 px-6 font-medium text-sm data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">My Orders</TabsTrigger>
            <TabsTrigger value="wishlist" className="rounded-lg py-2 px-6 font-medium text-sm data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Wishlist</TabsTrigger>
            <TabsTrigger value="profile" className="rounded-lg py-2 px-6 font-medium text-sm data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white overflow-hidden">
              <CardHeader className="p-5 sm:p-6 border-b border-gray-50 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">Recent Orders</CardTitle>
                <Link href="/buyer/orders">
                  <Button variant="outline" size="sm" className="rounded-lg font-medium text-gray-600">View All</Button>
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                {orders.length === 0 ? (
                  <div className="text-center py-16">
                    <Package className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-500">No orders yet.</p>
                    <Link href="/products">
                      <Button className="mt-4 rounded-xl shadow-sm">Start Shopping</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {orders.slice(0, 5).map((order) => {
                      const StatusIcon = getStatusIcon(order.status);
                      return (
                        <div key={order.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 sm:p-6 hover:bg-gray-50/50 transition-colors gap-4">
                          <div className="flex items-center space-x-4">
                            <div className="h-14 w-14 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center shrink-0">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-[300px]">{order.product?.title}</h3>
                              <p className="text-xs font-medium text-gray-500 mt-0.5">Order #{order.order_number}</p>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-row items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-6 mt-2 sm:mt-0 pt-4 sm:pt-0 border-t border-gray-100 sm:border-0">
                            <div className="text-left sm:text-right">
                              <p className="font-bold text-gray-900">KSh {order.total_amount.toLocaleString()}</p>
                              <Badge className={`${getStatusColor(order.status)} text-white mt-1.5 shadow-sm border-none text-[10px] uppercase tracking-wider px-2 py-0.5 font-bold`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {order.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <Link href={`/buyer/orders/${order.id}`}>
                              <Button variant="outline" size="sm" className="rounded-lg bg-white border-gray-200">
                                <Eye className="h-4 w-4 sm:mr-2" />
                                <span className="hidden sm:inline">Details</span>
                              </Button>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wishlist">
            <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white overflow-hidden">
              <CardHeader className="p-5 sm:p-6 border-b border-gray-50 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">My Wishlist</CardTitle>
                <Link href="/wishlist">
                  <Button variant="outline" size="sm" className="rounded-lg font-medium text-gray-600">Manage</Button>
                </Link>
              </CardHeader>
              <CardContent className="p-5 sm:p-6">
                {favorites.length === 0 ? (
                  <div className="text-center py-16">
                    <Heart className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-500">Your wishlist is empty.</p>
                    <Link href="/products">
                      <Button className="mt-4 rounded-xl shadow-sm">Browse Items</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.slice(0, 6).map((fav) => (
                      <div key={fav.id} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-2xl bg-gray-50/50 hover:bg-white transition-colors hover:shadow-sm">
                        <div className="h-16 w-16 bg-white border border-gray-100 rounded-xl overflow-hidden shrink-0">
                          {fav.product?.images?.[0]?.image_url ? (
                            <img src={fav.product.images[0].image_url} alt={fav.product.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Heart className="h-6 w-6 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-gray-900 truncate">{fav.product?.title}</h3>
                          <p className="text-sm font-bold text-gray-900 mt-0.5">KSh {fav.product?.price.toLocaleString()}</p>
                        </div>
                        <Button size="sm" asChild className="rounded-lg shadow-sm">
                          <Link href={`/checkout?productId=${fav.product?.id}`}>Buy</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white overflow-hidden">
                <CardHeader className="p-5 sm:p-6 border-b border-gray-50">
                  <CardTitle className="text-lg font-semibold text-gray-900">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="p-5 sm:p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">First Name</p>
                      <p className="text-gray-900 font-semibold">{profile?.first_name || 'N/A'}</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Last Name</p>
                      <p className="text-gray-900 font-semibold">{profile?.last_name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                    <p className="text-gray-900 font-semibold">{user?.email}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phone Number</p>
                    <p className="text-gray-900 font-semibold">{profile?.phone_number || 'Not provided'}</p>
                  </div>
                  <Button variant="outline" className="w-full rounded-xl border-gray-200 text-gray-600 hover:text-primary">Edit Profile</Button>
                </CardContent>
              </Card>

              <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white overflow-hidden">
                <CardHeader className="p-5 sm:p-6 border-b border-gray-50">
                  <CardTitle className="text-lg font-semibold text-gray-900">Security & Preferences</CardTitle>
                </CardHeader>
                <CardContent className="p-5 sm:p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Password</p>
                      <p className="text-xs font-medium text-gray-500 mt-0.5">Last changed 3 months ago</p>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-lg border-gray-200">Update</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Email Notifications</p>
                      <p className="text-xs font-medium text-gray-500 mt-0.5">Receive order updates</p>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-none px-2 shadow-sm">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Buyer Status</p>
                      <p className="text-xs font-medium text-gray-500 mt-0.5">Standard Account</p>
                    </div>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-none px-2 shadow-sm">Verified</Badge>
                  </div>
                  <Button variant="destructive" className="w-full rounded-xl mt-4">Delete Account</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
  );
}
