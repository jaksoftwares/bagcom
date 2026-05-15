'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShieldCheck, 
  User, 
  Store, 
  FileText, 
  CheckCircle, 
  XCircle,
  Loader2,
  ExternalLink,
  Mail,
  AlertCircle,
  Phone,
  MapPin,
  ChevronRight,
  TrendingUp,
  Clock,
  Ban,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import UserDetailDrawer from '@/components/admin/UserDetailDrawer';

export default function SellerVerifications() {
  const { toast } = useToast();
  const [sellers, setSellers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('PENDING');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchSellers();
    fetchStats();
  }, [activeTab]);

  async function fetchSellers() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/sellers?status=${activeTab}`);
      const data = await res.json();
      setSellers(data.sellers || []);
    } catch (error) {
      toast({ title: "Failed to load sellers", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchStats() {
    try {
      const res = await fetch('/api/admin/sellers?type=STATS');
      const data = await res.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Stats load failed');
    }
  }

  const handleAction = async (sellerId: string, action: 'APPROVE' | 'REJECT') => {
    let reason = '';
    if (action === 'REJECT') {
      const input = prompt('Please enter a reason for rejection (this will be logged and emailed):');
      if (input === null) return;
      reason = input;
    }

    setProcessingId(sellerId);
    try {
      const res = await fetch('/api/admin/sellers/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellerId, action, reason })
      });
      
      if (res.ok) {
        toast({ 
          title: action === 'APPROVE' ? "Seller Approved" : "Seller Rejected",
          description: "Notification email has been sent."
        });
        fetchSellers();
        fetchStats();
      } else {
        throw new Error("Failed to process request");
      }
    } catch (error) {
      toast({ title: "Operation failed", variant: "destructive" });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Breadcrumbs & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">
               <span>Governance</span>
               <div className="h-1 w-1 bg-border rounded-full" />
               <span className="text-primary">Verification Hub</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Merchant Onboarding
            </h1>
            <p className="text-[13px] text-muted-foreground font-medium max-w-xl leading-relaxed">
              Review and mediate merchant applications to maintain a high-trust marketplace environment.
            </p>
          </div>
        </div>

        {/* Stats Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="p-6 bg-white border border-slate-200 rounded-none flex flex-col justify-between h-32">
              <div>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Awaiting Audit</p>
                 <p className="text-2xl font-bold text-slate-900 tracking-tight">{stats?.pending || 0}</p>
              </div>
           </div>
           <div className="p-6 bg-white border border-slate-200 rounded-none flex flex-col justify-between h-32">
              <div>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Verified</p>
                 <p className="text-2xl font-bold text-slate-900 tracking-tight">{stats?.approved || 0}</p>
              </div>
           </div>
           <div className="p-6 bg-white border border-slate-200 rounded-none flex flex-col justify-between h-32">
              <div>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Denied</p>
                 <p className="text-2xl font-bold text-slate-900 tracking-tight">{stats?.rejected || 0}</p>
              </div>
           </div>
           <div className="p-6 bg-slate-900 border border-slate-900 rounded-none flex flex-col justify-between h-32 text-white">
              <div>
                 <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">Success Rate</p>
                 <p className="text-2xl font-bold text-white tracking-tight">
                    {stats?.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%
                 </p>
              </div>
           </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
           <TabsList className="bg-transparent p-0 h-auto border-b border-slate-200 w-full justify-start rounded-none gap-8">
             <TabsTrigger value="PENDING" className="rounded-none border-b-2 border-transparent px-0 py-4 font-bold text-[10px] uppercase tracking-[0.2em] data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:border-slate-900 data-[state=active]:shadow-none transition-all">Verification Queue</TabsTrigger>
             <TabsTrigger value="APPROVED" className="rounded-none border-b-2 border-transparent px-0 py-4 font-bold text-[10px] uppercase tracking-[0.2em] data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:border-slate-900 data-[state=active]:shadow-none transition-all">Verified Members</TabsTrigger>
             <TabsTrigger value="REJECTED" className="rounded-none border-b-2 border-transparent px-0 py-4 font-bold text-[10px] uppercase tracking-[0.2em] data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:border-slate-900 data-[state=active]:shadow-none transition-all">Denied Access</TabsTrigger>
           </TabsList>

           <TabsContent value={activeTab} className="outline-none">
              {isLoading ? (
                <div className="py-24 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Synchronizing...</p>
                </div>
              ) : sellers.length === 0 ? (
                <div className="py-32 text-center border border-slate-200 bg-slate-50 rounded-none">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Queue is clear</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {sellers.map((seller) => (
                    <div key={seller.id} className="bg-white border border-slate-200 rounded-none p-8 flex flex-col lg:flex-row gap-8 transition-colors hover:bg-slate-50">
                        <div className="flex-1 space-y-8">
                          <div className="flex justify-between items-start gap-6">
                            <div className="space-y-1.5">
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase">{seller.business_name || "Merchant Application"}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{seller.first_name} {seller.last_name} — {seller.email}</p>
                            </div>
                            <span className={`px-4 py-1.5 font-bold uppercase text-[9px] tracking-widest border ${
                              seller.seller_status === 'APPROVED' ? 'border-slate-900 bg-slate-900 text-white' : 
                              seller.seller_status === 'REJECTED' ? 'border-rose-200 text-rose-600' : 'border-amber-200 text-amber-600'
                            }`}>
                              {seller.seller_status === 'PENDING' ? 'Awaiting Audit' : seller.seller_status}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                             <div>
                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-1">ID Number</p>
                                <p className="text-sm font-bold text-slate-900 font-mono">{seller.id_number || '—'}</p>
                             </div>
                             <div>
                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-1">Phone</p>
                                <p className="text-sm font-bold text-slate-900">{seller.phone_number || '—'}</p>
                             </div>
                             <div>
                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-1">City</p>
                                <p className="text-sm font-bold text-slate-900">{seller.city || '—'}</p>
                             </div>
                          </div>
                          
                          <div className="space-y-4 pt-2">
                             <div className="space-y-1">
                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Store Intent</p>
                                <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                                   "{seller.store_description || 'No description provided.'}"
                                </p>
                             </div>
                             <div className="flex flex-wrap gap-12">
                                <div>
                                   <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-1">Categories</p>
                                   <p className="text-[10px] text-slate-900 font-bold uppercase tracking-tight">{seller.planned_categories || 'Uncategorized'}</p>
                                </div>
                                <div>
                                   <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-1">Physical Address</p>
                                   <p className="text-[10px] text-slate-900 font-bold uppercase tracking-tight">{seller.physical_address || 'Not disclosed'}</p>
                                </div>
                                <div>
                                   <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-1">Submitted</p>
                                   <p className="text-[10px] text-slate-900 font-bold uppercase tracking-tight">{new Date(seller.created_at).toLocaleDateString()}</p>
                                </div>
                             </div>
                          </div>
                        </div>

                        <div className="lg:w-64 shrink-0 flex flex-col gap-3 pt-8 lg:pt-0 lg:pl-8 lg:border-l border-slate-100">
                          {seller.seller_status === 'PENDING' && (
                            <>
                              <Button 
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 rounded-none uppercase tracking-widest text-[9px] shadow-none"
                                onClick={() => handleAction(seller.id, 'APPROVE')}
                                disabled={processingId === seller.id}
                              >
                                {processingId === seller.id ? 'Processing...' : 'Verify Merchant'}
                              </Button>
                              <Button 
                                variant="outline" 
                                className="w-full border-slate-200 text-slate-900 hover:bg-slate-50 font-bold h-12 rounded-none uppercase tracking-widest text-[9px]"
                                onClick={() => handleAction(seller.id, 'REJECT')}
                                disabled={processingId === seller.id}
                              >
                                Deny Access
                              </Button>
                            </>
                          )}
                          
                          <Button 
                            variant="ghost" 
                            className="text-slate-400 hover:text-slate-900 font-bold text-[9px] uppercase tracking-widest w-full h-10 rounded-none"
                            onClick={() => setSelectedUserId(seller.id)}
                          >
                            View Record
                          </Button>
                        </div>
                    </div>
                  ))}
                </div>
              )}
           </TabsContent>
        </Tabs>
      </div>

      <UserDetailDrawer 
        userId={selectedUserId}
        onClose={() => setSelectedUserId(null)}
        onUpdate={() => {
          fetchSellers();
          fetchStats();
        }}
      />
    </AdminLayout>
  );
}
