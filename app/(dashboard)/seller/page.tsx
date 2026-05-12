'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Upload, 
  Image as ImageIcon, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  MessageCircle,
  BarChart3,
  Loader2,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  CreditCard,
  Wallet,
  MapPin,
  ShieldCheck
} from 'lucide-react';

import { categories } from '@/lib/mock-data/categories';
import { getCurrentUser, getUserProfile } from '@/services/auth/authService';
import SellerLayout from '@/components/layout/SellerLayout';
import { useToast } from '@/hooks/use-toast';
import { OrderActions } from '@/components/dashboard/seller/OrderActions';
import { SellerAnalytics } from '@/components/dashboard/seller/SellerAnalytics';
import Link from 'next/link';

export default function SellerDashboard() {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Live Data State
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    activeListings: 0,
    totalOrders: 0,
    pendingVerification: 0,
    availableBalance: 0
  });
  const [detailedStats, setDetailedStats] = useState<any>(null);
  const [payouts, setPayouts] = useState<any[]>([]);


  // Form State
  const [newProduct, setNewProduct] = useState({
    title: '',
    category_id: '',
    condition: 'GOOD',
    price: '',
    description: '',
    location: ''
  });
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

        // Fetch Products, Orders, and Stats in parallel
        const [productsRes, ordersRes, statsRes, payoutsRes] = await Promise.all([
          fetch(`/api/products?sellerId=${currentUser.id}&sellerView=true`),
          fetch(`/api/orders?userId=${currentUser.id}&role=seller`),
          fetch(`/api/seller/stats?sellerId=${currentUser.id}`),
          fetch(`/api/payouts?sellerId=${currentUser.id}`) // I will create this API next
        ]);

        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();
        const statsData = await statsRes.json();
        const payoutsData = await payoutsRes.json();

        const liveProducts = productsData.products || [];
        const liveOrders = ordersData.orders || [];

        setProducts(liveProducts);
        setOrders(liveOrders);
        setDetailedStats(statsData);
        
        const livePayouts = payoutsData.payouts || [];
        setPayouts(livePayouts);

        // Calculate Stats
        const completedOrders = liveOrders.filter((o: any) => o.status === 'COMPLETED');
        const totalEarnings = completedOrders.reduce((sum: number, o: any) => sum + o.seller_receivable, 0);
        const totalWithdrawn = livePayouts.reduce((sum: number, p: any) => sum + p.amount, 0);
        const availableBalance = totalEarnings - totalWithdrawn;

        const pending = liveOrders.filter((o: any) => o.status === 'PAYMENT_SUCCESS' || o.status === 'DELIVERED').length;

        setStats({
          totalSales: totalEarnings,
          activeListings: liveProducts.filter((p: any) => p.status === 'ACTIVE').length,
          totalOrders: liveOrders.length,
          pendingVerification: pending,
          availableBalance
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

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          seller_id: user.id,
          images: selectedImages
        })
      });

      const data = await res.json();
      if (data.success) {
        toast({ title: "Product published!", description: "Your item is now live in the marketplace." });
        setProducts([data.product, ...products]);
        setActiveTab('products');
        setNewProduct({ title: '', category_id: '', condition: 'GOOD', price: '', description: '', location: '' });
        setSelectedImages([]);
      } else {
        throw new Error(data.error || "Failed to add product");
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
        toast({ title: "Product deleted" });
      }
    } catch (error) {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  const getStatusColor = (status: string) => {

    switch (status) {
      case 'COMPLETED': return 'bg-green-500';
      case 'PAYMENT_SUCCESS': return 'bg-blue-500';
      case 'PENDING_PAYMENT': return 'bg-yellow-500';
      case 'DISPUTED': return 'bg-red-500';
      case 'DELIVERED': return 'bg-green-400';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const sellerStats = [
    { title: 'Total Earnings', value: `KSh ${stats.totalSales.toLocaleString()}`, icon: DollarSign, trend: '+12%', color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Live Products', value: stats.activeListings.toString(), icon: Package, trend: 'Active', color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Total Orders', value: stats.totalOrders.toString(), icon: ShoppingCart, trend: 'Lifetime', color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Pending Payouts', value: stats.pendingVerification.toString(), icon: Clock, trend: 'Action Required', color: 'text-amber-600', bg: 'bg-amber-50' }
  ];

  return (
    <SellerLayout>
      <div className="space-y-10">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Seller Hub</h1>
            <p className="text-gray-500 font-medium">Welcome back, {profile?.first_name || 'Seller'}. Here's what's happening today.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="font-bold border-gray-200 shadow-sm">
              <BarChart3 className="h-4 w-4 mr-2" /> View Reports
            </Button>
            <Button onClick={() => setActiveTab('add-product')} className="font-bold shadow-md">
              <Plus className="h-4 w-4 mr-2" /> Add Listing
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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

        {/* Tabs System */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-transparent border-b border-gray-200 w-full justify-start rounded-none h-auto p-0 gap-8">
            <TabsTrigger value="overview" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 py-3 font-bold text-sm">Dashboard Overview</TabsTrigger>
            <TabsTrigger value="products" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 py-3 font-bold text-sm">Inventory Management</TabsTrigger>
            <TabsTrigger value="orders" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 py-3 font-bold text-sm">Active Orders</TabsTrigger>
            <TabsTrigger value="payouts" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 py-3 font-bold text-sm">Payout History</TabsTrigger>
            <TabsTrigger value="analytics" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 py-3 font-bold text-sm">Analytics</TabsTrigger>
            <TabsTrigger value="add-product" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 py-3 font-bold text-sm">Create Listing</TabsTrigger>
          </TabsList>


          {/* OVERVIEW CONTENT */}
          <TabsContent value="overview" className="space-y-8 outline-none">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Recent Orders Table */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
                  <Button variant="link" onClick={() => setActiveTab('orders')} className="text-primary font-bold text-sm p-0">View all orders →</Button>
                </div>
                <Card className="border-gray-200/60 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Order ID</th>
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Product</th>
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Buyer</th>
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {orders.length === 0 ? (
                          <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium italic">No transactions yet.</td></tr>
                        ) : (
                          orders.slice(0, 5).map((order) => (
                            <Link href={`/seller/orders/${order.id}`} key={order.id} className="contents">
                              <tr className="hover:bg-gray-50/50 transition-colors cursor-pointer group">
                                <td className="px-6 py-4 font-mono text-xs font-bold text-gray-400 group-hover:text-primary">#{order.order_number.split('-').pop()}</td>
                                <td className="px-6 py-4">
                                  <p className="text-sm font-bold text-gray-900 truncate max-w-[150px]">{order.product?.title}</p>
                                </td>
                                <td className="px-6 py-4">
                                  <p className="text-sm font-medium text-gray-600">{order.buyer?.first_name} {order.buyer?.last_name}</p>
                                </td>
                                <td className="px-6 py-4">
                                  <Badge className={`${getStatusColor(order.status)} text-[10px] h-5 px-2`}>{order.status.replace('_', ' ')}</Badge>
                                </td>
                                <td className="px-6 py-4">
                                  <p className="text-sm font-black text-gray-900">KSh {order.seller_receivable.toLocaleString()}</p>
                                </td>
                              </tr>
                            </Link>
                          ))

                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>

              {/* Top Products / Sidebar */}
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-gray-900">Performance Summary</h2>
                <Card className="border-none shadow-sm bg-primary text-white p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-primary-foreground/70 text-xs font-bold uppercase tracking-widest">Available Balance</p>
                      <h3 className="text-3xl font-black mt-1">KSh {stats.totalSales.toLocaleString()}</h3>
                    </div>
                    <div className="bg-white/20 p-2 rounded-lg"><TrendingUp className="h-5 w-5" /></div>
                  </div>
                  <div className="pt-4 flex gap-3">
                    <Button variant="secondary" className="w-full font-bold text-primary">Withdraw Funds</Button>
                  </div>
                </Card>
                
                <Card className="p-6 border-gray-200/60 shadow-sm">
                  <h4 className="text-sm font-bold text-gray-900 mb-4">Verification Status</h4>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">KYC Verified</p>
                      <p className="text-xs text-gray-500">Your account is in good standing.</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* PRODUCTS CONTENT */}
          <TabsContent value="products" className="space-y-6 outline-none">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Your Inventory</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-9 px-3 border-gray-200">
                  <Filter className="h-4 w-4 mr-2" /> Filter
                </Button>
                <Button onClick={() => setActiveTab('add-product')} size="sm" className="h-9 px-3">
                  <Plus className="h-4 w-4 mr-2" /> Add New
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.length === 0 ? (
                <div className="col-span-full py-20 text-center">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No products listed yet.</p>
                </div>
              ) : (
                products.map((product) => (
                  <Card key={product.id} className="border-gray-200/60 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="relative aspect-video bg-gray-100">
                        {product.images?.[0] ? (
                          <img src={product.images[0].image_url} alt={product.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold uppercase text-xs">No Image</div>
                        )}
                        <Badge className="absolute top-3 right-3 bg-white/90 text-gray-900 border-none">{product.condition}</Badge>
                      </div>
                      <div className="p-5 space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{product.title}</h3>
                            <p className="text-lg font-black text-primary">KSh {product.price.toLocaleString()}</p>
                          </div>
                          <Badge variant="outline" className={product.status === 'ACTIVE' ? 'border-green-200 text-green-700 bg-green-50' : 'border-gray-200 text-gray-500 bg-gray-50'}>
                            {product.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                          <div className="flex gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {product.view_count || 0}</span>
                            <span className="flex items-center gap-1"><Star className="h-3 w-3" /> 0</span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-primary">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>


          {/* PAYOUTS CONTENT */}
          <TabsContent value="payouts" className="space-y-6 outline-none">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-indigo-600 text-white p-8 md:col-span-1 shadow-xl shadow-indigo-100 flex flex-col justify-between">
                <div>
                  <Wallet className="h-10 w-10 mb-6 text-indigo-300" />
                  <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-100/70">Available for Payout</h4>
                  <p className="text-4xl font-black mt-2">KSh {stats.availableBalance.toLocaleString()}</p>
                  
                  <div className="mt-8 space-y-4">
                    <div className="p-4 bg-white/10 rounded-xl">
                      <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-1">Total Earned</p>
                      <p className="text-lg font-black">KSh {stats.totalSales.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <Button 
                    className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-black h-12 rounded-xl"
                    disabled={stats.availableBalance <= 0}
                    onClick={async () => {
                      if (stats.availableBalance <= 0) return;
                      setIsSubmitting(true);
                      try {
                        const res = await fetch('/api/payouts', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ sellerId: user.id, amount: stats.availableBalance })
                        });
                        if (res.ok) {
                          toast({ title: "Payout request sent", description: "Your funds will be sent to your M-PESA shortly." });
                          // Refresh data
                          window.location.reload();
                        }
                      } catch (e) {
                        toast({ title: "Request failed", variant: "destructive" });
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                  >
                    {isSubmitting ? "Processing..." : "Request Full Payout"}
                  </Button>
                  <p className="text-[10px] text-center text-indigo-200 mt-4 font-bold uppercase tracking-widest">Sent to {profile?.phone_number}</p>
                </div>
              </Card>

              <div className="md:col-span-2 space-y-6">
                <h3 className="text-lg font-bold text-gray-900">Recent Payouts</h3>
                <Card className="border-gray-200/60 shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Reference</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {payouts.length === 0 ? (
                        <tr><td colSpan={4} className="px-6 py-10 text-center text-gray-400 italic">No payouts processed yet.</td></tr>
                      ) : (
                        payouts.map((p) => (
                          <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-xs font-medium text-gray-500">{new Date(p.created_at).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-xs font-mono font-bold text-gray-900">{p.mpesa_payout_id || '---'}</td>
                            <td className="px-6 py-4"><Badge className={p.status === 'COMPLETED' ? 'bg-green-500' : 'bg-blue-500'}>{p.status}</Badge></td>
                            <td className="px-6 py-4 text-sm font-black text-gray-900 text-right">KSh {p.amount.toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ANALYTICS CONTENT */}
          <TabsContent value="analytics" className="space-y-6 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 border-none shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <Eye className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Total Views</span>
                </div>
                <p className="text-2xl font-black text-gray-900">{detailedStats?.performance?.total_product_views || 0}</p>
              </Card>
              <Card className="p-6 border-none shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Completed Sales</span>
                </div>
                <p className="text-2xl font-black text-gray-900">{detailedStats?.performance?.total_completed_sales || 0}</p>
              </Card>
              <Card className="p-6 border-none shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-amber-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Pending Escrow</span>
                </div>
                <p className="text-2xl font-black text-gray-900">KSh {(detailedStats?.performance?.pending_revenue_in_escrow || 0).toLocaleString()}</p>
              </Card>
              <Card className="p-6 border-none shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-green-600">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Total Revenue</span>
                </div>
                <p className="text-2xl font-black text-gray-900">KSh {(detailedStats?.performance?.total_revenue_earned || 0).toLocaleString()}</p>
              </Card>
            </div>

            <SellerAnalytics stats={detailedStats} />
          </TabsContent>


          {/* ORDERS CONTENT */}
          <TabsContent value="orders" className="space-y-6 outline-none">
            {orders.length === 0 ? (
              <Card className="py-20 text-center">
                <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900">No orders received yet</h3>
                <p className="text-gray-500 max-w-sm mx-auto mt-2">When buyers purchase your items, their orders will appear here for processing.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="border-gray-200/60 shadow-sm overflow-hidden hover:border-primary/20 transition-colors">
                    <div className="flex flex-col md:flex-row">
                      <Link href={`/seller/orders/${order.id}`} className="p-6 md:w-2/3 border-b md:border-b-0 md:border-r border-gray-50 space-y-6 group">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge className={`${getStatusColor(order.status)} text-white`}>{order.status.replace('_', ' ')}</Badge>
                              <span className="text-xs font-mono text-gray-400 font-bold">#{order.order_number}</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mt-2 group-hover:text-primary transition-colors">{order.product?.title}</h3>
                            <p className="text-sm font-medium text-gray-500">Ordered by <span className="text-gray-900 font-bold">{order.buyer?.first_name} {order.buyer?.last_name}</span> on {new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Earnings</p>
                            <p className="text-2xl font-black text-primary">KSh {order.seller_receivable.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-gray-50">
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><MapPin className="h-3 w-3" /> Delivery Location</p>
                            <p className="text-sm font-bold text-gray-700">Student Center, Gate A</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Users className="h-3 w-3" /> Buyer Phone</p>
                            <p className="text-sm font-bold text-gray-700">{order.buyer?.phone_number || 'N/A'}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Package className="h-3 w-3" /> Escrow Status</p>
                            <p className="text-sm font-bold text-amber-600">HELD_IN_ESCROW</p>
                          </div>
                        </div>
                      </Link>

                      
                      <div className="p-6 md:w-1/3 bg-gray-50/50 flex flex-col justify-center gap-4">
                        <OrderActions 
                          order={order} 
                          onUpdate={() => {
                            // Refresh orders list
                            fetch(`/api/orders?userId=${user.id}&role=seller`)
                              .then(res => res.json())
                              .then(data => setOrders(data.orders || []));
                          }} 
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ADD PRODUCT CONTENT */}
          <TabsContent value="add-product" className="outline-none">
            <Card className="max-w-4xl mx-auto border-gray-200/60 shadow-lg">
              <CardHeader className="p-8 border-b border-gray-50">
                <CardTitle className="text-2xl font-black tracking-tight">Create New Listing</CardTitle>
                <p className="text-gray-500 font-medium">Your item will be visible to buyers across the Bagcom marketplace immediately after publishing.</p>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleProductSubmit} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Basic Info */}
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Product Title *</Label>
                        <Input 
                          placeholder="e.g. Ergonomic Study Desk" 
                          required 
                          className="h-12 border-gray-200 focus:ring-primary/20"
                          value={newProduct.title}
                          onChange={e => setNewProduct({...newProduct, title: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Category *</Label>
                        <Select onValueChange={v => setNewProduct({...newProduct, category_id: v})} required>
                          <SelectTrigger className="h-12 border-gray-200">
                            <SelectValue placeholder="Choose a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Condition *</Label>
                          <Select defaultValue="GOOD" onValueChange={v => setNewProduct({...newProduct, condition: v})} required>
                            <SelectTrigger className="h-12 border-gray-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="NEW">New</SelectItem>
                              <SelectItem value="LIKE_NEW">Like New</SelectItem>
                              <SelectItem value="GOOD">Good</SelectItem>
                              <SelectItem value="FAIR">Fair</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Price (KSh) *</Label>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            required 
                            className="h-12 border-gray-200"
                            value={newProduct.price}
                            onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Location *</Label>
                        <Input 
                          placeholder="e.g. Main Campus / Nairobi" 
                          required 
                          className="h-12 border-gray-200"
                          value={newProduct.location}
                          onChange={e => setNewProduct({...newProduct, location: e.target.value})}
                        />
                      </div>
                    </div>

                    {/* Media & Desc */}
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Description *</Label>
                        <Textarea 
                          placeholder="Tell buyers about features, any defects, or special details..."
                          className="min-h-[150px] border-gray-200 focus:ring-primary/20 resize-none p-4"
                          required 
                          value={newProduct.description}
                          onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Product Images</Label>
                        <div className="grid grid-cols-2 gap-4">
                          {[1, 2].map((i) => (
                            <div key={i} className="aspect-square rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 transition-colors group">
                              <Input 
                                placeholder="Paste Image URL" 
                                className="h-full w-full opacity-0 absolute cursor-pointer"
                                onChange={e => {
                                  const url = e.target.value;
                                  if (url) setSelectedImages([...selectedImages, url]);
                                }}
                              />
                              <ImageIcon className="h-6 w-6 text-gray-300 group-hover:text-primary transition-colors" />
                              <span className="text-[10px] font-bold text-gray-400 group-hover:text-primary tracking-widest uppercase">Add Image</span>
                            </div>
                          ))}
                        </div>
                        {selectedImages.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {selectedImages.map((url, i) => (
                              <div key={i} className="h-12 w-12 rounded-lg border overflow-hidden relative group">
                                <img src={url} className="w-full h-full object-cover" />
                                <button onClick={() => setSelectedImages(selectedImages.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">×</button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-primary/5 rounded-2xl border border-primary/10">
                    <div className="flex gap-3 items-center">
                      <ShieldCheck className="h-6 w-6 text-primary" />
                      <div>
                        <p className="text-sm font-bold text-gray-900 leading-tight">Escrow Verified Listing</p>
                        <p className="text-xs text-gray-500 font-medium">Your listing is automatically protected by our safe-payment system.</p>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="px-10 h-14 text-base font-bold shadow-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Publishing...</> : "Publish Product Now"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SellerLayout>
  );
}
