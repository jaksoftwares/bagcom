'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  ShieldAlert, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  Zap,
  TrendingUp,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        setStats(data);
      } catch (error) {
        toast({ title: "Failed to load admin stats", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (isLoading) return null; // Handled by Layout loader

  const topStats = [
    { 
      title: 'Gross Merchandise Value', 
      value: `KSh ${stats?.financials?.total_gmv_completed?.toLocaleString() || 0}`, 
      icon: DollarSign, 
      trend: '+14.2%', 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-400/10' 
    },
    { 
      title: 'Platform Commission', 
      value: `KSh ${stats?.financials?.total_commission_earned?.toLocaleString() || 0}`, 
      icon: Zap, 
      trend: '+8.1%', 
      color: 'text-primary', 
      bg: 'bg-primary/10' 
    },
    { 
      title: 'Active Users', 
      value: stats?.counts?.totalUsers || 0, 
      icon: Users, 
      trend: 'Total', 
      color: 'text-blue-400', 
      bg: 'bg-blue-400/10' 
    },
    { 
      title: 'Pending Disputes', 
      value: stats?.counts?.activeDisputes || 0, 
      icon: ShieldAlert, 
      trend: 'Action Required', 
      color: 'text-rose-400', 
      bg: 'bg-rose-400/10' 
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white">Command Center</h1>
            <p className="text-gray-400 font-medium mt-2">Real-time platform governance and financial oversight.</p>
          </div>
          <div className="flex gap-3">
            <Button className="bg-white/5 border border-white/10 hover:bg-white/10 font-bold text-sm h-12 px-6">
              <TrendingUp className="h-4 w-4 mr-2 text-primary" /> Download Report
            </Button>
            <Button className="bg-primary hover:bg-primary/90 font-bold text-sm h-12 px-6 shadow-lg shadow-primary/20">
               Generate Reconciliation
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topStats.map((stat) => (
            <Card key={stat.title} className="bg-[#1E293B] border-white/5 shadow-xl overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="outline" className="border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.trend}</Badge>
                </div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.title}</p>
                <h3 className="text-2xl font-black text-white">{stat.value}</h3>
              </CardContent>
              <div className={`h-1 w-full ${stat.bg.replace('/10', '/30')}`} />
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <Activity className="h-5 w-5 text-primary" /> Live Transaction Feed
              </h2>
              <Button variant="link" className="text-primary font-bold text-sm p-0">Detailed Logs →</Button>
            </div>
            
            <Card className="bg-[#1E293B] border-white/5 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#0F172A]/50 border-b border-white/5">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Order ID</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Product</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Buyer</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-right">Amount</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {stats?.recentActivity?.map((order: any) => (
                      <tr key={order.id} className="hover:bg-white/5 transition-colors cursor-pointer group">
                        <td className="px-6 py-4 text-xs font-mono font-bold text-gray-500 group-hover:text-primary">#{order.order_number.split('-').pop()}</td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-white truncate max-w-[180px]">{order.product?.title}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{new Date(order.created_at).toLocaleTimeString()}</p>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-400">
                          {order.buyer?.first_name} {order.buyer?.last_name}
                        </td>
                        <td className="px-6 py-4 text-sm font-black text-white text-right">
                          KSh {order.total_amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge className="bg-white/5 border border-white/10 text-[10px] h-6 px-3">{order.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* System Health / Sidebar */}
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-white">Platform Health</h2>
            
            <Card className="bg-[#1E293B] border-white/5 p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-400">M-PESA B2C Wallet</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-none">Healthy</Badge>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[82%]" />
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  <span>Balance: KSh 1.2M</span>
                  <span>Quota: 82%</span>
                </div>
              </div>

              <div className="h-px bg-white/5" />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-400">Escrow Reconciled</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-none">Verified</Badge>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[100%]" />
                </div>
              </div>

              <Button className="w-full bg-white/5 border border-white/10 hover:bg-white/10 font-bold text-xs h-11">
                System Audit Logs <ChevronRight className="ml-2 h-3 w-3" />
              </Button>
            </Card>

            <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 p-6 relative overflow-hidden group">
              <div className="relative z-10">
                <ShieldCheck className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-black text-white">Escrow Oversight</h3>
                <p className="text-xs text-gray-400 leading-relaxed mt-2">
                  Currently holding <span className="text-white font-bold">KSh {stats?.financials?.total_currently_in_escrow?.toLocaleString() || 0}</span> in active transactions. No anomalies detected.
                </p>
                <Button variant="link" className="text-primary font-bold text-xs p-0 mt-4">View All Escrow →</Button>
              </div>
              <div className="absolute -bottom-8 -right-8 opacity-10 group-hover:scale-125 transition-transform duration-500">
                <ShieldCheck className="h-32 w-32 text-primary" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
