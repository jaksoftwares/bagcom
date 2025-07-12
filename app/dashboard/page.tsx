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
  Users, 
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
  MessageCircle
} from 'lucide-react';
import Header from '@/components/Header';
import Link from 'next/link';

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userRole, setUserRole] = useState<'admin' | 'seller' | 'buyer'>('buyer');

  // Redirect based on user role
  useEffect(() => {
    if (userRole === 'seller') {
      window.location.href = '/seller-dashboard';
    }
  }, [userRole]);

  const buyerStats = [
    {
      title: 'Total Orders',
      value: '12',
      icon: ShoppingCart,
      change: '+2 this month',
      color: 'text-blue-600'
    },
    {
      title: 'Wishlist Items',
      value: '8',
      icon: Heart,
      change: '+3 new',
      color: 'text-red-600'
    },
    {
      title: 'Total Spent',
      value: 'KSh 45,250',
      icon: DollarSign,
      change: '+KSh 8,500',
      color: 'text-green-600'
    },
    {
      title: 'Saved Amount',
      value: 'KSh 12,800',
      icon: TrendingUp,
      change: 'From deals',
      color: 'text-purple-600'
    }
  ];

  const recentOrders = [
    {
      id: 'ORD-001',
      product: 'Study Desk with Ergonomic Chair',
      seller: 'John Kiprotich',
      amount: 9350,
      status: 'delivered',
      date: '2024-01-15',
      image: 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 'ORD-002',
      product: 'MacBook Pro 2020 (M1 Chip)',
      seller: 'David Mwangi',
      amount: 93500,
      status: 'shipped',
      date: '2024-01-14',
      image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 'ORD-003',
      product: 'Gas Cylinder (13kg) with Burner',
      seller: 'Mary Wanjiku',
      amount: 4620,
      status: 'processing',
      date: '2024-01-13',
      image: 'https://images.pexels.com/photos/3964736/pexels-photo-3964736.jpeg?auto=compress&cs=tinysrgb&w=100'
    }
  ];

  const wishlistItems = [
    {
      id: 1,
      title: 'Queen Size Bed with Mattress',
      price: 16500,
      seller: 'Grace Akinyi',
      image: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=100',
      availability: 'Available'
    },
    {
      id: 2,
      title: 'Samsung Microwave Oven (23L)',
      price: 7480,
      seller: 'Sarah Muthoni',
      image: 'https://images.pexels.com/photos/4252137/pexels-photo-4252137.jpeg?auto=compress&cs=tinysrgb&w=100',
      availability: 'Available'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500';
      case 'shipped': return 'bg-blue-500';
      case 'processing': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return CheckCircle;
      case 'shipped': return Package;
      case 'processing': return Clock;
      case 'cancelled': return AlertCircle;
      default: return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userRole={userRole} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Welcome back! Here's your shopping overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          {buyerStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className={`text-xs sm:text-sm ${stat.color} mt-1`}>{stat.change}</p>
                    </div>
                    <Icon className={`h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="orders" className="text-xs sm:text-sm py-2 sm:py-3">My Orders</TabsTrigger>
            <TabsTrigger value="wishlist" className="text-xs sm:text-sm py-2 sm:py-3">Wishlist</TabsTrigger>
            <TabsTrigger value="profile" className="text-xs sm:text-sm py-2 sm:py-3">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                  <CardTitle className="text-lg sm:text-xl">Recent Orders</CardTitle>
                  <Link href="/orders">
                    <Button variant="outline" className="w-full sm:w-auto text-sm">
                      View All Orders
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {recentOrders.map((order) => {
                    const StatusIcon = getStatusIcon(order.status);
                    return (
                      <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3 sm:gap-4">
                        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                          <img 
                            src={order.image} 
                            alt={order.product}
                            className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{order.product}</h3>
                            <p className="text-xs sm:text-sm text-gray-600">by {order.seller}</p>
                            <p className="text-xs sm:text-sm text-gray-600">{order.date}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6">
                          <div className="text-left sm:text-right">
                            <p className="font-semibold text-gray-900 text-sm sm:text-base">KSh {order.amount.toLocaleString()}</p>
                          </div>
                          
                          <Badge className={`${getStatusColor(order.status)} text-white text-xs flex items-center gap-1`}>
                            <StatusIcon className="h-3 w-3" />
                            {order.status}
                          </Badge>
                          
                          <div className="flex space-x-1 sm:space-x-2">
                            <Button variant="outline" size="sm" className="p-1.5 sm:p-2">
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="p-1.5 sm:p-2">
                              <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wishlist">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                  <CardTitle className="text-lg sm:text-xl">My Wishlist</CardTitle>
                  <Link href="/wishlist">
                    <Button variant="outline" className="w-full sm:w-auto text-sm">
                      View Full Wishlist
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3 sm:gap-4">
                      <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{item.title}</h3>
                          <p className="text-xs sm:text-sm text-gray-600">by {item.seller}</p>
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">KSh {item.price.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <Badge variant={item.availability === 'Available' ? 'default' : 'secondary'} className="text-xs">
                          {item.availability}
                        </Badge>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" className="text-xs">
                            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            Add to Cart
                          </Button>
                          <Button variant="outline" size="sm" className="p-1.5 sm:p-2">
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                      <p className="text-gray-900">John Doe</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">john.doe@example.com</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-gray-900">+254 700 000 000</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Location</label>
                      <p className="text-gray-900">Nairobi, Kenya</p>
                    </div>
                    <Button className="w-full">Edit Profile</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Account Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Email Notifications</span>
                      <Badge variant="outline">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">SMS Notifications</span>
                      <Badge variant="outline">Disabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Two-Factor Auth</span>
                      <Badge variant="outline">Disabled</Badge>
                    </div>
                    <Button variant="outline" className="w-full">Manage Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}