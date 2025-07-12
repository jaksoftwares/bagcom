'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart,  Package, DollarSign,  Users,Plus, Eye,Edit, Trash2, Upload,  Image as ImageIcon, TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  MessageCircle,
  BarChart3
} from 'lucide-react';
import Header from '@/components/Header';
import { categories } from '@/lib/categories';

export default function SellerDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userRole, setUserRole] = useState<'admin' | 'seller' | 'buyer'>('seller');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const sellerStats = [
    {
      title: 'Total Sales',
      value: 'KSh 145,250',
      icon: DollarSign,
      change: '+12.5%',
      color: 'text-green-600'
    },
    {
      title: 'Active Listings',
      value: '23',
      icon: Package,
      change: '+5',
      color: 'text-blue-600'
    },
    {
      title: 'Total Orders',
      value: '67',
      icon: ShoppingCart,
      change: '+8',
      color: 'text-purple-600'
    },
    {
      title: 'Customers',
      value: '45',
      icon: Users,
      change: '+12',
      color: 'text-orange-600'
    }
  ];

  const products = [
    {
      id: 1,
      name: 'Study Desk with Ergonomic Chair',
      price: 8500,
      commission: 850,
      status: 'active',
      views: 156,
      likes: 12,
      orders: 3,
      image: 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=100',
      category: 'Furniture',
      condition: 'Good'
    },
    {
      id: 2,
      name: 'MacBook Pro 2020 (M1 Chip)',
      price: 85000,
      commission: 8500,
      status: 'active',
      views: 342,
      likes: 25,
      orders: 1,
      image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=100',
      category: 'Electronics',
      condition: 'Very Good'
    },
    {
      id: 3,
      name: 'Gas Cylinder (13kg) with Burner',
      price: 4200,
      commission: 420,
      status: 'sold',
      views: 89,
      likes: 8,
      orders: 1,
      image: 'https://images.pexels.com/photos/3964736/pexels-photo-3964736.jpeg?auto=compress&cs=tinysrgb&w=100',
      category: 'Kitchen',
      condition: 'Excellent'
    }
  ];

  const orders = [
    {
      id: 'ORD-001',
      product: 'Study Desk with Ergonomic Chair',
      buyer: 'John Doe',
      amount: 9350,
      status: 'pending',
      date: '2024-01-15',
      buyerPhone: '+254 700 000 001',
      buyerEmail: 'john.doe@example.com',
      deliveryAddress: 'Nairobi, Westlands'
    },
    {
      id: 'ORD-002',
      product: 'Gas Cylinder (13kg) with Burner',
      buyer: 'Jane Smith',
      amount: 4620,
      status: 'completed',
      date: '2024-01-14',
      buyerPhone: '+254 700 000 002',
      buyerEmail: 'jane.smith@example.com',
      deliveryAddress: 'Kiambu, Ruiru'
    },
    {
      id: 'ORD-003',
      product: 'MacBook Pro 2020 (M1 Chip)',
      buyer: 'Mike Johnson',
      amount: 93500,
      status: 'shipped',
      date: '2024-01-13',
      buyerPhone: '+254 700 000 003',
      buyerEmail: 'mike.johnson@example.com',
      deliveryAddress: 'Machakos, Athi River'
    }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedImages(prev => [...prev, ...files].slice(0, 5)); // Max 5 images
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleProductSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      alert('Product added successfully!');
      setSelectedImages([]);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'shipped': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'shipped': return Package;
      case 'pending': return Clock;
      case 'cancelled': return AlertCircle;
      default: return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userRole={userRole} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Manage your products and track your sales performance.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          {sellerStats.map((stat) => {
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
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="products" className="text-xs sm:text-sm py-2 sm:py-3">My Products</TabsTrigger>
            <TabsTrigger value="orders" className="text-xs sm:text-sm py-2 sm:py-3">Orders</TabsTrigger>
            <TabsTrigger value="add-product" className="text-xs sm:text-sm py-2 sm:py-3">Add Product</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm py-2 sm:py-3">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                  <CardTitle className="text-lg sm:text-xl">My Products ({products.length})</CardTitle>
                  <Button className="w-full sm:w-auto text-sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3 sm:gap-4">
                      <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{product.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{product.category}</Badge>
                            <Badge variant="secondary" className="text-xs">{product.condition}</Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600">KSh {product.price.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6">
                        <div className="flex items-center space-x-4 text-xs sm:text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{product.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{product.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{product.orders}</span>
                          </div>
                        </div>
                        
                        <Badge variant={product.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                          {product.status}
                        </Badge>
                        
                        <div className="flex space-x-1 sm:space-x-2">
                          <Button variant="outline" size="sm" className="p-1.5 sm:p-2">
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="p-1.5 sm:p-2">
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="p-1.5 sm:p-2 text-red-600 hover:text-red-700">
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
                <CardTitle className="text-lg sm:text-xl">Customer Orders ({orders.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {orders.map((order) => {
                    const StatusIcon = getStatusIcon(order.status);
                    return (
                      <div key={order.id} className="p-4 border rounded-lg">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-gray-900">{order.id}</h3>
                              <Badge className={`${getStatusColor(order.status)} text-white text-xs flex items-center gap-1`}>
                                <StatusIcon className="h-3 w-3" />
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{order.product}</p>
                            <p className="font-semibold text-gray-900">KSh {order.amount.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">{order.date}</p>
                          </div>
                          
                          <div className="lg:w-1/3">
                            <h4 className="font-medium text-gray-900 mb-2">Customer Details</h4>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p><strong>Name:</strong> {order.buyer}</p>
                              <p><strong>Phone:</strong> {order.buyerPhone}</p>
                              <p><strong>Email:</strong> {order.buyerEmail}</p>
                              <p><strong>Address:</strong> {order.deliveryAddress}</p>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Contact
                            </Button>
                            {order.status === 'pending' && (
                              <Button size="sm">
                                Mark Shipped
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-product">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Add New Product</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProductSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Product Title *</Label>
                        <Input id="title" placeholder="Enter product title" required />
                      </div>
                      
                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="condition">Condition *</Label>
                        <Select required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="excellent">Excellent</SelectItem>
                            <SelectItem value="very-good">Very Good</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="fair">Fair</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="price">Price (KSh) *</Label>
                          <Input id="price" type="number" placeholder="0" required />
                        </div>
                        <div>
                          <Label htmlFor="original-price">Original Price (KSh)</Label>
                          <Input id="original-price" type="number" placeholder="0" />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="location">Location *</Label>
                        <Input id="location" placeholder="Enter your location" required />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="description">Description *</Label>
                        <Textarea 
                          id="description" 
                          placeholder="Describe your product in detail..."
                          className="min-h-[120px]"
                          required 
                        />
                      </div>
                      
                      <div>
                        <Label>Product Images * (Max 5)</Label>
                        <div className="mt-2">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              id="image-upload"
                            />
                            <label htmlFor="image-upload" className="cursor-pointer">
                              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                              <p className="text-sm text-gray-600">
                                Click to upload images or drag and drop
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                PNG, JPG, GIF up to 10MB each
                              </p>
                            </label>
                          </div>
                          
                          {selectedImages.length > 0 && (
                            <div className="mt-4 grid grid-cols-3 gap-4">
                              {selectedImages.map((file, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-20 object-cover rounded-lg"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="negotiable" className="rounded" />
                    <Label htmlFor="negotiable">Price is negotiable</Label>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isUploading || selectedImages.length === 0}
                  >
                    {isUploading ? (
                      <>
                        <Upload className="h-4 w-4 mr-2 animate-spin" />
                        Uploading Product...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Sales Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 sm:h-56 lg:h-64 flex items-center justify-center text-gray-500 text-sm sm:text-base">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p>Sales analytics chart will be displayed here</p>
                      <p className="text-xs text-gray-400 mt-2">Connect to analytics service</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Conversion Rate</span>
                      <span className="text-sm font-bold text-green-600">12.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Average Order Value</span>
                      <span className="text-sm font-bold">KSh 15,250</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Customer Satisfaction</span>
                      <span className="text-sm font-bold text-green-600">4.8/5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Response Time</span>
                      <span className="text-sm font-bold"> 2 hours</span>
                    </div>
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