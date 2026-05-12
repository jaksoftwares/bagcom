'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  ArrowRightLeft, 
  ShieldCheck, 
  ShieldAlert, 
  ExternalLink, 
  TrendingUp,
  History,
  Lock,
  Unlock,
  AlertTriangle,
  Search,
  ChevronRight,
  Download,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

export default function AdminFinancials() {
  const { toast } = useToast();
  const [escrowList, setEscrowList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [stats, setStats] = useState({
    activeEscrow: 0,
    settlementQueue: 0,
    platformYield: 0
  });

  useEffect(() => {
    async function fetchFinancials() {
      try {
        const res = await fetch('/api/admin/financials'); 
        const data = await res.json();
        setEscrowList(data.transactions || []);
        
        // Calculate dynamic stats
        const active = (data.transactions || []).reduce((sum: number, item: any) => 
          item.escrow_status === 'HELD' ? sum + item.amount : sum, 0);
        const queue = (data.transactions || []).filter((item: any) => 
          item.escrow_status === 'HELD').length;
          
        setStats({
          activeEscrow: active,
          settlementQueue: queue,
          platformYield: active * 0.1
        });

      } catch (error) {
        toast({ title: "Failed to load records", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    fetchFinancials();
  }, []);

  const handleOverride = async (escrowId: string, action: 'FORCE_RELEASE' | 'FREEZE') => {
    const reason = prompt(`Reason for ${action}:`);
    if (!reason) return;

    try {
      const res = await fetch('/api/admin/financials/override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ escrowId, action, reason })
      });
      
      if (res.ok) {
        toast({ title: `${action} successful`, description: "Platform state has been updated." });
        setEscrowList(escrowList.map(item => 
          item.id === escrowId 
            ? { ...item, escrow_status: action === 'FORCE_RELEASE' ? 'RELEASED' : 'FROZEN' } 
            : item
        ));
      } else {
        throw new Error('Override failed');
      }
    } catch (e) {
      toast({ title: "Operation failed", variant: "destructive" });
    }
  };

  const getEscrowBadge = (status: string) => {
    switch (status) {
      case 'HELD': return <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 font-bold text-[9px] uppercase tracking-widest rounded-full">Held in Escrow</Badge>;
      case 'RELEASED': return <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 font-bold text-[9px] uppercase tracking-widest rounded-full">Released</Badge>;
      case 'REFUNDED': return <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 font-bold text-[9px] uppercase tracking-widest rounded-full">Refunded</Badge>;
      case 'FROZEN': return <Badge className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 font-bold text-[9px] uppercase tracking-widest rounded-full">Frozen</Badge>;
      default: return <Badge variant="outline" className="text-slate-500 border-white/5 px-3 py-1 font-bold text-[9px] uppercase tracking-widest rounded-full">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
               <span>Admin</span>
               <ChevronRight className="h-3 w-3 opacity-50" />
               <span className="text-primary">Financials</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Payments
            </h1>
            <p className="text-sm text-slate-500 font-medium max-w-xl leading-relaxed">
              Monitor payments and escrow status.
            </p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="border-slate-200 bg-white hover:bg-slate-50 font-bold text-[11px] uppercase tracking-wider h-11 px-6 rounded-lg transition-all">
                <Download className="h-4 w-4 mr-2 opacity-60" /> History
             </Button>
          </div>
        </div>

        {/* Financial High-Level Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border-slate-200 p-8 relative overflow-hidden group rounded-xl shadow-sm">
            <div className="relative z-10 space-y-4">
              <div className="h-11 w-11 bg-slate-50 rounded-lg flex items-center justify-center text-slate-600 border border-slate-100">
                 <Lock className="h-5 w-5" />
              </div>
               <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Held in Escrow</p>
                  <h3 className="text-3xl font-bold text-slate-900 tracking-tight">KSh {stats.activeEscrow.toLocaleString()}</h3>
               </div>
            </div>
            <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
               <Lock className="h-24 w-24 text-slate-900" />
            </div>
          </Card>
          
          <Card className="bg-white border-slate-200 p-8 relative overflow-hidden group rounded-xl shadow-sm">
            <div className="relative z-10 space-y-4">
              <div className="h-11 w-11 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 border border-emerald-100">
                 <TrendingUp className="h-5 w-5" />
              </div>
               <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Earnings</p>
                  <h3 className="text-3xl font-bold text-slate-900 tracking-tight">KSh {stats.platformYield.toLocaleString()}</h3>
               </div>
            </div>
            <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
               <TrendingUp className="h-24 w-24 text-slate-900" />
            </div>
          </Card>

          <Card className="bg-white border-slate-200 p-8 relative overflow-hidden group rounded-xl shadow-sm">
            <div className="relative z-10 space-y-4">
              <div className="h-11 w-11 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 border border-amber-100">
                 <ArrowRightLeft className="h-5 w-5" />
              </div>
               <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending</p>
                  <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{stats.settlementQueue} <span className="text-sm font-medium text-slate-400 ml-2">Transfers</span></h3>
               </div>
            </div>
            <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
               <ArrowRightLeft className="h-24 w-24 text-slate-900" />
            </div>
          </Card>
        </div>

        {/* Ledger Section */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-0.5">
               <p className="text-[11px] font-bold text-primary uppercase tracking-wider">Transactions</p>
               <h2 className="text-xl font-bold text-slate-900 tracking-tight">Transaction History</h2>
            </div>
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
               <Input 
                 placeholder="Search..." 
                 className="pl-11 bg-white border-slate-200 h-11 rounded-lg text-sm font-medium focus:border-slate-300 shadow-sm transition-all"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
          </div>

          <Card className="bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                   <tr>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Order</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Amount</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Status</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 hidden md:table-cell">Updated</th>
                    <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {escrowList.length === 0 ? (
                     <tr><td colSpan={5} className="px-6 py-16 text-center text-slate-400 font-bold uppercase tracking-wider italic">No transactions found.</td></tr>
                  ) : (
                    escrowList.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-all duration-200 group">
                        <td className="px-6 py-5">
                          <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">#{item.order?.order_number || '---'}</p>
                          <p className="text-[10px] font-mono font-bold text-slate-400 uppercase mt-1 tracking-tighter">REF: {item.id.slice(0, 8)}</p>
                        </td>
                        <td className="px-6 py-5 text-sm font-bold text-slate-900">
                          KSh {item.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-5">
                          {getEscrowBadge(item.escrow_status)}
                        </td>
                        <td className="px-6 py-5 hidden md:table-cell">
                           <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                              <History className="h-3.5 w-3.5 opacity-60" />
                              {item.released_at ? new Date(item.released_at).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'Pending Clearance'}
                           </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                           <div className="flex justify-end gap-2">
                             <Button 
                               onClick={() => handleOverride(item.id, 'FORCE_RELEASE')}
                               variant="ghost" 
                               size="icon" 
                               className="h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                               title="Force Unlock"
                             >
                               <Unlock className="h-4 w-4" />
                             </Button>
                             <Button 
                               onClick={() => handleOverride(item.id, 'FREEZE')}
                               variant="ghost" 
                               size="icon" 
                               className="h-9 w-9 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                               title="Freeze Asset"
                             >
                               <AlertTriangle className="h-4 w-4" />
                             </Button>
                           </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
