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
  ShieldCheck,
  LayoutDashboard,
  Download,
  Database
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
      bg: 'bg-emerald-400/5' 
    },
    { 
      title: 'Platform Commission', 
      value: `KSh ${stats?.financials?.total_commission_earned?.toLocaleString() || 0}`, 
      icon: Zap, 
      trend: '+8.1%', 
      color: 'text-primary', 
      bg: 'bg-primary/5' 
    },
    { 
      title: 'Active User Base', 
      value: stats?.counts?.totalUsers || 0, 
      icon: Users, 
      trend: 'Verified', 
      color: 'text-sky-400', 
      bg: 'bg-sky-400/5' 
    },
    { 
      title: 'Active Disputes', 
      value: stats?.counts?.activeDisputes || 0, 
      icon: ShieldAlert, 
      trend: 'Actionable', 
      color: 'text-rose-400', 
      bg: 'bg-rose-400/5' 
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-12">
        {/* Breadcrumbs & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
               <span>Admin</span>
               <ChevronRight className="h-3 w-3 opacity-30" />
               <span className="text-primary">Overview</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.1]">
              Command <span className="text-primary/80">Center</span>
            </h1>
            <p className="text-base text-slate-400 font-medium max-w-xl leading-relaxed">
              Real-time platform governance and financial oversight. Monitor transaction health and merchant activity.
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="border-white/5 bg-white/5 hover:bg-white/10 font-bold text-[11px] uppercase tracking-widest h-14 px-8 rounded-2xl transition-all">
              <Download className="h-4 w-4 mr-3 opacity-50" /> Data Export
            </Button>
            <Button className="bg-primary hover:bg-primary/90 font-bold text-[11px] uppercase tracking-widest h-14 px-8 rounded-2xl shadow-xl shadow-primary/20 transition-all">
               Run Reconciliation
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topStats.map((stat) => (
            <Card key={stat.title} className="bg-slate-900/40 border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden group hover:border-primary/20 transition-all duration-500">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className={`h-14 w-14 rounded-2xl border border-white/5 flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="outline" className="border-white/5 bg-white/5 text-[9px] font-black text-slate-400 uppercase tracking-widest px-3 py-1 rounded-full">{stat.trend}</Badge>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{stat.title}</p>
                   <h3 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Recent Activity Feed */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                 <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Transaction Registry</p>
                 <h2 className="text-2xl font-bold text-white tracking-tight">Live Platform Activity</h2>
              </div>
              <Link href="/admin/financials">
                 <Button variant="ghost" className="text-slate-500 hover:text-primary font-bold text-xs gap-2 transition-colors">Full Transaction Log <ArrowRight className="h-3.5 w-3.5" /></Button>
              </Link>
            </div>
            
            <Card className="bg-slate-900/40 border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-950/50 border-b border-white/5">
                    <tr>
                      <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Reference</th>
                      <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Item Details</th>
                      <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Customer</th>
                      <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 text-right">Value</th>
                      <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 text-center">Lifecycle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {stats?.recentActivity?.map((order: any) => (
                      <tr key={order.id} className="hover:bg-white/5 transition-all duration-300 group cursor-pointer">
                        <td className="px-8 py-6 text-[11px] font-mono font-bold text-slate-500 group-hover:text-primary transition-colors">#{order.order_number.split('-').pop()}</td>
                        <td className="px-8 py-6">
                          <p className="text-sm font-bold text-white group-hover:text-primary transition-colors truncate max-w-[200px]">{order.product?.title}</p>
                          <p className="text-[10px] font-medium text-slate-500 mt-1">{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2">
                              <div className="h-7 w-7 bg-slate-800 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-400">
                                 {order.buyer?.first_name?.[0]}
                              </div>
                              <span className="text-xs font-bold text-slate-400">{order.buyer?.first_name} {order.buyer?.last_name}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-sm font-bold text-white text-right">
                          KSh {order.total_amount.toLocaleString()}
                        </td>
                        <td className="px-8 py-6 text-center">
                          <Badge className="bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-tighter px-3 h-6 rounded-lg text-slate-400">{order.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* System Health / Sidebar */}
          <div className="space-y-10">
            <div className="space-y-1">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Operational Health</p>
               <h2 className="text-2xl font-bold text-white tracking-tight">System Status</h2>
            </div>
            
            <Card className="bg-slate-900/40 border-white/5 p-8 space-y-8 rounded-[2.5rem] shadow-2xl">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                     <p className="text-sm font-bold text-white">M-PESA B2C Node</p>
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Payout Liquidity</p>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-none px-3 py-1 font-black text-[9px] uppercase tracking-widest">Active</Badge>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500/80 w-[82%] shadow-[0_0_12px_rgba(16,185,129,0.3)]" />
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                  <span>Balance: KSh 1.2M</span>
                  <span className="text-slate-300">82% Quota</span>
                </div>
              </div>

              <div className="h-px bg-white/5" />

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                     <p className="text-sm font-bold text-white">Escrow Ledger</p>
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Financial Integrity</p>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-none px-3 py-1 font-black text-[9px] uppercase tracking-widest">Verified</Badge>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary/80 w-[100%] shadow-[0_0_12px_rgba(79,70,229,0.3)]" />
                </div>
              </div>

              <Button className="w-full bg-white/5 border border-white/5 hover:bg-white/10 font-bold text-[10px] uppercase tracking-[0.2em] h-14 rounded-2xl transition-all">
                Access Audit Logs <ChevronRight className="ml-3 h-3.5 w-3.5 opacity-40" />
              </Button>
            </Card>

            {/* Escrow Banner */}
            <Card className="bg-gradient-to-br from-primary/30 to-primary/5 border border-primary/20 p-10 rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
              <div className="relative z-10 space-y-6">
                <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-md">
                   <ShieldCheck className="h-7 w-7 text-white" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-2xl font-bold text-white tracking-tight">Escrow Oversight</h3>
                   <p className="text-sm text-white/60 leading-relaxed font-medium">
                     The system is currently protecting <span className="text-white font-black">KSh {stats?.financials?.total_currently_in_escrow?.toLocaleString() || 0}</span> in active trades. 
                   </p>
                </div>
                <Link href="/admin/financials">
                   <Button variant="link" className="text-white font-black text-xs p-0 uppercase tracking-widest group-hover:gap-3 transition-all duration-300">Investigate Escrow <ChevronRight className="h-3.5 w-3.5 ml-2" /></Button>
                </Link>
              </div>
              <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:scale-125 group-hover:opacity-10 transition-all duration-700">
                <ShieldCheck className="h-48 w-48 text-white" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
