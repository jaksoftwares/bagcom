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
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DisputeCenter() {
  const { toast } = useToast();
  const [disputes, setDisputes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDisputes() {
      try {
        const res = await fetch('/api/disputes'); // I'll check if this exists or create one
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

        <div className="grid gap-6">
          {disputes.length === 0 ? (
            <Card className="bg-[#1E293B] border-white/5 py-20 text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto" />
              <h3 className="text-xl font-bold text-white">Zero Active Disputes</h3>
              <p className="text-gray-500 max-w-sm mx-auto">All transactions are currently proceeding smoothly without intervention.</p>
            </Card>
          ) : (
            disputes.map((dispute) => (
              <Card key={dispute.id} className="bg-[#1E293B] border-white/5 shadow-xl overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  {/* Case Summary */}
                  <div className="p-8 lg:w-2/3 border-b lg:border-b-0 lg:border-r border-white/5 space-y-8">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-rose-500/20 text-rose-400 border-none px-3 py-1 uppercase text-[10px] font-black tracking-widest">Active Dispute</Badge>
                          <span className="text-xs font-mono font-bold text-gray-500">#{dispute.order?.order_number}</span>
                        </div>
                        <h3 className="text-2xl font-black text-white">{dispute.order?.product?.title}</h3>
                        <p className="text-sm text-gray-400 font-medium leading-relaxed">
                          "{dispute.reason}"
                        </p>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Escrowed Amount</p>
                         <p className="text-2xl font-black text-white">KSh {dispute.order?.total_amount.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 pt-8 border-t border-white/5">
                       <div className="space-y-1">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><User className="h-3 w-3" /> Buyer</p>
                          <p className="text-sm font-bold text-gray-300">{dispute.order?.buyer?.first_name} {dispute.order?.buyer?.last_name}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><Package className="h-3 w-3" /> Seller</p>
                          <p className="text-sm font-bold text-gray-300">{dispute.order?.seller?.first_name} {dispute.order?.seller?.last_name}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><Clock className="h-3 w-3" /> Opened On</p>
                          <p className="text-sm font-bold text-gray-300">{new Date(dispute.created_at).toLocaleDateString()}</p>
                       </div>
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl flex items-center justify-between border border-white/5">
                       <div className="flex items-center gap-3 text-sm font-bold text-gray-400">
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                          Delivery proof has not been uploaded by the seller.
                       </div>
                       <Button variant="link" className="text-primary font-bold text-xs p-0">Review Full Logs →</Button>
                    </div>
                  </div>

                  {/* Resolution Panel */}
                  <div className="p-8 lg:w-1/3 bg-[#0F172A]/50 flex flex-col justify-center gap-6">
                    <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest text-center">Mediation Actions</h4>
                    
                    <div className="space-y-3">
                      <Button 
                        onClick={() => resolveDispute(dispute.id, 'RELEASE')}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 font-bold h-12 gap-2 shadow-lg shadow-emerald-500/10"
                      >
                        <Scale className="h-4 w-4" /> Release to Seller
                      </Button>
                      <Button 
                        onClick={() => resolveDispute(dispute.id, 'REFUND')}
                        className="w-full bg-rose-500 hover:bg-rose-600 font-bold h-12 gap-2 shadow-lg shadow-rose-500/10"
                      >
                        <RotateCcw className="h-4 w-4" /> Refund Buyer
                      </Button>
                    </div>

                    <div className="h-px bg-white/5" />

                    <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 font-bold h-12 gap-2">
                      <MessageSquare className="h-4 w-4" /> Contact Parties
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
