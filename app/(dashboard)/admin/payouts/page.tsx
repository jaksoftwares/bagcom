'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  RefreshCw, 
  Smartphone,
  User,
  History,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

export default function AdminPayouts() {
  const { toast } = useToast();
  const [payouts, setPayouts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPayouts();
  }, []);

  async function fetchPayouts() {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/payouts');
      const data = await res.json();
      setPayouts(data.payouts || []);
      setStats(data.stats);
    } catch (e) {
      toast({ title: "Failed to load payouts", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  const handleExecutePayout = async (payoutId: string) => {
    if (!confirm('Execute M-Pesa B2C payout to seller?')) return;
    
    setIsProcessing(payoutId);
    try {
      const res = await fetch('/api/admin/payouts/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payoutId })
      });
      const data = await res.json();
      
      if (res.ok) {
        toast({ title: "Payout Executed", description: "Request sent to Safaricom." });
        fetchPayouts();
      } else {
        throw new Error(data.error || 'Execution failed');
      }
    } catch (e: any) {
      toast({ title: "Payout failed", description: e.message, variant: "destructive" });
    } finally {
      setIsProcessing(null);
    }
  };

  const filteredPayouts = payouts.filter(p => 
    p.seller?.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.payout_phone_number?.includes(searchQuery) ||
    p.order?.order_number?.includes(searchQuery)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
      case 'COMPLETED':
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-3 py-1 font-bold text-[9px] uppercase tracking-widest rounded-full">Settled</Badge>;
      case 'PENDING':
        return <Badge className="bg-amber-500/10 text-amber-500 border-none px-3 py-1 font-bold text-[9px] uppercase tracking-widest rounded-full">Pending</Badge>;
      case 'PROCESSING':
        return <Badge className="bg-blue-500/10 text-blue-500 border-none px-3 py-1 font-bold text-[9px] uppercase tracking-widest rounded-full animate-pulse">Processing</Badge>;
      case 'FAILED':
        return <Badge className="bg-rose-500/10 text-rose-500 border-none px-3 py-1 font-bold text-[9px] uppercase tracking-widest rounded-full">Failed</Badge>;
      default:
        return <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Header Section */}
        <div className="flex justify-between items-end gap-8 pb-4">
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-widest text-foreground uppercase">
              Payouts
            </h1>
          </div>
          <div className="flex gap-4">
             <Button 
               onClick={fetchPayouts}
               variant="outline" 
               className="h-10 px-6 border-slate-200 font-bold text-[10px] uppercase tracking-widest rounded-none shadow-none"
             >
                {isLoading ? 'Refreshing...' : 'Refresh Queue'}
             </Button>
          </div>
        </div>

        {/* Stats Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="p-6 bg-white border border-slate-200 rounded-none flex flex-col justify-between h-32">
              <div>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Payouts</p>
                 <p className="text-2xl font-bold text-slate-900 tracking-tight">{stats?.pending || 0}</p>
              </div>
           </div>
           <div className="p-6 bg-white border border-slate-200 rounded-none flex flex-col justify-between h-32">
              <div>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Completed</p>
                 <p className="text-2xl font-bold text-slate-900 tracking-tight">{stats?.completed || 0}</p>
              </div>
           </div>
           <div className="p-6 bg-white border border-slate-200 rounded-none flex flex-col justify-between h-32">
              <div>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Disbursed</p>
                 <p className="text-2xl font-bold text-slate-900 tracking-tight">KSh {stats?.totalValue?.toLocaleString() || 0}</p>
              </div>
           </div>
           <div className="p-6 bg-slate-900 border border-slate-900 rounded-none flex flex-col justify-between h-32 text-white">
              <div>
                 <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">Gateway</p>
                 <p className="text-2xl font-bold text-white tracking-tight italic">M-PESA B2C</p>
              </div>
           </div>
        </div>

        {/* Search & List */}
        <div className="space-y-6">
           <div className="flex justify-between items-center gap-6 border-b border-slate-200">
              <div className="pb-4">
                 <p className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em]">Payout Queue</p>
              </div>

              <div className="relative w-full md:w-72 pb-4">
                 <Input 
                   placeholder="SEARCH MERCHANTS..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="border-none bg-transparent pl-0 pr-0 h-10 text-[10px] font-bold uppercase tracking-widest focus-visible:ring-0 placeholder:text-slate-300 shadow-none"
                 />
              </div>
           </div>

           {isLoading ? (
             <div className="py-24 flex flex-col items-center gap-4">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Auditing...</p>
             </div>
           ) : (
             <div className="space-y-4">
               {filteredPayouts.map((p) => (
                 <div key={p.id} className="bg-white border border-slate-200 rounded-none p-6 transition-colors hover:bg-slate-50">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                       {/* Merchant Info */}
                       <div className="w-64 shrink-0">
                          <p className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">{p.seller?.business_name || `${p.seller?.first_name} ${p.seller?.last_name}`}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{p.payout_phone_number}</p>
                       </div>

                       {/* Payout Details */}
                       <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8">
                          <div>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Order</p>
                             <p className="text-[11px] font-bold text-slate-900 tracking-tight">#{p.order?.order_number || 'N/A'}</p>
                          </div>
                          <div>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Settlement</p>
                             <p className="text-sm font-bold text-slate-900 tracking-tight">KSh {p.amount?.toLocaleString()}</p>
                          </div>
                          <div>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                             {getStatusBadge(p.status)}
                          </div>
                       </div>

                       {/* Actions */}
                       <div className="flex items-center gap-4 shrink-0">
                          {p.status === 'PENDING' && (
                            <Button 
                              onClick={() => handleExecutePayout(p.id)}
                              disabled={isProcessing === p.id}
                              className="h-10 px-6 bg-slate-900 hover:bg-slate-800 text-white border-none rounded-none shadow-none font-bold text-[9px] uppercase tracking-widest"
                            >
                               {isProcessing === p.id ? 'Disbursing...' : 'Disburse Funds'}
                            </Button>
                          )}
                          
                          {(p.status === 'SUCCESS' || p.status === 'COMPLETED') && (
                            <Button variant="ghost" className="h-10 px-4 font-bold text-[9px] uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
                               View Record
                             </Button>
                          )}
                       </div>
                    </div>
                 </div>
               ))}
             </div>
           )}
        </div>
      </div>
    </AdminLayout>
  );
}
