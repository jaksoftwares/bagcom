'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Lock, 
  ArrowRightLeft, 
  User, 
  CreditCard,
  Hash,
  ExternalLink,
  History,
  FileText,
  Smartphone,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase/client';

interface TransactionDetailDrawerProps {
  transactionId: string | null;
  onClose: () => void;
}

export default function TransactionDetailDrawer({ transactionId, onClose }: TransactionDetailDrawerProps) {
  const [transaction, setTransaction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (transactionId) {
      fetchTransactionDetails();
    } else {
      setTransaction(null);
    }
  }, [transactionId]);

  const fetchTransactionDetails = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('escrow_transactions')
        .select(`
          *,
          order:orders(
            *,
            buyer:users!orders_buyer_id_fkey(*),
            seller:users!orders_seller_id_fkey(*),
            payouts(*)
          )
        `)
        .eq('id', transactionId)
        .single();

      if (error) throw error;
      setTransaction(data);
    } catch (e) {
      console.error('Failed to load transaction');
    } finally {
      setIsLoading(false);
    }
  };

  if (!transactionId) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[100] transition-opacity duration-500 ${transactionId ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl z-[101] transform transition-transform duration-500 ease-out border-l border-border/40 ${transactionId ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-8 border-b border-border/40 flex justify-between items-center bg-muted/5">
             <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Transaction Details</p>
                <h2 className="text-xl font-bold text-foreground tracking-tight uppercase tracking-widest">
                   {transaction?.id?.slice(0, 8) || 'Loading...'}
                </h2>
             </div>
             <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white transition-colors">
                <X className="h-4 w-4" />
             </Button>
          </div>

          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Loading...</p>
            </div>
          ) : transaction && (
            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
               {/* Financial Summary */}
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white border border-slate-200 rounded-none">
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Escrow Value</p>
                     <p className="text-xl font-bold text-slate-900 tracking-tight">KSh {transaction.held_amount?.toLocaleString()}</p>
                  </div>
                  <div className="p-6 bg-white border border-slate-200 rounded-none">
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                     <p className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">{transaction.escrow_status}</p>
                  </div>
               </div>

               {/* Parties Section */}
               <div className="space-y-6">
                  <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2">Transaction Parties</p>
                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Buyer</p>
                        <div className="space-y-0.5">
                           <p className="text-[11px] font-bold text-slate-900">{transaction.order?.buyer?.first_name} {transaction.order?.buyer?.last_name}</p>
                           <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">{transaction.order?.buyer?.phone_number}</p>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Seller</p>
                        <div className="space-y-0.5">
                           <p className="text-[11px] font-bold text-slate-900">{transaction.order?.seller?.business_name || `${transaction.order?.seller?.first_name} ${transaction.order?.seller?.last_name}`}</p>
                           <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">{transaction.order?.seller?.phone_number}</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* M-Pesa Record */}
               <div className="space-y-6">
                  <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2">M-Pesa Record</p>
                  <div className="border border-slate-200 rounded-none p-6 space-y-4">
                     <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Receipt Number</span>
                        <span className="text-[11px] font-mono font-bold text-slate-900">{transaction.mpesa_receipt || 'PENDING'}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Pay-in Ref</span>
                        <span className="text-[9px] font-mono text-slate-400 truncate max-w-[200px]">{transaction.mpesa_checkout_id || 'N/A'}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">B2C Payout Status</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900">
                           {transaction.order?.payouts?.[0]?.status || 'NOT_INITIATED'}
                        </span>
                     </div>
                  </div>
               </div>

               {/* Audit Timeline */}
               <div className="space-y-6">
                  <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2">Transaction Timeline</p>
                  <div className="space-y-6 relative ml-2 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
                     <div className="relative pl-6">
                        <div className="absolute left-[-2.5px] top-1.5 h-1.5 w-1.5 bg-slate-900 rounded-full" />
                        <p className="text-[10px] font-bold text-slate-900 uppercase tracking-tight">Funds Deposited</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                           {new Date(transaction.held_at).toLocaleString()}
                        </p>
                     </div>
                     {transaction.released_at && (
                       <div className="relative pl-6">
                          <div className="absolute left-[-2.5px] top-1.5 h-1.5 w-1.5 bg-slate-900 rounded-full" />
                          <p className="text-[10px] font-bold text-slate-900 uppercase tracking-tight">Escrow Released</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                             {new Date(transaction.released_at).toLocaleString()}
                          </p>
                       </div>
                     )}
                     <div className="relative pl-6">
                        <div className="absolute left-[-2.5px] top-1.5 h-1.5 w-1.5 bg-slate-200 rounded-full" />
                        <p className="text-[10px] font-bold text-slate-900 uppercase tracking-tight">Status Update</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                           {transaction.escrow_status}
                        </p>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="p-8 border-t border-slate-200 flex gap-4">
             <Button variant="outline" className="flex-1 h-12 font-bold text-[10px] uppercase tracking-widest border-slate-200 rounded-none" onClick={onClose}>
                Close
             </Button>
             {transaction?.order?.id && (
               <Button className="flex-1 h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-widest rounded-none shadow-none" onClick={() => window.open(`/admin/orders/${transaction.order.id}`)}>
                  View Order
               </Button>
             )}
          </div>
        </div>
      </div>
    </>
  );
}
