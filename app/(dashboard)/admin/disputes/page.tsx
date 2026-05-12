'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  Link
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DisputeCenter() {
  const { toast } = useToast();
  const [disputes, setDisputes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDisputes() {
      try {
        const res = await fetch('/api/disputes');
        const data = await res.json();
        setDisputes(data.disputes || []);
      } catch (error) {
        toast({ title: "Failed to load disputes", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    fetchDisputes();
  }, []);

  const resolveDispute = async (id: string, action: 'RELEASE' | 'REFUND') => {
    try {
      const res = await fetch(`/api/admin/disputes/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        toast({ title: `Dispute resolved: ${action}` });
        setDisputes(disputes.filter(d => d.id !== id));
      }
    } catch (error) {
      toast({ title: "Resolution failed", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white">Dispute Resolution</h1>
            <p className="text-gray-400 font-medium mt-2">Mediate conflicts and ensure fair outcomes for all parties.</p>
          </div>
          <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-xl">
             <ShieldAlert className="h-5 w-5 text-rose-500" />
             <span className="text-sm font-bold text-rose-500">{disputes.length} Active Cases</span>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-6">
            {disputes.length === 0 ? (
              <Card className="bg-[#1E293B] border-white/5 py-20 text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto" />
                <h3 className="text-xl font-bold text-white">Zero Active Disputes</h3>
                <p className="text-gray-500 max-w-sm mx-auto">All transactions are currently proceeding smoothly without intervention.</p>
              </Card>
            ) : (
              disputes.map((dispute) => (
                <Card key={dispute.id} className="bg-[#1E293B] border-white/5 shadow-xl overflow-hidden group hover:border-rose-500/10 transition-all">
                  <div className="flex flex-col lg:flex-row">
                    {/* Case Summary */}
                    <div className="p-8 lg:w-2/3 border-b lg:border-b-0 lg:border-r border-white/5 space-y-8">
                      <div className="flex justify-between items-start">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Badge className="bg-rose-500/20 text-rose-400 border-none px-3 py-1 uppercase text-[10px] font-black tracking-widest">Active Dispute</Badge>
                            <span className="text-xs font-mono font-bold text-gray-500 tracking-tighter">Order #{dispute.order?.order_number}</span>
                          </div>
                          <h3 className="text-2xl font-black text-white tracking-tight">{dispute.order?.product?.title}</h3>
                          <div className="bg-[#0F172A]/50 border border-white/5 rounded-xl p-4 italic text-sm text-gray-400 leading-relaxed">
                            "{dispute.reason}" — {dispute.description || 'No additional details provided.'}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                           <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Escrowed Amount</p>
                           <p className="text-3xl font-black text-white tracking-tighter">KSh {dispute.order?.total_amount.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Participant Identity Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-white/5">
                        <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                           <div className="flex items-center justify-between">
                              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <User className="h-3 w-3" /> Buyer Identity
                              </p>
                              <Link href={`mailto:${dispute.order?.buyer?.email}`} className="text-primary hover:scale-110 transition-transform">
                                 <Mail className="h-3.5 w-3.5" />
                              </Link>
                           </div>
                           <div className="space-y-1">
                              <p className="text-base font-bold text-white">{dispute.order?.buyer?.first_name} {dispute.order?.buyer?.last_name}</p>
                              <p className="text-xs text-gray-400 font-medium">{dispute.order?.buyer?.email}</p>
                              <p className="text-xs text-indigo-400 font-bold flex items-center gap-2 mt-2">
                                <Phone className="h-3 w-3" /> {dispute.order?.buyer?.phone_number || 'No Phone'}
                              </p>
                           </div>
                        </div>
                        
                        <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                           <div className="flex items-center justify-between">
                              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <Store className="h-3 w-3" /> Seller Identity
                              </p>
                              <Badge className="bg-amber-500/10 text-amber-500 border-none text-[9px] font-black uppercase tracking-tighter">KYC Verified</Badge>
                           </div>
                           <div className="space-y-1">
                              <p className="text-base font-bold text-white">{dispute.order?.seller?.business_name || 'Individual Seller'}</p>
                              <p className="text-xs text-gray-400 font-medium">Owner: {dispute.order?.seller?.first_name} {dispute.order?.seller?.last_name}</p>
                              <p className="text-[11px] text-amber-500 font-black uppercase tracking-widest mt-2">
                                ID: {dispute.order?.seller?.id_number || 'UNVERIFIED'}
                              </p>
                           </div>
                        </div>
                      </div>

                      <div className="bg-white/5 p-4 rounded-xl flex items-center justify-between border border-white/5">
                         <div className="flex items-center gap-3 text-sm font-bold text-gray-400">
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                            Escrow status: <span className="text-white">FROZEN</span>
                         </div>
                         <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                            <Clock className="h-3 w-3" />
                            Opened {new Date(dispute.created_at).toLocaleDateString()}
                         </div>
                      </div>
                    </div>

                    {/* Resolution Panel */}
                    <div className="p-8 lg:w-1/3 bg-[#0F172A]/50 flex flex-col justify-center gap-6">
                      <div className="text-center space-y-1">
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Resolution Engine</h4>
                        <p className="text-[11px] text-gray-400 font-medium">Funds will be moved instantly upon action.</p>
                      </div>
                      
                      <div className="space-y-3">
                        <Button 
                          onClick={() => resolveDispute(dispute.id, 'RELEASE')}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold h-14 gap-3 shadow-lg shadow-emerald-600/10 rounded-2xl"
                        >
                          <Scale className="h-5 w-5" /> Release to Seller
                        </Button>
                        <Button 
                          onClick={() => resolveDispute(dispute.id, 'REFUND')}
                          className="w-full bg-rose-600 hover:bg-rose-700 font-bold h-14 gap-3 shadow-lg shadow-rose-600/10 rounded-2xl"
                        >
                          <RotateCcw className="h-5 w-5" /> Refund Buyer
                        </Button>
                      </div>

                      <div className="h-px bg-white/5" />

                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="border-white/10 hover:bg-white/5 font-bold h-11 gap-2 rounded-xl text-xs">
                          <MessageSquare className="h-4 w-4 text-primary" /> Chat
                        </Button>
                        <Button variant="outline" className="border-white/10 hover:bg-white/5 font-bold h-11 gap-2 rounded-xl text-xs">
                          <ExternalLink className="h-4 w-4 text-gray-400" /> Logs
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
