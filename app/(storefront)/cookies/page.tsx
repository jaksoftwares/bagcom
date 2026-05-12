'use client';

import { 
  FileCode, 
  ChevronRight,
  ShieldCheck,
  Eye,
  Info,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import StorefrontLayout from '@/components/layout/StorefrontLayout';

export default function CookiePolicyPage() {
  return (
    <StorefrontLayout>
      <div className="bg-[#F9FAFB] min-h-screen pb-20">
        
        {/* Compact Header */}
        <section className="bg-white border-b border-gray-200 py-12">
          <div className="container mx-auto px-4 max-w-4xl space-y-4">
            <nav className="flex items-center gap-1.5 text-[12px] text-gray-500 mb-6">
              <Link href="/legal" className="hover:text-primary transition-colors">Legal Hub</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-gray-900 font-medium tracking-tight">Cookie Policy</span>
            </nav>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Cookie Policy</h1>
            <p className="text-sm text-gray-500 max-w-lg">
              Last Updated: May 10, 2026. This policy explains how we use cookies to improve your marketplace experience.
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
                         <p className="text-xs font-bold text-gray-900">Essential session cookies only</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <Eye className="h-5 w-5 text-blue-600" />
                      <div className="space-y-0.5">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Preference</p>
                         <p className="text-xs font-bold text-gray-900">Remembers your login & theme</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <FileCode className="h-5 w-5 text-gray-600" />
                      <div className="space-y-0.5">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Tracking</p>
                         <p className="text-xs font-bold text-gray-900">No 3rd-party tracking cookies</p>
                      </div>
                   </div>
                </div>

                {/* Main Policy Body */}
                <div className="p-8 md:p-12 space-y-10">
                   
                   <div className="space-y-4">
                      <h2 className="text-xl font-bold text-gray-900 tracking-tight">1. What are Cookies?</h2>
                      <p className="text-sm text-gray-600 leading-relaxed font-medium">
                         Cookies are small text files stored on your device that help us recognize you and remember your preferences. They are essential for keeping you logged in and ensuring the marketplace functions correctly.
                      </p>
                   </div>

                   <div className="space-y-4">
                      <h2 className="text-xl font-bold text-gray-900 tracking-tight">2. Essential Cookies</h2>
                      <p className="text-sm text-gray-600 leading-relaxed font-medium">
                         We use essential cookies to manage user sessions and authentication. Without these cookies, you would not be able to stay logged in or access your dashboard securely.
                      </p>
                   </div>

                   <div className="space-y-4">
                      <h2 className="text-xl font-bold text-gray-900 tracking-tight">3. Managing Your Choices</h2>
                      <p className="text-sm text-gray-600 leading-relaxed font-medium">
                         You can choose to disable cookies through your browser settings. However, please note that disabling essential cookies will prevent you from using the marketplace's core features like buying and selling.
                      </p>
                   </div>

                   <div className="space-y-4 pt-6 border-t border-gray-100">
                      <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3">
                         <Info className="h-5 w-5 text-blue-600 shrink-0" />
                         <p className="text-[12px] text-blue-800 font-medium italic">
                            Bagcom is committed to a clean, tracking-free experience. We do not use advertising or marketing tracking cookies.
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
