'use client';

import { 
  FileText, 
  ChevronRight,
  ShieldCheck,
  Scale,
  AlertCircle,
  Gavel
} from 'lucide-react';
import Link from 'next/link';
import StorefrontLayout from '@/components/layout/StorefrontLayout';

export default function TermsOfServicePage() {
  return (
    <StorefrontLayout>
      <div className="bg-[#F9FAFB] min-h-screen pb-20">
        
        {/* Compact Header */}
        <section className="bg-white border-b border-gray-200 py-12">
          <div className="container mx-auto px-4 max-w-4xl space-y-4">
            <nav className="flex items-center gap-1.5 text-[12px] text-gray-500 mb-6">
              <Link href="/legal" className="hover:text-primary transition-colors">Legal Hub</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-gray-900 font-medium">Terms of Service</span>
            </nav>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Terms of Service</h1>
            <p className="text-sm text-gray-500 max-w-lg">
              Last Updated: May 10, 2026. These terms govern your use of the Bagcom marketplace.
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
                      <Scale className="h-5 w-5 text-blue-600" />
                      <div className="space-y-0.5">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Agreement</p>
                         <p className="text-xs font-bold text-gray-900">Legally binding contract</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5 text-green-600" />
                      <div className="space-y-0.5">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Protection</p>
                         <p className="text-xs font-bold text-gray-900">Escrow policy included</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <Gavel className="h-5 w-5 text-gray-600" />
                      <div className="space-y-0.5">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Resolution</p>
                         <p className="text-xs font-bold text-gray-900">Arbitration required</p>
                      </div>
                   </div>
                </div>

                {/* Main Policy Body */}
                <div className="p-8 md:p-12 space-y-10">
                   
                   <div className="space-y-4">
                      <h2 className="text-xl font-bold text-gray-900 tracking-tight">1. Acceptance of Terms</h2>
                      <p className="text-sm text-gray-600 leading-relaxed font-medium">
                         By accessing or using Bagcom, you agree to be bound by these Terms of Service. If you do not agree to all terms, you may not use the marketplace. These terms apply to all visitors, users, and others who access the service.
                      </p>
                   </div>

                   <div className="space-y-4">
                      <h2 className="text-xl font-bold text-gray-900 tracking-tight">2. Marketplace Transactions</h2>
                      <p className="text-sm text-gray-600 leading-relaxed font-medium">
                         Bagcom provides a platform for buyers and sellers to interact. We utilize a secure Escrow system for all payments. Sellers are responsible for accurate item descriptions, and buyers are responsible for inspecting items before releasing escrow funds.
                      </p>
                   </div>

                   <div className="space-y-4">
                      <h2 className="text-xl font-bold text-gray-900 tracking-tight">3. Prohibited Conduct</h2>
                      <p className="text-sm text-gray-600 leading-relaxed font-medium">
                         Users may not list illegal items, harass other members, or attempt to circumvent the Bagcom escrow system by requesting direct payments. Violation of these rules will result in immediate account suspension.
                      </p>
                   </div>

                   <div className="space-y-4 pt-6 border-t border-gray-100">
                      <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3">
                         <AlertCircle className="h-5 w-5 text-blue-600 shrink-0" />
                         <p className="text-[12px] text-blue-800 font-medium italic">
                            For specific details on payments and seller payouts, please refer to our Escrow Guide and Refund Policy in the Legal Hub.
                         </p>
                      </div>
                   </div>

                </div>
             </div>

             <div className="mt-12 text-center">
                <Link href="/legal" className="text-sm font-bold text-primary hover:underline">
                   Back to Legal Hub
                </Link>
             </div>
          </div>
        </section>

      </div>
    </StorefrontLayout>
  );
}
