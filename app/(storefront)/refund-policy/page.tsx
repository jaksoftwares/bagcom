'use client';

import { 
  RefreshCcw, 
  ChevronRight,
  ShieldCheck,
  Clock,
  AlertCircle,
  Undo2,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import StorefrontLayout from '@/components/layout/StorefrontLayout';

export default function RefundPolicyPage() {
  return (
    <StorefrontLayout>
      <div className="bg-[#F9FAFB] min-h-screen pb-20">
        
        {/* Compact Header */}
        <section className="bg-white border-b border-gray-200 py-12">
          <div className="container mx-auto px-4 max-w-4xl space-y-4">
            <nav className="flex items-center gap-1.5 text-[12px] text-gray-500 mb-6">
              <Link href="/legal" className="hover:text-primary transition-colors">Legal Hub</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-gray-900 font-medium">Refund Policy</span>
            </nav>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Refund & Dispute Policy</h1>
            <p className="text-sm text-gray-500 max-w-lg">
              Effective Date: May 10, 2026. This policy explains how we handle returns and escrow disputes.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
             <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                
                {/* Summary Table - Quick Info */}
                <div className="bg-gray-50 border-b border-gray-200 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="flex items-center gap-3">
                      <Undo2 className="h-5 w-5 text-orange-600" />
                      <div className="space-y-0.5">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Returns</p>
                         <p className="text-xs font-bold text-gray-900">Allowed for non-description matches</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5 text-green-600" />
                      <div className="space-y-0.5">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Escrow</p>
                         <p className="text-xs font-bold text-gray-900">Funds frozen during disputes</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div className="space-y-0.5">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Timeline</p>
                         <p className="text-xs font-bold text-gray-900">Dispute within 24h of receipt</p>
                      </div>
                   </div>
                </div>

                {/* Main Policy Body */}
                <div className="p-8 md:p-12 space-y-10">
                   
                   <div className="space-y-4">
                      <h2 className="text-xl font-bold text-gray-900 tracking-tight">1. Dispute Eligibility</h2>
                      <p className="text-sm text-gray-600 leading-relaxed font-medium">
                         Buyers are eligible for a refund if: (a) the item never arrives, (b) the item is significantly not as described, or (c) the item is counterfeit. Disputes must be raised before the buyer confirms receipt in the app.
                      </p>
                   </div>

                   <div className="space-y-4">
                      <h2 className="text-xl font-bold text-gray-900 tracking-tight">2. The Resolution Process</h2>
                      <p className="text-sm text-gray-600 leading-relaxed font-medium">
                         When a dispute is raised, the Escrow payment is frozen. Our team will review photos, descriptions, and chat logs. If the dispute is upheld, the buyer must return the item (at their expense) before the refund is released.
                      </p>
                   </div>

                   <div className="space-y-4">
                      <h2 className="text-xl font-bold text-gray-900 tracking-tight">3. Non-Refundable Items</h2>
                      <p className="text-sm text-gray-600 leading-relaxed font-medium">
                         Refunds are not granted for "buyer's remorse" or for defects that were clearly disclosed in the original listing description or photos.
                      </p>
                   </div>

                   <div className="space-y-4 pt-6 border-t border-gray-100">
                      <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg flex gap-3">
                         <AlertCircle className="h-5 w-5 text-orange-600 shrink-0" />
                         <p className="text-[12px] text-orange-800 font-medium italic">
                            Remember: Never confirm receipt of an item until you have physically inspected it. Once receipt is confirmed, funds are released to the seller and cannot be refunded.
                         </p>
                      </div>
                   </div>

                </div>
             </div>

             <div className="mt-12 text-center">
                <Link href="/legal" className="text-sm font-bold text-primary hover:underline flex items-center justify-center gap-2">
                   <ArrowLeft className="h-4 w-4" /> Back to Legal Hub
                </Link>
             </div>
          </div>
        </section>

      </div>
    </StorefrontLayout>
  );
}
