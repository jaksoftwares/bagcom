'use client';

import { 
  FileText, 
  ChevronRight,
  ShieldCheck,
  Lock,
  Eye,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import StorefrontLayout from '@/components/layout/StorefrontLayout';

export default function PrivacyPolicyPage() {
  return (
    <StorefrontLayout>
      <div className="bg-[#F9FAFB] min-h-screen pb-20">
        
        {/* Compact Header */}
        <section className="bg-white border-b border-gray-200 py-12">
          <div className="container mx-auto px-4 max-w-4xl space-y-4">
            <nav className="flex items-center gap-1.5 text-[12px] text-gray-500 mb-6">
              <Link href="/legal" className="hover:text-primary transition-colors">Legal Hub</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-gray-900 font-medium">Privacy Policy</span>
            </nav>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Privacy Policy</h1>
            <p className="text-sm text-gray-500 max-w-lg">
              Effective Date: May 10, 2026. This policy explains how we handle your data.
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
                      <ShieldCheck className="h-5 w-5 text-green-600" />
                      <div className="space-y-0.5">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Security</p>
                         <p className="text-xs font-bold text-gray-900">End-to-end encryption</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <Eye className="h-5 w-5 text-blue-600" />
                      <div className="space-y-0.5">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Transparency</p>
                         <p className="text-xs font-bold text-gray-900">No selling of personal data</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <Lock className="h-5 w-5 text-gray-600" />
                      <div className="space-y-0.5">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Rights</p>
                         <p className="text-xs font-bold text-gray-900">Request data deletion anytime</p>
                      </div>
                   </div>
                </div>

                {/* Main Policy Body */}
                <div className="p-8 md:p-12 prose prose-sm max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-600 prose-p:leading-relaxed space-y-10">
                   
                   <div className="space-y-4">
                      <h2 className="text-xl font-bold text-gray-900 tracking-tight">1. Data We Collect</h2>
                      <p className="text-sm text-gray-600 leading-relaxed font-medium">
                         To provide a secure marketplace, we collect information you provide directly to us (name, email, phone) and transaction data (items bought/sold, M-PESA transaction IDs). We do not store your raw M-PESA credentials.
                      </p>
                   </div>

                   <div className="space-y-4">
                      <h2 className="text-xl font-bold text-gray-900 tracking-tight">2. How We Use Your Data</h2>
                      <p className="text-sm text-gray-600 leading-relaxed font-medium">
                         We use your information to facilitate escrow payments, verify identity to prevent scams, and provide customer support. We may also use anonymized data to improve marketplace search and discovery.
                      </p>
                   </div>

                   <div className="space-y-4 pt-6 border-t border-gray-100">
                      <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg flex gap-3">
                         <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                         <p className="text-[12px] text-amber-800 font-medium italic">
                            Note: Verification documents (Student IDs/National IDs) are encrypted and stored separately. Only authorized compliance officers have access for verification purposes.
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
