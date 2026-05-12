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
  AlertCircle
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white">Seller Verifications</h1>
            <p className="text-gray-400 font-medium mt-2">Review and approve merchant applications to maintain platform quality.</p>
          </div>
          <div className="flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl">
             <ShieldCheck className="h-5 w-5 text-indigo-500" />
             <span className="text-sm font-bold text-indigo-500">{sellers.length} Pending Applications</span>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : sellers.length === 0 ? (
          <Card className="bg-[#1E293B] border-white/5 py-20 text-center space-y-4 shadow-2xl">
            <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto">
               <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-white">All Caught Up!</h3>
            <p className="text-gray-500 max-w-sm mx-auto">There are no pending seller applications to review at this time.</p>
          </Card>
        ) : (
          <div className="grid gap-6">
            {sellers.map((seller) => (
              <Card key={seller.id} className="bg-[#1E293B] border-white/5 shadow-xl overflow-hidden group hover:border-primary/20 transition-all">
                <div className="flex flex-col lg:flex-row">
                  <div className="p-8 lg:w-2/3 space-y-8">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-5">
                        <div className="h-16 w-16 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center text-primary shrink-0">
                          <Store className="h-8 w-8" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-2xl font-black text-white tracking-tight">{seller.business_name || "Personal Seller"}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-400 font-medium">
                            <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {seller.first_name} {seller.last_name}</span>
                            <span className="h-1 w-1 bg-gray-600 rounded-full" />
                            <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" /> {seller.email}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-amber-500/10 text-amber-500 border-none px-3 py-1 font-black uppercase text-[10px] tracking-widest">Awaiting Review</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-[#0F172A]/50 border border-white/5 rounded-xl space-y-3">
                         <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                           <FileText className="h-3 w-3" /> Identification
                         </p>
                         <p className="text-lg font-bold text-white font-mono tracking-wider">{seller.id_number || 'N/A'}</p>
                      </div>
                      <div className="p-4 bg-[#0F172A]/50 border border-white/5 rounded-xl space-y-3">
                         <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                           <AlertCircle className="h-3 w-3" /> Application Date
                         </p>
                         <p className="text-lg font-bold text-white">{new Date(seller.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 lg:w-1/3 bg-[#0F172A]/50 flex flex-col justify-center gap-4 border-t lg:border-t-0 lg:border-l border-white/5">
                    <Button 
                      className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold h-12 gap-2 shadow-lg shadow-emerald-600/10"
                      onClick={() => handleAction(seller.id, 'APPROVE')}
                      disabled={processingId === seller.id}
                    >
                      {processingId === seller.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                      Approve & Activate
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-rose-500/20 text-rose-500 hover:bg-rose-500/10 font-bold h-12 gap-2"
                      onClick={() => handleAction(seller.id, 'REJECT')}
                      disabled={processingId === seller.id}
                    >
                      <XCircle className="h-4 w-4" /> Reject Application
                    </Button>
                    <div className="h-px bg-white/5 my-2" />
                    <Button variant="link" className="text-gray-500 font-bold text-xs gap-1 hover:text-white">
                      View Full Profile <ExternalLink className="h-3 w-3" />
                    </Button>
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
