'use client';

import { 
  UserCheck, 
  ShieldCheck, 
  IdCard, 
  CheckCircle2, 
  ArrowRight,
  ChevronRight,
  Smartphone,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import StorefrontLayout from '@/components/layout/StorefrontLayout';

export default function VerificationPage() {
  return (
    <StorefrontLayout>
      <div className="bg-[#F9FAFB] min-h-screen pb-20">
        
        {/* Simplified Header */}
        <section className="bg-white border-b border-gray-200 py-12">
          <div className="container mx-auto px-4 max-w-4xl text-center space-y-4">
            <nav className="flex items-center justify-center gap-1.5 text-[12px] text-gray-500 mb-6">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-gray-900 font-medium">Get Verified</span>
            </nav>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Become a Verified Seller</h1>
            <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
              Build trust, sell faster, and unlock premium features by verifying your identity on Bagcom.
            </p>
          </div>
        </section>

        {/* The Verification Badge - Trust Element */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
             <div className="bg-blue-600 rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="h-20 w-20 bg-white/10 rounded-full flex items-center justify-center border border-white/20 shrink-0 relative z-10">
                   <UserCheck className="h-10 w-10 text-white" />
                </div>
                <div className="space-y-3 relative z-10">
                   <h2 className="text-2xl font-bold tracking-tight">The Verification Badge</h2>
                   <p className="text-blue-100 text-[15px] leading-relaxed max-w-md">
                      Verified sellers get a blue checkmark on their profile and listings. This tells buyers you are a trusted and legitimate member of the community.
                   </p>
                </div>
                {/* Visual accent */}
                <div className="absolute top-0 right-0 h-full w-1/4 bg-white/5 -skew-x-12 translate-x-1/2" />
             </div>
          </div>
        </section>

        {/* How to Verify - Step Guide */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
             <h3 className="text-xl font-bold text-gray-900 mb-8 text-center md:text-left">Three Simple Steps</h3>
             <div className="grid md:grid-cols-3 gap-6">
                {[
                  { 
                    title: "Phone Verification", 
                    desc: "Verify your phone number via OTP to ensure we can reach you for order updates.",
                    icon: Smartphone
                  },
                  { 
                    title: "Identity Check", 
                    desc: "Upload a photo of your Student ID or National ID for our team to review securely.",
                    icon: IdCard
                  },
                  { 
                    title: "Profile Polish", 
                    desc: "Add a clear profile photo and complete your bio to build further trust with buyers.",
                    icon: CheckCircle2
                  }
                ].map((step, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                     <div className="h-10 w-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-600 border border-gray-100 font-bold text-sm">
                        {i + 1}
                     </div>
                     <h4 className="font-bold text-gray-900">{step.title}</h4>
                     <p className="text-[13px] text-gray-500 leading-relaxed font-medium">{step.desc}</p>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* Benefits - Functional List */}
        <section className="py-12 bg-white border-y border-gray-200">
           <div className="container mx-auto px-4 max-w-4xl">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                 <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Why get verified?</h3>
                    <div className="space-y-4">
                       {[
                         "Appear higher in search results",
                         "Increase buyer confidence and sales",
                         "Higher withdrawal limits for payouts",
                         "Access to seller protection programs",
                         "Dedicated premium support line"
                       ].map((benefit) => (
                         <div key={benefit} className="flex items-center gap-3">
                            <ShieldCheck className="h-5 w-5 text-green-500 shrink-0" />
                            <span className="text-sm text-gray-600 font-medium">{benefit}</span>
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 space-y-6">
                    <div className="space-y-2">
                       <h4 className="font-bold text-gray-900">Ready to start?</h4>
                       <p className="text-sm text-gray-500">Identity verification usually takes less than 24 hours.</p>
                    </div>
                    <Button className="w-full h-12 rounded-lg font-bold shadow-lg shadow-primary/20">
                       Start Verification
                    </Button>
                    <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                       <Lock className="h-3 w-3" /> Secure & Encrypted
                    </div>
                 </div>
              </div>
           </div>
        </section>

      </div>
    </StorefrontLayout>
  );
}
