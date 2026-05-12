'use client';

import { 
  ShieldCheck, 
  UserCheck, 
  AlertTriangle, 
  ChevronRight, 
  Clock,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import StorefrontLayout from '@/components/layout/StorefrontLayout';

export default function GuidelinesPage() {
  const lastUpdated = "May 10, 2026";

  return (
    <StorefrontLayout>
      <div className="bg-[#F9FAFB] min-h-screen pb-20">
        
        {/* Compact Header */}
        <section className="bg-white border-b border-gray-200 py-12">
          <div className="container mx-auto px-4 max-w-4xl space-y-4">
            <nav className="flex items-center gap-1.5 text-[12px] text-gray-500 mb-6">
              <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-gray-900 font-medium tracking-tight">Community Rules</span>
            </nav>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Community Guidelines</h1>
            <p className="text-sm text-gray-500 max-w-lg leading-relaxed">
              Professional standards and rules of conduct for all Bagcom marketplace members. Effective: {lastUpdated}.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
             <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                
                {/* The Golden Rule Banner */}
                <div className="bg-amber-50 border-b border-amber-100 p-8 space-y-3">
                   <div className="flex items-center gap-2 text-amber-800 font-bold">
                      <AlertTriangle className="h-5 w-5" /> The Golden Rule
                   </div>
                   <p className="text-[15px] text-amber-900 font-medium italic leading-relaxed">
                      "Treat every buyer and seller with respect. Honesty is the currency of Bagcom. Any attempt to deceive or harm another community member will result in a permanent ban."
                   </p>
                </div>

                {/* Guidelines Body */}
                <div className="p-8 md:p-12 space-y-12">
                   
                   <div className="space-y-4">
                      <h2 className="text-xl font-bold text-gray-900 tracking-tight">1. Honesty in Listings</h2>
                      <p className="text-sm text-gray-600 leading-relaxed font-medium">
                         Sellers must provide accurate descriptions and real photos of their items. Disclose any defects, wear, or damage clearly. Use your own photos, not stock images from the internet.
                      </p>
                   </div>

                   <div className="space-y-4">
                      <h2 className="text-xl font-bold text-gray-900 tracking-tight">2. Communication Standards</h2>
                      <p className="text-sm text-gray-600 leading-relaxed font-medium">
                         Keep all trade-related conversations within the Bagcom chat. This ensures we can help you if a dispute arises. Be polite and professional in all messages.
                      </p>
                   </div>

                   <div className="space-y-4">
                      <h2 className="text-xl font-bold text-gray-900 tracking-tight">3. Fair Trading & Payments</h2>
                      <p className="text-sm text-gray-600 leading-relaxed font-medium">
                         Honor your commitments. If you agree to a price or a meetup, show up on time. Do not attempt to bypass the Escrow system to avoid service fees.
                      </p>
                   </div>

                   {/* Footer Action */}
                   <div className="pt-10 border-t border-gray-100 flex flex-col items-center gap-6">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Seen a violation?</p>
                      <Button asChild className="h-11 px-8 rounded-lg font-bold gap-2 bg-amber-600 hover:bg-amber-700 text-white border-none shadow-lg shadow-amber-100">
                         <Link href="/contact"><AlertTriangle className="h-4 w-4" /> Report Violation</Link>
                      </Button>
                   </div>

                </div>
             </div>

             <div className="mt-12 text-center">
                <Link href="/about" className="text-sm font-bold text-primary hover:underline flex items-center justify-center gap-2">
                   <ArrowLeft className="h-4 w-4" /> Back to Company Info
                </Link>
             </div>
          </div>
        </section>

      </div>
    </StorefrontLayout>
  );
}
