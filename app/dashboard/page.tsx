'use client';

import { useState } from 'react';
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
  Trash2
} from 'lucide-react';
import Header from '@/components/Header';

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userRole, setUserRole] = useState<'admin' | 'seller' | 'buyer'>('seller');

  const stats = [
    {
      title: 'Total Sales',
      value: 'KSh 45,250',
      icon: DollarSign,
      change: '+12.5%',
      color: 'text-green-600'
    },
    {
      title: 'Active Listings',
      value: '8',
      icon: Package,
      change: '+2',
      color: 'text-blue-600'
    },
    {
      title: 'Orders',
      value: '23',
      icon: ShoppingCart,
      change: '+5',
      color: 'text-purple-600'
    },
    {
      title: 'Customers',
      value: '18',
      icon: Users,
      change: '+3',
      color: 'text-orange-600'
    }
  ];

  const products = [
    {
      id: 1,
      name: 'Study Desk with Chair',
      price: 8500,
      status: 'active',
      views: 45,
      likes: 12,
      orders: 3
    },
    {
      id: 2,
      name: 'Queen Size Bed',
      price: 15000,
      status: 'sold',
      views: 78,
      likes: 25,
      orders: 1
    },
    {
      id: 3,
      name: 'Gas Cylinder (13kg)',
      price: 4200,
      status: 'active',
      views: 32,
      likes: 8,
      orders: 2
    }
  ];

  const orders = [
    {
      id: 'ORD-001',
      product: 'Study Desk with Chair',
      buyer: 'John Doe',
      amount: 9350,
      status: 'pending',
      date: '2024-01-15'
    },
    {
      id: 'ORD-002',
      product: 'Gas Cylinder (13kg)',
      buyer: 'Jane Smith',
      amount: 4620,
      status: 'completed',
      date: '2024-01-14'
    },
    {
      id: 'ORD-003',
      product: 'Queen Size Bed',
      buyer: 'Mike Johnson',
      amount: 16500,
      status: 'shipped',
      date: '2024-01-13'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userRole={userRole} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Welcome back! Here's your seller overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          {stats.map((stat) => {
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
        <Tabs defaultValue="products" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="products" className="text-xs sm:text-sm py-2 sm:py-3">My Products</TabsTrigger>
            <TabsTrigger value="orders" className="text-xs sm:text-sm py-2 sm:py-3">Orders</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm py-2 sm:py-3">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                  <CardTitle className="text-lg sm:text-xl">My Products</CardTitle>
                  <Button className="w-full sm:w-auto text-sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3 sm:gap-4">
                      <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{product.name}</h3>
                          <p className="text-xs sm:text-sm text-gray-600">KSh {product.price.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6">
                        <Badge variant={product.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                          {product.status}
                        </Badge>
                        
                        <div className="text-xs sm:text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{product.views}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-1 sm:space-x-2">
                          <Button variant="outline" size="sm" className="p-1.5 sm:p-2">
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
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

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3 sm:gap-4">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{order.id}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">{order.product}</p>
                        <p className="text-xs sm:text-sm text-gray-600">by {order.buyer}</p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6">
                        <div className="text-left sm:text-right">
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">KSh {order.amount.toLocaleString()}</p>
                          <p className="text-xs sm:text-sm text-gray-600">{order.date}</p>
                        </div>
                        
                        <Badge variant={
                          order.status === 'completed' ? 'default' :
                          order.status === 'pending' ? 'secondary' : 'outline'
                        } className="text-xs">
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Sales Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 sm:h-56 lg:h-64 flex items-center justify-center text-gray-500 text-sm sm:text-base">
                    Sales chart would go here
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Product Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 sm:h-56 lg:h-64 flex items-center justify-center text-gray-500 text-sm sm:text-base">
                    Product performance chart would go here
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