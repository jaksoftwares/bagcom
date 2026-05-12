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
        toast({ title: "Failed to load financial records", variant: "destructive" });
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
      <div className="space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
               <span>Admin</span>
               <ChevronRight className="h-3 w-3 opacity-30" />
               <span className="text-primary">Financial Governance</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.1]">
              Escrow <span className="text-primary/80">& Clearing</span>
            </h1>
            <p className="text-base text-slate-400 font-medium max-w-xl leading-relaxed">
              Real-time oversight of platform liquidity and escrow transactions. Execute emergency overrides and reconciliation audits.
            </p>
          </div>
          <div className="flex gap-4">
             <Button variant="outline" className="border-white/5 bg-white/5 hover:bg-white/10 font-bold text-[11px] uppercase tracking-widest h-14 px-8 rounded-2xl transition-all">
                <Download className="h-4 w-4 mr-3 opacity-50" /> Audit Trail
             </Button>
          </div>
        </div>

        {/* Financial High-Level Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-slate-900/40 border-white/5 p-10 relative overflow-hidden group rounded-[2.5rem] shadow-2xl">
            <div className="relative z-10 space-y-4">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                 <Lock className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Active Protection Pool</p>
                 <h3 className="text-3xl font-bold text-white tracking-tight">KSh {stats.activeEscrow.toLocaleString()}</h3>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 opacity-5 group-hover:scale-125 transition-transform duration-700">
               <Lock className="h-28 w-28 text-white" />
            </div>
          </Card>
          
          <Card className="bg-slate-900/40 border-white/5 p-10 relative overflow-hidden group rounded-[2.5rem] shadow-2xl">
            <div className="relative z-10 space-y-4">
              <div className="h-12 w-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                 <TrendingUp className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Platform Net Yield</p>
                 <h3 className="text-3xl font-bold text-white tracking-tight">KSh {stats.platformYield.toLocaleString()}</h3>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 opacity-5 group-hover:scale-125 transition-transform duration-700">
               <TrendingUp className="h-28 w-28 text-white" />
            </div>
          </Card>

          <Card className="bg-slate-900/40 border-white/5 p-10 relative overflow-hidden group rounded-[2.5rem] shadow-2xl">
            <div className="relative z-10 space-y-4">
              <div className="h-12 w-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 border border-amber-500/20">
                 <ArrowRightLeft className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Settlement Queue</p>
                 <h3 className="text-3xl font-bold text-white tracking-tight">{stats.settlementQueue} <span className="text-sm font-medium text-slate-500 ml-2">Transfers</span></h3>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 opacity-5 group-hover:scale-125 transition-transform duration-700">
               <ArrowRightLeft className="h-28 w-28 text-white" />
            </div>
          </Card>
        </div>

        {/* Ledger Section */}
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
               <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Financial Log</p>
               <h2 className="text-2xl font-bold text-white tracking-tight">Escrow Transaction Ledger</h2>
            </div>
            <div className="relative w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search by Order ID..." 
                className="pl-12 bg-white/5 border-white/5 h-12 rounded-xl text-xs font-medium focus-visible:ring-primary/20 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Card className="bg-slate-900/40 border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-950/50 border-b border-white/5">
                  <tr>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Reference</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Value</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Lifecycle State</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Last Resolution</th>
                    <th className="px-8 py-6 text-right text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Override Engine</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {escrowList.length === 0 ? (
                    <tr><td colSpan={5} className="px-8 py-16 text-center text-slate-500 font-bold uppercase tracking-[0.2em] italic">No active escrow transactions detected.</td></tr>
                  ) : (
                    escrowList.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5 transition-all duration-300 group">
                        <td className="px-8 py-6">
                          <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">#{item.order?.order_number || '---'}</p>
                          <p className="text-[10px] font-mono font-bold text-slate-500 uppercase mt-1">REF: {item.id.slice(0, 8)}</p>
                        </td>
                        <td className="px-8 py-6 text-sm font-black text-white">
                          KSh {item.amount.toLocaleString()}
                        </td>
                        <td className="px-8 py-6">
                          {getEscrowBadge(item.escrow_status)}
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                              <History className="h-3.5 w-3.5 opacity-40" />
                              {item.released_at ? new Date(item.released_at).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'Pending Clearance'}
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <div className="flex justify-end gap-3">
                             <Button 
                               onClick={() => handleOverride(item.id, 'FORCE_RELEASE')}
                               variant="ghost" 
                               size="icon" 
                               className="h-10 w-10 text-rose-400 hover:bg-rose-500/10 rounded-xl"
                               title="Force Unlock"
                             >
                               <Unlock className="h-4.5 w-4.5" />
                             </Button>
                             <Button 
                               onClick={() => handleOverride(item.id, 'FREEZE')}
                               variant="ghost" 
                               size="icon" 
                               className="h-10 w-10 text-amber-500 hover:bg-amber-500/10 rounded-xl"
                               title="Freeze Asset"
                             >
                               <AlertTriangle className="h-4.5 w-4.5" />
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
