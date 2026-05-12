'use client';

import { 
  ShieldCheck, 
  ChevronRight,
  FileText,
  Scale,
  ShieldAlert,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import StorefrontLayout from '@/components/layout/StorefrontLayout';

export default function LegalHubPage() {
  return (
    <StorefrontLayout>
      <div className="bg-[#F9FAFB] min-h-screen pb-20">
        
        {/* Simplified Header */}
        <section className="bg-white border-b border-gray-200 py-12">
          <div className="container mx-auto px-4 max-w-4xl space-y-4">
            <nav className="flex items-center gap-1.5 text-[12px] text-gray-500 mb-6">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-gray-900 font-medium">Legal Hub</span>
            </nav>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Legal & Privacy Center</h1>
            <p className="text-sm text-gray-500 max-w-lg leading-relaxed">
              Transparent policies governing how we operate, how we protect your data, and your rights as a Bagcom user.
            </p>
          </div>
        </section>

        {/* Legal Grid - Task Oriented */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-6">
               
               {/* Terms of Service */}
               <Link href="/terms" className="group bg-white border border-gray-200 rounded-xl p-8 hover:border-primary/20 hover:shadow-sm transition-all flex flex-col justify-between">
                  <div className="space-y-4">
                     <div className="h-10 w-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 group-hover:bg-primary/5 transition-colors">
                        <Scale className="h-5 w-5 text-gray-600 group-hover:text-primary transition-colors" />
                     </div>
                     <div className="space-y-2">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">Terms of Service</h3>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium">
                           The rules and agreements governing your use of our platform and marketplace services.
                        </p>
                     </div>
                  </div>
                  <div className="mt-6 flex items-center text-[12px] font-bold text-primary uppercase tracking-widest gap-2">
                     Read Terms <ChevronRight className="h-3 w-3" />
                  </div>
               </Link>

               {/* Privacy Policy */}
               <Link href="/privacy" className="group bg-white border border-gray-200 rounded-xl p-8 hover:border-primary/20 hover:shadow-sm transition-all flex flex-col justify-between">
                  <div className="space-y-4">
                     <div className="h-10 w-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 group-hover:bg-primary/5 transition-colors">
                        <ShieldCheck className="h-5 w-5 text-gray-600 group-hover:text-primary transition-colors" />
                     </div>
                     <div className="space-y-2">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">Privacy Policy</h3>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium">
                           How we collect, use, and protect your personal information and data rights.
                        </p>
                     </div>
                  </div>
                  <div className="mt-6 flex items-center text-[12px] font-bold text-primary uppercase tracking-widest gap-2">
                     Read Policy <ChevronRight className="h-3 w-3" />
                  </div>
               </Link>

               {/* Refund Policy */}
               <Link href="/refund-policy" className="group bg-white border border-gray-200 rounded-xl p-8 hover:border-primary/20 hover:shadow-sm transition-all flex flex-col justify-between">
                  <div className="space-y-4">
                     <div className="h-10 w-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 group-hover:bg-primary/5 transition-colors">
                        <RefreshCw className="h-5 w-5 text-gray-600 group-hover:text-primary transition-colors" />
                     </div>
                     <div className="space-y-2">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">Refund & Dispute Policy</h3>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium">
                           Our guidelines for handling returns, marketplace disputes, and escrow refunds.
                        </p>
                     </div>
                  </div>
                  <div className="mt-6 flex items-center text-[12px] font-bold text-primary uppercase tracking-widest gap-2">
                     Read Policy <ChevronRight className="h-3 w-3" />
                  </div>
               </Link>

               {/* Community Guidelines */}
               <Link href="/guidelines" className="group bg-white border border-gray-200 rounded-xl p-8 hover:border-primary/20 hover:shadow-sm transition-all flex flex-col justify-between">
                  <div className="space-y-4">
                     <div className="h-10 w-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 group-hover:bg-primary/5 transition-colors">
                        <ShieldAlert className="h-5 w-5 text-gray-600 group-hover:text-primary transition-colors" />
                     </div>
                     <div className="space-y-2">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">Community Guidelines</h3>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium">
                           Professional standards and rules of conduct for all Bagcom marketplace members.
                        </p>
                     </div>
                  </div>
                  <div className="mt-6 flex items-center text-[12px] font-bold text-primary uppercase tracking-widest gap-2">
                     Read Guidelines <ChevronRight className="h-3 w-3" />
                  </div>
               </Link>

            </div>
          </div>
        </section>

        {/* Disclaimer / Compliance Footnote */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl text-center">
             <p className="text-[12px] text-gray-400 font-medium leading-relaxed">
                These documents constitute a legally binding agreement between you and Bagcom. By using our platform, you acknowledge that you have read and agreed to these terms. Last updated: May 10, 2026.
             </p>
          </div>
        </section>

      </div>
    </StorefrontLayout>
  );
}
