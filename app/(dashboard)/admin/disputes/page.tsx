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
      <div className="space-y-10">
        {/* Header & Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
               <span>Admin</span>
               <ChevronRight className="h-3 w-3 opacity-50" />
               <span className="text-rose-600">Dispute Center</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Mediation <span className="text-slate-500">& Governance</span>
            </h1>
            <p className="text-sm text-slate-500 font-medium max-w-xl leading-relaxed">
              Resolve platform conflicts with full transparency. Your intervention secures the escrow and maintains market integrity.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white border border-slate-200 px-5 py-2.5 rounded-xl shadow-sm">
             <ShieldAlert className="h-4 w-4 text-rose-500" />
             <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wide">{disputes.length} Active Disputes</span>
          </div>
        </div>

        {isLoading ? (
          <div className="py-24 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
          </div>
        ) : disputes.length === 0 ? (
          <Card className="bg-white border-slate-200 py-24 text-center space-y-6 rounded-2xl shadow-sm">
            <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
               <ShieldCheck className="h-8 w-8 text-emerald-500" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">System is Healthy</h3>
              <p className="text-slate-500 max-w-sm mx-auto font-medium">All active orders are proceeding through escrow without any mediation requests.</p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6">
            {disputes.map((dispute) => (
              <Card key={dispute.id} className="bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden group hover:border-slate-300 transition-all duration-300">
                <div className="flex flex-col lg:flex-row">
                  {/* Case Details */}
                  <div className="p-8 lg:w-2/3 border-b lg:border-b-0 lg:border-r border-slate-100 space-y-8">
                    <div className="flex justify-between items-start">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-rose-50 text-rose-600 border-none px-2.5 py-1 font-bold uppercase text-[9px] tracking-wider rounded-md">Conflict Detected</Badge>
                          <span className="text-[11px] font-mono font-bold text-slate-400 tracking-tighter">CASE-ID: #{dispute.order?.order_number}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-primary transition-colors">{dispute.order?.product?.title}</h3>
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 relative overflow-hidden">
                           <div className="absolute top-2 left-2 opacity-10">
                              <MessageSquare className="h-10 w-10 text-slate-400" />
                           </div>
                           <p className="text-sm text-slate-700 font-medium leading-relaxed italic relative z-10">
                             "{dispute.reason}" — {dispute.description || 'No extended description provided.'}
                           </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Escrow at Stake</p>
                         <p className="text-3xl font-bold text-slate-900 tracking-tight">KSh {dispute.order?.total_amount.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Parties Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-slate-50">
                      <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                         <div className="flex items-center justify-between">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                              <User className="h-3.5 w-3.5" /> Buyer Identity
                            </p>
                            <Link href={`mailto:${dispute.order?.buyer?.email}`} className="text-slate-400 hover:text-slate-900 transition-colors">
                               <Mail className="h-4 w-4" />
                            </Link>
                         </div>
                         <div className="space-y-1">
                            <p className="text-base font-bold text-slate-900">{dispute.order?.buyer?.first_name} {dispute.order?.buyer?.last_name}</p>
                            <p className="text-xs text-slate-500 font-medium">{dispute.order?.buyer?.email}</p>
                            <div className="flex items-center gap-2 mt-3 text-slate-600 font-bold text-xs bg-white border border-slate-200 px-2.5 py-1 rounded-md w-fit shadow-sm">
                              <Phone className="h-3 w-3" /> {dispute.order?.buyer?.phone_number || 'No Phone Link'}
                            </div>
                         </div>
                      </div>
                      
                      <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                         <div className="flex items-center justify-between">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                              <Store className="h-3.5 w-3.5" /> Merchant Record
                            </p>
                            <Badge className="bg-emerald-50 text-emerald-600 border-none text-[9px] font-bold uppercase tracking-wider px-2 py-0.5">KYC Vetted</Badge>
                         </div>
                         <div className="space-y-1">
                            <p className="text-base font-bold text-slate-900">{dispute.order?.seller?.business_name || 'Individual Merchant'}</p>
                            <p className="text-xs text-slate-500 font-medium">{dispute.order?.seller?.first_name} {dispute.order?.seller?.last_name}</p>
                            <div className="mt-3 flex items-center gap-2 text-slate-600 font-bold text-[10px] uppercase tracking-wider bg-white border border-slate-200 px-2.5 py-1 rounded-md w-fit shadow-sm">
                              ID: {dispute.order?.seller?.id_number || 'UNVERIFIED'}
                            </div>
                         </div>
                      </div>
                    </div>

                    <div className="bg-rose-50 p-4 rounded-xl flex items-center justify-between border border-rose-100">
                       <div className="flex items-center gap-3 text-sm font-bold text-rose-600">
                          <AlertCircle className="h-4 w-4" />
                          Escrow Protection: <span className="text-slate-900">FROZEN PENDING MEDIATION</span>
                       </div>
                       <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(dispute.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                       </div>
                    </div>
                  </div>

                  {/* Resolution Engine */}
                  <div className="p-8 lg:w-1/3 bg-slate-50/50 flex flex-col justify-center gap-6">
                    <div className="text-center space-y-1">
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Resolution Hub</h4>
                      <p className="text-xs text-slate-500 font-medium">Final decisions will trigger instant M-Pesa movement.</p>
                    </div>
                    
                    <div className="space-y-3">
                      <Button 
                        onClick={() => resolveDispute(dispute.id, 'RELEASE')}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 gap-2 shadow-sm rounded-lg transition-all"
                      >
                        <ShieldCheck className="h-4 w-4" /> Release to Merchant
                      </Button>
                      <Button 
                        onClick={() => resolveDispute(dispute.id, 'REFUND')}
                        variant="outline"
                        className="w-full border-slate-200 bg-white text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-bold h-12 gap-2 shadow-sm rounded-lg transition-all"
                      >
                        <RotateCcw className="h-4 w-4" /> Full Buyer Refund
                      </Button>
                    </div>

                    <div className="h-px bg-slate-100" />

                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="ghost" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 font-bold h-10 gap-2 rounded-lg text-xs transition-all">
                        <MessageSquare className="h-4 w-4 text-primary" /> Case Chat
                      </Button>
                      <Button variant="ghost" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 font-bold h-10 gap-2 rounded-lg text-xs transition-all">
                        <ExternalLink className="h-4 w-4" /> Audit Logs
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
