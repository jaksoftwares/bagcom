'use client';

import { useState, useEffect } from 'react';
import BuyerLayout from '@/components/layout/BuyerLayout';
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
    <BuyerLayout>
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Buyer Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {profile?.first_name || 'Buyer'}! Track your orders and manage your account.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="orders" className="py-3">My Orders</TabsTrigger>
            <TabsTrigger value="wishlist" className="py-3">Wishlist</TabsTrigger>
            <TabsTrigger value="profile" className="py-3">Account Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Orders</CardTitle>
                <Link href="/buyer/orders">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">You haven't placed any orders yet.</p>
                    <Link href="/products">
                      <Button className="mt-4">Start Shopping</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => {
                      const StatusIcon = getStatusIcon(order.status);
                      return (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{order.product?.title}</h3>
                              <p className="text-sm text-gray-500">Order #{order.order_number}</p>
                              <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-6">
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">KSh {order.total_amount.toLocaleString()}</p>
                              <Badge className={`${getStatusColor(order.status)} text-white mt-1`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {order.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <Link href={`/order/${order.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Details
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>My Wishlist</CardTitle>
                <Link href="/wishlist">
                  <Button variant="outline" size="sm">Manage Wishlist</Button>
                </Link>
              </CardHeader>
              <CardContent>
                {favorites.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Your wishlist is empty.</p>
                    <Link href="/products">
                      <Button className="mt-4">Browse Items</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {favorites.slice(0, 4).map((fav) => (
                      <div key={fav.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden">
                          {fav.product?.images?.[0]?.image_url ? (
                            <img src={fav.product.images[0].image_url} alt={fav.product.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Heart className="h-6 w-6 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{fav.product?.title}</h3>
                          <p className="text-sm font-bold text-primary">KSh {fav.product?.price.toLocaleString()}</p>
                          <Link href={`/product/${fav.product?.slug}`}>
                            <Button variant="link" size="sm" className="p-0 h-auto text-xs">View Item</Button>
                          </Link>
                        </div>
                        <Button size="sm" asChild>
                          <Link href={`/checkout?productId=${fav.product?.id}`}>Buy Now</Link>
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
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500 uppercase">First Name</p>
                      <p className="text-gray-900 font-semibold">{profile?.first_name || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500 uppercase">Last Name</p>
                      <p className="text-gray-900 font-semibold">{profile?.last_name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-500 uppercase">Email Address</p>
                    <p className="text-gray-900 font-semibold">{user?.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-500 uppercase">Phone Number</p>
                    <p className="text-gray-900 font-semibold">{profile?.phone_number || 'Not provided'}</p>
                  </div>
                  <Button variant="outline" className="w-full">Edit Profile</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security & Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">Password</p>
                      <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                    </div>
                    <Button variant="outline" size="sm">Update</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive order updates via email</p>
                    </div>
                    <Badge>Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">Buyer Status</p>
                      <p className="text-sm text-gray-500">Standard Buyer Account</p>
                    </div>
                    <Badge variant="secondary">Verified</Badge>
                  </div>
                  <Button variant="destructive" className="w-full">Delete Account</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </BuyerLayout>
  );
}
