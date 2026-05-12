'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  ChevronRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SellerVerifications() {
  const { toast } = useToast();
  const [sellers, setSellers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingSellers();
  }, []);

  async function fetchPendingSellers() {
    try {
      const res = await fetch('/api/admin/sellers/pending');
      const data = await res.json();
      setSellers(data.sellers || []);
    } catch (error) {
      toast({ title: "Failed to load pending sellers", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  const handleAction = async (sellerId: string, action: 'APPROVE' | 'REJECT') => {
    setProcessingId(sellerId);
    try {
      const res = await fetch('/api/admin/sellers/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellerId, action })
      });
      
      if (res.ok) {
        toast({ 
          title: action === 'APPROVE' ? "Seller Approved" : "Seller Rejected",
          description: "Notification email has been sent."
        });
        setSellers(sellers.filter(s => s.id !== sellerId));
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
      <div className="space-y-12">
        {/* Breadcrumbs & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
               <span>Admin</span>
               <ChevronRight className="h-3 w-3 opacity-30" />
               <span className="text-primary">Verifications</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.1]">
              Merchant <span className="text-primary/80">Onboarding</span>
            </h1>
            <p className="text-base text-slate-400 font-medium max-w-xl leading-relaxed">
              Review and vet new merchant applications. Quality control is the cornerstone of the Bagcom trust ecosystem.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-primary/10 border border-primary/20 px-6 py-3 rounded-[1.5rem] shadow-xl shadow-primary/5">
             <ShieldCheck className="h-5 w-5 text-primary" />
             <span className="text-[11px] font-black text-primary uppercase tracking-[0.1em]">{sellers.length} Pending Apps</span>
          </div>
        </div>

        {isLoading ? (
          <div className="py-24 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
          </div>
        ) : sellers.length === 0 ? (
          <Card className="bg-[#1E293B] border-white/5 py-24 text-center space-y-6 rounded-[2.5rem] shadow-2xl">
            <div className="h-20 w-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
               <CheckCircle className="h-10 w-10 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white tracking-tight">Queue is Clear</h3>
              <p className="text-slate-500 max-w-sm mx-auto font-medium">There are no new seller applications awaiting review at this time.</p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-8">
            {sellers.map((seller) => (
              <Card key={seller.id} className="bg-[#1E293B] border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden group hover:border-primary/20 transition-all duration-500">
                <div className="flex flex-col lg:flex-row">
                  <div className="p-10 lg:w-2/3 space-y-10">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-6">
                        <div className="h-16 w-16 bg-slate-800 rounded-2xl border border-white/5 flex items-center justify-center text-primary shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-500">
                          <Store className="h-8 w-8" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-3xl font-bold text-white tracking-tight group-hover:text-primary transition-colors">{seller.business_name || "Individual Merchant"}</h3>
                          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
                            <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg"><User className="h-3.5 w-3.5" /> {seller.first_name} {seller.last_name}</span>
                            <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg"><Mail className="h-3.5 w-3.5" /> {seller.email}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-4 py-1.5 font-bold uppercase text-[10px] tracking-widest rounded-full">Manual Review Required</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="p-6 bg-slate-900/40 border border-white/5 rounded-3xl space-y-4">
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                           <FileText className="h-3.5 w-3.5 text-primary" /> Identity Ref
                         </p>
                         <p className="text-xl font-bold text-white font-mono tracking-wider">{seller.id_number || 'N/A'}</p>
                      </div>
                      <div className="p-6 bg-slate-900/40 border border-white/5 rounded-3xl space-y-4">
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                           <Phone className="h-3.5 w-3.5 text-primary" /> M-Pesa Contact
                         </p>
                         <p className="text-xl font-bold text-white">{seller.phone_number || 'N/A'}</p>
                      </div>
                      <div className="p-6 bg-slate-900/40 border border-white/5 rounded-3xl space-y-4">
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                           <MapPin className="h-3.5 w-3.5 text-primary" /> Registered City
                         </p>
                         <p className="text-xl font-bold text-white">{seller.city || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="p-8 bg-slate-900/40 border border-white/5 rounded-[2rem] space-y-6 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-8 opacity-5">
                          <Store className="h-24 w-24" />
                       </div>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                         <Store className="h-3.5 w-3.5 text-primary" /> Operational Profile
                       </p>
                       <div className="space-y-4 relative z-10">
                          <div className="space-y-1">
                             <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Inventory Focus</p>
                             <p className="text-lg text-white font-bold leading-relaxed">{seller.planned_categories}</p>
                          </div>
                          <div className="h-px bg-white/5" />
                          <div className="space-y-1">
                             <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Business Pitch</p>
                             <p className="text-sm text-slate-300 font-medium leading-relaxed italic">"{seller.store_description}"</p>
                          </div>
                          <div className="h-px bg-white/5" />
                          <div className="flex items-center gap-3">
                             <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                <MapPin className="h-5 w-5 text-primary" />
                             </div>
                             <div className="space-y-0.5">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Physical Pickup Hub</p>
                                <p className="text-xs text-white font-bold">{seller.physical_address}</p>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="p-10 lg:w-1/3 bg-slate-900/60 flex flex-col justify-center gap-4 border-t lg:border-t-0 lg:border-l border-white/5">
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-16 rounded-2xl gap-3 shadow-xl shadow-primary/20 text-sm transition-all"
                      onClick={() => handleAction(seller.id, 'APPROVE')}
                      disabled={processingId === seller.id}
                    >
                      {processingId === seller.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />}
                      Approve & Activate Store
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-rose-500/20 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/40 font-bold h-16 rounded-2xl gap-3 text-sm transition-all"
                      onClick={() => handleAction(seller.id, 'REJECT')}
                      disabled={processingId === seller.id}
                    >
                      <XCircle className="h-5 w-5" /> Deny Application
                    </Button>
                    <div className="pt-4 text-center">
                       <Button variant="link" className="text-slate-500 hover:text-primary font-bold text-xs gap-2 transition-colors">
                         Open Full Merchant Audit <ExternalLink className="h-3.5 w-3.5" />
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
