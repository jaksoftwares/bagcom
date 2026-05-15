'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card } from '@/components/ui/card';
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
  Activity,
  RefreshCw,
  Wallet,
  PiggyBank,
  CheckCircle,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import TransactionDetailDrawer from '@/components/admin/TransactionDetailDrawer';

export default function AdminFinancials() {
  const { toast } = useToast();
  const [escrowList, setEscrowList] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);

  useEffect(() => {
    fetchFinancials();
    fetchStats();
  }, []);

  async function fetchFinancials() {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/financials'); 
      const data = await res.json();
      setEscrowList(data.transactions || []);
    } catch (error) {
      toast({ title: "Failed to load records", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchStats() {
    try {
      const res = await fetch('/api/admin/financials?type=STATS');
      const data = await res.json();
      setStats(data.stats);
    } catch (e) {
      console.error('Stats load failed');
    }
  }

  const syncMpesaBalance = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/admin/mpesa/balance', { method: 'POST' });
      if (res.ok) {
        toast({ title: "Sync Initiated", description: "Requesting real-time balance from Safaricom..." });
      }
    } catch (e) {
      toast({ title: "Sync failed", variant: "destructive" });
    } finally {
      setIsSyncing(false);
    }
  };

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
        toast({ title: "State updated", description: "Audit log recorded." });
        fetchFinancials();
        fetchStats();
      }
    } catch (e) {
      toast({ title: "Operation failed", variant: "destructive" });
    }
  };

  const filteredList = escrowList.filter(item => 
    item.order?.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.mpesa_receipt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Header Section */}
        <div className="flex justify-between items-end gap-8 pb-4">
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-widest text-foreground uppercase">
              Financials
            </h1>
          </div>
          <div className="flex gap-4">
             <Button 
               onClick={syncMpesaBalance}
               disabled={isSyncing}
               variant="outline" 
               className="h-10 px-6 border-slate-200 font-bold text-[10px] uppercase tracking-widest rounded-none shadow-none"
             >
                {isSyncing ? 'Syncing...' : 'Sync M-Pesa'}
             </Button>
          </div>
        </div>

        {/* Treasury Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="p-6 bg-white border border-slate-200 rounded-none flex flex-col justify-between h-32">
              <div>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">M-Pesa Balance</p>
                 <p className="text-2xl font-bold text-slate-900 tracking-tight">KSh {stats?.mpesaBalance?.toLocaleString() || 0}</p>
              </div>
              <p className="text-[8px] font-bold text-primary uppercase tracking-[0.2em]">Treasury</p>
           </div>
           <div className="p-6 bg-white border border-slate-200 rounded-none flex flex-col justify-between h-32">
              <div>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Frozen Escrow</p>
                 <p className="text-2xl font-bold text-slate-900 tracking-tight">KSh {stats?.activeEscrow?.toLocaleString() || 0}</p>
              </div>
           </div>
           <div className="p-6 bg-white border border-slate-200 rounded-none flex flex-col justify-between h-32">
              <div>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Revenue Yield</p>
                 <p className="text-2xl font-bold text-slate-900 tracking-tight">KSh {stats?.settledRevenue?.toLocaleString() || 0}</p>
              </div>
           </div>
           <div className="p-6 bg-slate-900 border border-slate-900 rounded-none flex flex-col justify-between h-32 text-white">
              <div>
                 <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">Volume</p>
                 <p className="text-2xl font-bold text-white tracking-tight">{stats?.totalTransactions || 0}</p>
              </div>
           </div>
        </div>

        {/* Transaction Ledger */}
        <div className="space-y-6">
           <div className="flex justify-between items-center gap-6 border-b border-slate-200">
              <div className="pb-4">
                 <p className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em]">Transaction Ledger</p>
              </div>

              <div className="relative w-full md:w-72 pb-4">
                 <Input 
                   placeholder="SEARCH..." 
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
               {filteredList.map((item) => (
                 <div key={item.id} className="bg-white border border-slate-200 rounded-none p-6 transition-colors hover:bg-slate-50">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                       {/* Order Link */}
                       <div className="w-48 shrink-0">
                          <p className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">Order #{item.order?.order_number}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">REF: {item.id.slice(0, 8)}</p>
                       </div>

                       {/* Transaction Metrics */}
                       <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8">
                          <div>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Value</p>
                             <p className="text-sm font-bold text-slate-900 tracking-tight">KSh {item.held_amount?.toLocaleString()}</p>
                          </div>
                          <div>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                             <p className="text-[10px] font-bold text-slate-900 uppercase tracking-tight">{item.escrow_status}</p>
                          </div>
                          <div className="hidden md:block">
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Settled</p>
                             <p className="text-[10px] font-bold text-slate-900 uppercase tracking-tight">
                                {item.released_at ? new Date(item.released_at).toLocaleDateString() : 'PENDING'}
                             </p>
                          </div>
                       </div>

                       {/* Actions */}
                       <div className="flex items-center gap-4 shrink-0">
                          <Button 
                            onClick={() => setSelectedTransactionId(item.id)}
                            variant="ghost" 
                            className="h-10 px-4 font-bold text-[9px] uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
                          >
                             Details
                          </Button>

                          {item.escrow_status === 'HELD' && (
                            <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                               <Button 
                                 onClick={() => handleOverride(item.id, 'FORCE_RELEASE')}
                                 className="h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white border-none rounded-none shadow-none font-bold text-[9px] uppercase tracking-widest"
                               >
                                  Release
                               </Button>
                               <Button 
                                 onClick={() => handleOverride(item.id, 'FREEZE')}
                                 className="h-9 px-4 bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 rounded-none shadow-none font-bold text-[9px] uppercase tracking-widest"
                               >
                                  Freeze
                               </Button>
                            </div>
                          )}
                       </div>
                    </div>
                 </div>
               ))}
             </div>
           )}
        </div>
      </div>

      <TransactionDetailDrawer 
        transactionId={selectedTransactionId}
        onClose={() => setSelectedTransactionId(null)}
      />
    </AdminLayout>
  );
}
