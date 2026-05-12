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
      <div className="space-y-10">
        {/* Breadcrumbs & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
               <span>Admin</span>
               <ChevronRight className="h-3 w-3 opacity-50" />
               <span className="text-primary">Verifications</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Merchant <span className="text-slate-500">Onboarding</span>
            </h1>
            <p className="text-sm text-slate-500 font-medium max-w-xl leading-relaxed">
              Review and vet new merchant applications. Quality control is the cornerstone of the Bagcom trust ecosystem.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white border border-slate-200 px-5 py-2.5 rounded-xl shadow-sm">
             <ShieldCheck className="h-4 w-4 text-primary" />
             <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wide">{sellers.length} Pending Applications</span>
          </div>
        </div>

        {isLoading ? (
          <div className="py-24 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
          </div>
        ) : sellers.length === 0 ? (
          <Card className="bg-white border-slate-200 py-24 text-center space-y-6 rounded-2xl shadow-sm">
            <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
               <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Queue is Clear</h3>
              <p className="text-slate-500 max-w-sm mx-auto font-medium">There are no new seller applications awaiting review at this time.</p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6">
            {sellers.map((seller) => (
              <Card key={seller.id} className="bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden group hover:border-slate-300 transition-all duration-300">
                <div className="flex flex-col lg:flex-row">
                  <div className="p-8 lg:w-2/3 space-y-8">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-5">
                        <div className="h-14 w-14 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center text-slate-900 shrink-0 group-hover:bg-slate-200 transition-all">
                          <Store className="h-7 w-7" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-primary transition-colors">{seller.business_name || "Individual Merchant"}</h3>
                          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500">
                            <span className="flex items-center gap-2 bg-slate-50 px-2.5 py-1 rounded-md"><User className="h-3 w-3" /> {seller.first_name} {seller.last_name}</span>
                            <span className="flex items-center gap-2 bg-slate-50 px-2.5 py-1 rounded-md"><Mail className="h-3 w-3" /> {seller.email}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-amber-50 text-amber-600 border-none px-3 py-1 font-bold uppercase text-[9px] tracking-wider rounded-full">Requires Review</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                           <FileText className="h-3.5 w-3.5" /> Identity Reference
                         </p>
                         <p className="text-lg font-bold text-slate-900 font-mono tracking-wider">{seller.id_number || 'N/A'}</p>
                      </div>
                      <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                           <Phone className="h-3.5 w-3.5" /> M-Pesa Contact
                         </p>
                         <p className="text-lg font-bold text-slate-900">{seller.phone_number || 'N/A'}</p>
                      </div>
                      <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                           <MapPin className="h-3.5 w-3.5" /> Registered City
                         </p>
                         <p className="text-lg font-bold text-slate-900">{seller.city || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-xl space-y-5">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                         <Store className="h-3.5 w-3.5" /> Operational Profile
                       </p>
                       <div className="space-y-4">
                          <div className="space-y-1">
                             <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Inventory Focus</p>
                             <p className="text-base text-slate-900 font-bold leading-relaxed">{seller.planned_categories}</p>
                          </div>
                          <div className="h-px bg-slate-200/50" />
                          <div className="space-y-1">
                             <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Business Pitch</p>
                             <p className="text-sm text-slate-600 font-medium leading-relaxed italic">"{seller.store_description}"</p>
                          </div>
                          <div className="h-px bg-slate-200/50" />
                          <div className="flex items-center gap-3">
                             <div className="h-9 w-9 bg-white border border-slate-200 rounded-lg flex items-center justify-center">
                                <MapPin className="h-4 w-4 text-slate-500" />
                             </div>
                             <div className="space-y-0.5">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Physical Hub</p>
                                <p className="text-xs text-slate-900 font-bold">{seller.physical_address}</p>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="p-8 lg:w-1/3 bg-slate-50/50 flex flex-col justify-center gap-3 border-t lg:border-t-0 lg:border-l border-slate-100">
                    <Button 
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 rounded-lg gap-2 shadow-sm text-sm transition-all"
                      onClick={() => handleAction(seller.id, 'APPROVE')}
                      disabled={processingId === seller.id}
                    >
                      {processingId === seller.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                      Approve Store
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-slate-200 bg-white text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-bold h-12 rounded-lg gap-2 text-sm transition-all"
                      onClick={() => handleAction(seller.id, 'REJECT')}
                      disabled={processingId === seller.id}
                    >
                      <XCircle className="h-4 w-4" /> Deny Access
                    </Button>
                    <div className="pt-2 text-center">
                       <Button variant="link" className="text-slate-400 hover:text-slate-900 font-bold text-[11px] uppercase tracking-wider gap-2 transition-all">
                         View Full Audit <ExternalLink className="h-3 w-3" />
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
