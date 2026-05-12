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
  Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

export default function AdminFinancials() {
  const { toast } = useToast();
  const [escrowList, setEscrowList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchEscrow() {
      try {
        const res = await fetch('/api/admin/financials'); // I'll create this next
        const data = await res.json();
        setEscrowList(data.transactions || []);
      } catch (error) {
        toast({ title: "Failed to load financial records", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    fetchEscrow();
  }, []);

  const forceRelease = async (id: string) => {
    if (!confirm('EMERGENCY OVERRIDE: This will release funds to the seller without a verification code. Proceed?')) return;
    // Implementation would call a high-privilege API
    toast({ title: "Emergency Release Triggered" });
  };

  const getEscrowBadge = (status: string) => {
    switch (status) {
      case 'HELD': return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Held in Escrow</Badge>;
      case 'RELEASED': return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Released</Badge>;
      case 'REFUNDED': return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Refunded</Badge>;
      case 'FROZEN': return <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20">Frozen</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white">Financial Governance</h1>
            <p className="text-gray-400 font-medium mt-2">Monitor escrow flow and execute emergency transaction overrides.</p>
          </div>
          <div className="flex gap-3">
             <Button className="bg-emerald-500 hover:bg-emerald-600 font-bold text-sm h-12 px-6">
                Audit Trail Export
             </Button>
          </div>
        </div>

        {/* Financial Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-[#1E293B] border-white/5 p-8 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Active Escrow</p>
              <h3 className="text-3xl font-black text-white">KSh {escrowList.reduce((sum, item) => item.escrow_status === 'HELD' ? sum + item.amount : sum, 0).toLocaleString()}</h3>
            </div>
            <Lock className="absolute -bottom-4 -right-4 h-24 w-24 text-white/5 group-hover:text-primary/10 transition-colors" />
          </Card>
          <Card className="bg-[#1E293B] border-white/5 p-8 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Platform Revenue (30d)</p>
              <h3 className="text-3xl font-black text-primary">KSh 42,500</h3>
            </div>
            <TrendingUp className="absolute -bottom-4 -right-4 h-24 w-24 text-white/5 group-hover:text-primary/10 transition-colors" />
          </Card>
          <Card className="bg-[#1E293B] border-white/5 p-8 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Pending Payouts</p>
              <h3 className="text-3xl font-black text-amber-500">12</h3>
            </div>
            <ArrowRightLeft className="absolute -bottom-4 -right-4 h-24 w-24 text-white/5 group-hover:text-primary/10 transition-colors" />
          </Card>
        </div>

        {/* Escrow Monitoring Table */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <History className="h-5 w-5 text-primary" /> Active Escrow Ledger
            </h2>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search by order ID..." 
                className="pl-10 bg-white/5 border-white/5 h-10 rounded-xl text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Card className="bg-[#1E293B] border-white/5 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#0F172A]/50 border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Order Ref</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Last Action</th>
                    <th className="px-6 py-4 text-right">Emergency Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {escrowList.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium italic">No active escrow transactions.</td></tr>
                  ) : (
                    escrowList.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-white">#{item.order?.order_number || '---'}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-tighter">ID: {item.id.slice(0, 8)}</p>
                        </td>
                        <td className="px-6 py-4 text-sm font-black text-white">
                          KSh {item.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          {getEscrowBadge(item.escrow_status)}
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-gray-500">
                           {item.released_at ? new Date(item.released_at).toLocaleString() : 'Pending'}
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex justify-end gap-2">
                             <Button 
                               onClick={() => forceRelease(item.id)}
                               variant="ghost" 
                               size="icon" 
                               className="h-9 w-9 text-rose-500 hover:bg-rose-500/10"
                               title="Force Release"
                             >
                               <Unlock className="h-4 w-4" />
                             </Button>
                             <Button 
                               variant="ghost" 
                               size="icon" 
                               className="h-9 w-9 text-amber-500 hover:bg-amber-500/10"
                               title="Freeze Funds"
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
