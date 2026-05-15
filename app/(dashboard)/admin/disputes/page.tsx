'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShieldAlert, 
  MessageSquare, 
  Scale, 
  ExternalLink, 
  CheckCircle, 
  RotateCcw,
  Loader2,
  Clock,
  User,
  Package,
  AlertCircle,
  Store,
  Phone,
  Mail,
  ChevronRight,
  ShieldCheck,
  Search,
  TrendingUp,
  CreditCard,
  History,
  ArrowRight,
  Ban,
  Activity,
  AlertTriangle,
  Lock,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import UserDetailDrawer from '@/components/admin/UserDetailDrawer';
import ProductDetailDrawer from '@/components/admin/ProductDetailDrawer';

export default function DisputeCenter() {
  const { toast } = useToast();
  const [disputes, setDisputes] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    fetchDisputes();
    fetchStats();
  }, [activeTab]);

  async function fetchDisputes() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/disputes?status=${activeTab}`);
      const data = await res.json();
      setDisputes(data.disputes || []);
    } catch (error) {
      toast({ title: "Failed to load disputes", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchStats() {
    try {
      const res = await fetch('/api/admin/disputes?type=STATS');
      const data = await res.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Stats load failed');
    }
  }

  const resolveDispute = async (id: string, action: 'RELEASE' | 'REFUND') => {
    try {
      const res = await fetch(`/api/admin/disputes/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        toast({ title: `Resolved: ${action}` });
        fetchDisputes();
        fetchStats();
      }
    } catch (error) {
      toast({ title: "Resolution failed", variant: "destructive" });
    }
  };

  const filteredDisputes = disputes.filter(d => 
    d.order?.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.order?.product?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.order?.buyer?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.order?.seller?.business_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase tracking-widest">
              Disputes
            </h1>
          </div>
        </div>

        {/* Stats Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="p-6 bg-white border border-slate-200 rounded-none flex flex-col justify-between h-32">
              <div>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Cases</p>
                 <p className="text-2xl font-bold text-slate-900 tracking-tight">{stats?.active || 0}</p>
              </div>
           </div>
           <div className="p-6 bg-white border border-slate-200 rounded-none flex flex-col justify-between h-32">
              <div>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Withheld Value</p>
                 <p className="text-2xl font-bold text-slate-900 tracking-tight">KSh {stats?.frozenAmount?.toLocaleString() || 0}</p>
              </div>
           </div>
           <div className="p-6 bg-white border border-slate-200 rounded-none flex flex-col justify-between h-32">
              <div>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Settled</p>
                 <p className="text-2xl font-bold text-slate-900 tracking-tight">{stats?.resolved || 0}</p>
              </div>
           </div>
           <div className="p-6 bg-slate-900 border border-slate-900 rounded-none flex flex-col justify-between h-32 text-white">
              <div>
                 <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">Total Volume</p>
                 <p className="text-2xl font-bold text-white tracking-tight">{stats?.total || 0}</p>
              </div>
           </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
           <div className="flex justify-between items-center gap-6 border-b border-slate-200">
              <TabsList className="bg-transparent p-0 h-auto w-full md:w-auto justify-start rounded-none gap-8">
                <TabsTrigger value="ACTIVE" className="rounded-none border-b-2 border-transparent px-0 py-4 font-bold text-[10px] uppercase tracking-[0.2em] data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:border-slate-900 data-[state=active]:shadow-none transition-all">Active Queue</TabsTrigger>
                <TabsTrigger value="RESOLVED" className="rounded-none border-b-2 border-transparent px-0 py-4 font-bold text-[10px] uppercase tracking-[0.2em] data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:border-slate-900 data-[state=active]:shadow-none transition-all">Settled</TabsTrigger>
                <TabsTrigger value="ALL" className="rounded-none border-b-2 border-transparent px-0 py-4 font-bold text-[10px] uppercase tracking-[0.2em] data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:border-slate-900 data-[state=active]:shadow-none transition-all">Historical</TabsTrigger>
              </TabsList>

              <div className="relative w-full md:w-72">
                 <Input 
                   placeholder="FILTER BY ORDER/ENTITY..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="border-none bg-transparent pl-0 pr-0 h-10 text-[10px] font-bold uppercase tracking-widest focus-visible:ring-0 placeholder:text-slate-300 shadow-none"
                 />
              </div>
           </div>

           <TabsContent value={activeTab} className="outline-none">
              {isLoading ? (
                <div className="py-24 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Synchronizing...</p>
                </div>
              ) : filteredDisputes.length === 0 ? (
                <div className="py-32 text-center border border-slate-200 bg-slate-50 rounded-none">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Queue is clear</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredDisputes.map((dispute) => {
                    const order = Array.isArray(dispute.order) ? dispute.order[0] : dispute.order;
                    return (
                      <div key={dispute.id} className="bg-white border border-slate-200 rounded-none p-6 transition-colors hover:bg-slate-50">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                           {/* Case Summary */}
                           <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center gap-3">
                                 <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{order?.product?.title}</h3>
                                 <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">#{order?.order_number}</span>
                              </div>
                              <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                 <span className="text-slate-900">KSh {(order?.total_amount || 0).toLocaleString()}</span>
                                 <div className="h-1 w-1 bg-slate-200 rounded-full" />
                                 <span className="text-slate-400 italic">"{dispute.reason}"</span>
                              </div>
                           </div>

                           {/* Counterparties */}
                           <div className="hidden lg:grid grid-cols-2 gap-8 w-80">
                              <div className="space-y-0.5">
                                 <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Buyer</p>
                                 <button onClick={() => setSelectedUserId(order?.buyer_id)} className="text-[11px] font-bold text-slate-900 hover:underline truncate text-left w-full">
                                    {order?.buyer?.first_name} {order?.buyer?.last_name}
                                  </button>
                              </div>
                              <div className="space-y-0.5">
                                 <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Seller</p>
                                 <button onClick={() => setSelectedUserId(order?.seller_id)} className="text-[11px] font-bold text-slate-900 hover:underline truncate text-left w-full">
                                    {order?.seller?.business_name || 'Individual'}
                                 </button>
                              </div>
                           </div>

                           {/* Resolution Actions */}
                           <div className="flex items-center gap-3">
                              {dispute.status === 'OPEN' && (
                                <>
                                  <Button 
                                    onClick={() => resolveDispute(dispute.id, 'RELEASE')}
                                    className="h-10 px-6 bg-slate-900 hover:bg-slate-800 text-white border-none rounded-none shadow-none font-bold text-[9px] uppercase tracking-widest"
                                  >
                                     Release Funds
                                  </Button>
                                  <Button 
                                    onClick={() => resolveDispute(dispute.id, 'REFUND')}
                                    className="h-10 px-6 border-slate-200 bg-white text-slate-900 hover:bg-slate-50 rounded-none shadow-none font-bold text-[9px] uppercase tracking-widest"
                                  >
                                     Refund Buyer
                                  </Button>
                                </>
                              )}
                              {dispute.status === 'RESOLVED' && (
                                 <span className="px-4 py-1 border border-slate-200 text-slate-400 text-[9px] font-bold uppercase tracking-widest">Case Resolved</span>
                              )}
                              <div className="h-8 w-px bg-slate-100 mx-2" />
                              <Button 
                                variant="ghost" 
                                className="h-10 px-4 font-bold text-[9px] uppercase tracking-widest text-slate-400 hover:text-slate-900"
                                onClick={() => setSelectedProductId(order?.product_id)}
                              >
                                 Record
                              </Button>
                           </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
           </TabsContent>
        </Tabs>
      </div>

      <UserDetailDrawer 
        userId={selectedUserId}
        onClose={() => setSelectedUserId(null)}
        onUpdate={() => {
          fetchDisputes();
          fetchStats();
        }}
      />

      <ProductDetailDrawer
        productId={selectedProductId}
        onClose={() => setSelectedProductId(null)}
        onUpdate={() => {
          fetchDisputes();
          fetchStats();
        }}
      />
    </AdminLayout>
  );
}
