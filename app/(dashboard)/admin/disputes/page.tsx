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
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

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
      <div className="space-y-12">
        {/* Header & Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
               <span>Admin</span>
               <ChevronRight className="h-3 w-3 opacity-30" />
               <span className="text-rose-500">Dispute Center</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.1]">
              Mediation <span className="text-rose-500/80">& Governance</span>
            </h1>
            <p className="text-base text-slate-400 font-medium max-w-xl leading-relaxed">
              Resolve platform conflicts with full transparency. Your intervention secures the escrow and maintains market integrity.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-rose-500/10 border border-rose-500/20 px-6 py-3 rounded-[1.5rem] shadow-xl shadow-rose-500/5">
             <ShieldAlert className="h-5 w-5 text-rose-500" />
             <span className="text-[11px] font-black text-rose-500 uppercase tracking-[0.1em]">{disputes.length} Active Disputes</span>
          </div>
        </div>

        {isLoading ? (
          <div className="py-24 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
          </div>
        ) : disputes.length === 0 ? (
          <Card className="bg-[#1E293B] border-white/5 py-24 text-center space-y-6 rounded-[2.5rem] shadow-2xl">
            <div className="h-20 w-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
               <ShieldCheck className="h-10 w-10 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white tracking-tight">System is Healthy</h3>
              <p className="text-slate-500 max-w-sm mx-auto font-medium">All active orders are proceeding through escrow without any mediation requests.</p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-8">
            {disputes.map((dispute) => (
              <Card key={dispute.id} className="bg-[#1E293B] border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden group hover:border-rose-500/20 transition-all duration-500">
                <div className="flex flex-col lg:flex-row">
                  {/* Case Details */}
                  <div className="p-10 lg:w-2/3 border-b lg:border-b-0 lg:border-r border-white/5 space-y-10">
                    <div className="flex justify-between items-start">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 font-bold uppercase text-[10px] tracking-widest rounded-full">Conflict Detected</Badge>
                          <span className="text-[11px] font-mono font-bold text-slate-500 tracking-tighter">CASE-ID: #{dispute.order?.order_number}</span>
                        </div>
                        <h3 className="text-3xl font-bold text-white tracking-tight group-hover:text-rose-400 transition-colors">{dispute.order?.product?.title}</h3>
                        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                           <div className="absolute top-2 left-2 opacity-5">
                              <MessageSquare className="h-12 w-12" />
                           </div>
                           <p className="text-sm text-slate-300 font-medium leading-relaxed italic relative z-10">
                             "{dispute.reason}" — {dispute.description || 'The user has not provided an extended description for this case.'}
                           </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Escrow at Stake</p>
                         <p className="text-4xl font-black text-white tracking-tighter">KSh {dispute.order?.total_amount.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Parties Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-white/5">
                      <div className="p-6 bg-slate-900/40 rounded-[1.5rem] border border-white/5 space-y-5">
                         <div className="flex items-center justify-between">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                              <User className="h-3.5 w-3.5 text-primary" /> Buyer Identity
                            </p>
                            <Link href={`mailto:${dispute.order?.buyer?.email}`} className="text-primary hover:scale-110 transition-transform">
                               <Mail className="h-4 w-4" />
                            </Link>
                         </div>
                         <div className="space-y-1">
                            <p className="text-lg font-bold text-white">{dispute.order?.buyer?.first_name} {dispute.order?.buyer?.last_name}</p>
                            <p className="text-xs text-slate-400 font-medium">{dispute.order?.buyer?.email}</p>
                            <div className="flex items-center gap-2 mt-4 text-indigo-400 font-bold text-xs bg-indigo-400/5 px-3 py-1.5 rounded-lg w-fit">
                              <Phone className="h-3.5 w-3.5" /> {dispute.order?.buyer?.phone_number || 'No Phone Link'}
                            </div>
                         </div>
                      </div>
                      
                      <div className="p-6 bg-slate-900/40 rounded-[1.5rem] border border-white/5 space-y-5">
                         <div className="flex items-center justify-between">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                              <Store className="h-3.5 w-3.5 text-primary" /> Merchant Record
                            </p>
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-none text-[9px] font-bold uppercase tracking-widest">KYC Vetted</Badge>
                         </div>
                         <div className="space-y-1">
                            <p className="text-lg font-bold text-white">{dispute.order?.seller?.business_name || 'Individual Merchant'}</p>
                            <p className="text-xs text-slate-400 font-medium">Contact: {dispute.order?.seller?.first_name} {dispute.order?.seller?.last_name}</p>
                            <div className="mt-4 flex items-center gap-2 text-amber-500 font-bold text-[10px] uppercase tracking-widest bg-amber-500/5 px-3 py-1.5 rounded-lg w-fit">
                              National ID: {dispute.order?.seller?.id_number || 'UNVERIFIED'}
                            </div>
                         </div>
                      </div>
                    </div>

                    <div className="bg-rose-500/5 p-5 rounded-2xl flex items-center justify-between border border-rose-500/10">
                       <div className="flex items-center gap-3 text-sm font-bold text-rose-400">
                          <AlertCircle className="h-4.5 w-4.5" />
                          Escrow Protection: <span className="text-white">FROZEN PENDING MEDIATION</span>
                       </div>
                       <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                          <Clock className="h-3.5 w-3.5" />
                          Opened {new Date(dispute.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                       </div>
                    </div>
                  </div>

                  {/* Resolution Engine */}
                  <div className="p-10 lg:w-1/3 bg-slate-900/60 flex flex-col justify-center gap-8">
                    <div className="text-center space-y-2">
                      <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em]">Decision Engine</h4>
                      <p className="text-xs text-slate-400 font-medium max-w-[200px] mx-auto">Atomic resolution actions will trigger instant M-Pesa movement.</p>
                    </div>
                    
                    <div className="space-y-4">
                      <Button 
                        onClick={() => resolveDispute(dispute.id, 'RELEASE')}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-16 gap-3 shadow-xl shadow-emerald-600/10 rounded-[1.25rem] transition-all"
                      >
                        <ShieldCheck className="h-5 w-5" /> Release to Merchant
                      </Button>
                      <Button 
                        onClick={() => resolveDispute(dispute.id, 'REFUND')}
                        className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold h-16 gap-3 shadow-xl shadow-rose-600/10 rounded-[1.25rem] transition-all"
                      >
                        <RotateCcw className="h-5 w-5" /> Full Buyer Refund
                      </Button>
                    </div>

                    <div className="h-px bg-white/5 mx-4" />

                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="border-white/5 hover:bg-white/5 font-bold h-12 gap-2 rounded-xl text-xs transition-all">
                        <MessageSquare className="h-4 w-4 text-primary" /> Case Chat
                      </Button>
                      <Button variant="outline" className="border-white/5 hover:bg-white/5 font-bold h-12 gap-2 rounded-xl text-xs transition-all">
                        <ExternalLink className="h-4 w-4 text-slate-500" /> Audit Logs
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
