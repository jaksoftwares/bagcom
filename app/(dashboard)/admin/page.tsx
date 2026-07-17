'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
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
  ShieldCheck,
  LayoutDashboard,
  Download,
  Database,
  ArrowRight
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
      title: 'Total Sales', 
      value: `KSh ${stats?.financials?.total_gmv_completed?.toLocaleString() || 0}`, 
      icon: DollarSign, 
      trend: '+14.2%', 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-400/5' 
    },
    { 
      title: 'Total Earnings', 
      value: `KSh ${stats?.financials?.total_commission_earned?.toLocaleString() || 0}`, 
      icon: Zap, 
      trend: '+8.1%', 
      color: 'text-primary', 
      bg: 'bg-primary/5' 
    },
    { 
      title: 'Active Users', 
      value: stats?.counts?.totalUsers || 0, 
      icon: Users, 
      trend: 'Verified', 
      color: 'text-sky-400', 
      bg: 'bg-sky-400/5' 
    },
    { 
      title: 'New Sellers', 
      value: stats?.counts?.pendingSellerCount || 0, 
      icon: ShieldCheck, 
      trend: 'Reviewing', 
      color: 'text-amber-400', 
      bg: 'bg-amber-400/5',
      href: '/admin/verifications'
    },
    { 
      title: 'Open Disputes', 
      value: stats?.counts?.activeDisputes || 0, 
      icon: ShieldAlert, 
      trend: 'Action Required', 
      color: 'text-rose-400', 
      bg: 'bg-rose-400/5' 
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Breadcrumbs & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
               <span>Admin</span>
               <ChevronRight className="h-3 w-3 opacity-50" />
               <span className="text-primary">Overview</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Dashboard
            </h1>
            <p className="text-sm text-slate-500 font-medium max-w-xl leading-relaxed">
              Overview of sales and activity.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/logs">
              <Button variant="outline" className="border-slate-200 bg-white hover:bg-slate-50 font-bold text-[11px] uppercase tracking-wider h-11 px-6 rounded-lg transition-all">
                <Download className="h-4 w-4 mr-2 opacity-60" /> Export
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topStats.map((stat) => {
            const CardWrapper = stat.href ? Link : 'div';
            return (
              <CardWrapper key={stat.title} href={stat.href || ''} className={stat.href ? 'block' : ''}>
                <Card className="bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden group hover:border-slate-300 transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`h-12 w-12 rounded-lg border border-slate-100 flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-105 transition-transform duration-300 shadow-sm`}>
                        <stat.icon className="h-5.5 w-5.5" />
                      </div>
                      <Badge variant="outline" className="border-slate-100 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wide px-2.5 py-0.5 rounded-full">{stat.trend}</Badge>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stat.title}</p>
                       <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
                    </div>
                  </CardContent>
                </Card>
              </CardWrapper>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                 <p className="text-[11px] font-bold text-primary uppercase tracking-wider">Recent Activity</p>
                 <h2 className="text-xl font-bold text-slate-900 tracking-tight">Recent Sales</h2>
              </div>
              <Link href="/admin/financials">
                 <Button variant="ghost" className="text-slate-500 hover:text-slate-900 font-bold text-xs gap-2 transition-colors">View All <ArrowRight className="h-3.5 w-3.5" /></Button>
              </Link>
            </div>
            
            <Card className="bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 hidden sm:table-cell">Order</th>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Product</th>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 hidden lg:table-cell">Buyer</th>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 text-right">Amount</th>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {stats?.recentActivity?.map((order: any) => (
                      <tr key={order.id} className="hover:bg-slate-50 transition-all duration-200 group cursor-pointer">
                        <td className="px-6 py-5 text-xs font-mono font-bold text-slate-400 group-hover:text-slate-900 transition-colors hidden sm:table-cell">#{order.order_number.split('-').pop()}</td>
                        <td className="px-6 py-5">
                          <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors truncate max-w-[150px] sm:max-w-[200px]">{order.product?.title}</p>
                          <p className="text-[11px] font-medium text-slate-400 mt-0.5">{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </td>
                        <td className="px-6 py-5 hidden lg:table-cell">
                           <div className="flex items-center gap-2">
                              <div className="h-7 w-7 bg-slate-100 rounded-md flex items-center justify-center text-[10px] font-bold text-slate-500">
                                 {order.buyer?.first_name?.[0]}
                              </div>
                              <span className="text-xs font-bold text-slate-600">{order.buyer?.first_name} {order.buyer?.last_name}</span>
                           </div>
                        </td>
                        <td className="px-6 py-5 text-sm font-bold text-slate-900 text-right">
                          KSh {order.total_amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <Badge className="bg-slate-100 text-slate-600 border-none text-[9px] font-bold uppercase tracking-wide px-2 h-5 rounded-md">{order.status}</Badge>
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
            <div className="space-y-1">
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</p>
               <h2 className="text-xl font-bold text-slate-900 tracking-tight">Status</h2>
            </div>
            
            <Card className="bg-white border-slate-200 p-6 space-y-6 rounded-xl shadow-sm">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                     <p className="text-sm font-bold text-slate-900">M-Pesa Payouts</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                       {stats?.mpesa?.lastUpdated ? `Last Sync: ${new Date(stats.mpesa.lastUpdated).toLocaleTimeString()}` : 'Payout Balance'}
                     </p>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-600 border-none px-2.5 py-0.5 font-bold text-[9px] uppercase tracking-wide">Active</Badge>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  {/* Daily Quota Visualization (based on 500k limit) */}
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-500" 
                    style={{ width: `${Math.min((stats?.mpesa?.spentToday || 0) / 500000 * 100, 100)}%` }}
                  /> 
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <span>Balance: KSh {stats?.mpesa?.balance?.toLocaleString() || 0}</span>
                  <span className="text-slate-600">Usage: {Math.round((stats?.mpesa?.spentToday || 0) / 500000 * 100)}%</span>
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                     <p className="text-sm font-bold text-slate-900">Escrow Ledger</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status Check</p>
                  </div>
                  <Badge className={stats?.system?.escrowBalanced ? "bg-emerald-50 text-emerald-600 border-none px-2.5 py-0.5 font-bold text-[9px] uppercase tracking-wide" : "bg-rose-50 text-rose-600 border-none px-2.5 py-0.5 font-bold text-[9px] uppercase tracking-wide"}>
                    {stats?.system?.escrowBalanced ? 'Verified' : 'Unbalanced'}
                  </Badge>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${stats?.system?.escrowBalanced ? 'bg-slate-900' : 'bg-rose-500'} w-[100%]`} />
                </div>
              </div>

              <Button 
                onClick={async () => {
                  toast({ title: "Syncing with M-Pesa...", description: "Request sent to Safaricom." });
                  try {
                    const res = await fetch('/api/admin/mpesa/balance', { method: 'POST' });
                    if (res.ok) {
                      toast({ title: "Refresh Started", description: "Balance will update in a few seconds." });
                    }
                  } catch (e) {
                    toast({ title: "Sync Failed", variant: "destructive" });
                  }
                }}
                className="w-full bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-900 font-bold text-[11px] uppercase tracking-wider h-11 rounded-lg transition-all"
              >
                Sync M-Pesa <Activity className="ml-2 h-3.5 w-3.5 opacity-60" />
              </Button>
            </Card>

            {/* Platform Announcement Tool */}
            <Card className="bg-white border-slate-200 p-6 space-y-5 rounded-xl shadow-sm">
                <div className="space-y-1">
                   <p className="text-[11px] font-bold text-primary uppercase tracking-wider">Broadcast</p>
                   <h2 className="text-lg font-bold text-slate-900 tracking-tight">Send Message</h2>
                </div>
               
               <div className="space-y-3">
                  <input 
                    id="broadcast-title"
                    placeholder="Title" 
                    className="w-full bg-slate-50 border border-slate-200 h-10 px-4 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-slate-300 outline-none transition-all"
                  />
                  <textarea 
                    id="broadcast-body"
                    placeholder="Message..." 
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-slate-300 outline-none transition-all resize-none"
                  />
                    <Button 
                    onClick={async () => {
                      const title = (document.getElementById('broadcast-title') as HTMLInputElement).value;
                      const body = (document.getElementById('broadcast-body') as HTMLTextAreaElement).value;
                      if (!title || !body) return;
                      
                      try {
                        const res = await fetch('/api/admin/notifications', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ broadcast: true, title, body })
                        });
                        if (res.ok) {
                          toast({ title: "Broadcast Sent", description: "Message is live." });
                          (document.getElementById('broadcast-title') as HTMLInputElement).value = '';
                          (document.getElementById('broadcast-body') as HTMLTextAreaElement).value = '';
                        }
                      } catch (e) {
                        toast({ title: "Error", description: "Failed to send.", variant: "destructive" });
                      }
                    }}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] uppercase tracking-wider h-11 rounded-lg transition-all"
                  >
                     Send Broadcast
                  </Button>
               </div>
            </Card>

            {/* Escrow Banner */}
            <Card className="bg-slate-900 border border-slate-800 p-8 rounded-xl relative overflow-hidden group shadow-lg">
              <div className="relative z-10 space-y-4">
                <div className="h-12 w-12 bg-white/10 rounded-lg flex items-center justify-center border border-white/10">
                   <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white tracking-tight">Escrow</h3>
                   <p className="text-sm text-slate-400 leading-relaxed font-medium">
                     Total Escrow: <span className="text-white font-bold">KSh {stats?.financials?.total_currently_in_escrow?.toLocaleString() || 0}</span> 
                   </p>
                </div>
                <Link href="/admin/financials">
                   <Button variant="link" className="text-white font-bold text-xs p-0 uppercase tracking-wider group-hover:underline transition-all">
                     View Details <ChevronRight className="h-3.5 w-3.5 ml-1" />
                   </Button>
                </Link>
              </div>
              <div className="absolute -bottom-6 -right-6 opacity-10 group-hover:scale-110 transition-all duration-500">
                <ShieldCheck className="h-32 w-32 text-white" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
