'use client';

import { 
  ShieldCheck, 
  Lock, 
  ArrowRight,
  ChevronRight,
  CreditCard,
  UserCheck,
  PackageCheck,
  Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import StorefrontLayout from '@/components/layout/StorefrontLayout';

export default function EscrowPage() {
  return (
    <StorefrontLayout>
      <div className="bg-[#F9FAFB] min-h-screen pb-20">
        
        {/* Page Header */}
        <section className="bg-white border-b border-gray-200 py-12">
          <div className="container mx-auto px-4 max-w-4xl text-center space-y-4">
            <nav className="flex items-center justify-center gap-1.5 text-[12px] text-gray-500 mb-6">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-gray-900 font-medium tracking-tight">Escrow Protection</span>
            </nav>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Escrow Protection Service</h1>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">
              How we protect your money and ensure a fair trade for every buyer and seller.
            </p>
          </div>
        </section>

        {/* How it Works - Visual Step Process */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid md:grid-cols-3 gap-0 relative">
               {/* Connecting line for desktop */}
               <div className="absolute top-1/2 left-0 w-full h-px bg-gray-200 -translate-y-1/2 hidden md:block" />
               
               {[
                 { 
                   title: "Payment Held", 
                   desc: "Buyer pays for the item. Bagcom holds the funds in a secure escrow account.",
                   icon: Lock,
                   color: "bg-blue-50 text-blue-600"
                 },
                 { 
                   title: "Item Exchanged", 
                   desc: "Buyer and seller meet or ship. Buyer inspects the item thoroughly.",
                   icon: PackageCheck,
                   color: "bg-orange-50 text-orange-600"
                 },
                 { 
                   title: "Funds Released", 
                   desc: "Buyer confirms receipt in the app. Bagcom releases payment to the seller.",
                   icon: Wallet,
                   color: "bg-green-50 text-green-600"
                 }
               ].map((step, i) => (
                 <div key={i} className="relative z-10 flex flex-col items-center text-center px-8 py-4">
                    <div className={`h-16 w-16 ${step.color} rounded-2xl flex items-center justify-center mb-6 border border-white shadow-lg`}>
                       <step.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-[13px] text-gray-500 leading-relaxed font-medium">
                       {step.desc}
                    </p>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* Protection Details - Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-200 p-8 rounded-xl space-y-6">
                <h3 className="text-xl font-bold text-gray-900">For Buyers</h3>
                <div className="space-y-4">
                   <div className="flex gap-4">
                      <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-0.5">
                         <ShieldCheck className="h-3 w-3 text-white" />
                      </div>
                      <p className="text-sm text-gray-600 font-medium">Money-back guarantee if the item isn't delivered.</p>
                   </div>
                   <div className="flex gap-4">
                      <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-0.5">
                         <ShieldCheck className="h-3 w-3 text-white" />
                      </div>
                      <p className="text-sm text-gray-600 font-medium">Secure payment via M-PESA Express – no cash handling.</p>
                   </div>
                   <div className="flex gap-4">
                      <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-0.5">
                         <ShieldCheck className="h-3 w-3 text-white" />
                      </div>
                      <p className="text-sm text-gray-600 font-medium">Ability to dispute and freeze payments if an item is faulty.</p>
                   </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-8 rounded-xl space-y-6">
                <h3 className="text-xl font-bold text-gray-900">For Sellers</h3>
                <div className="space-y-4">
                   <div className="flex gap-4">
                      <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                         <UserCheck className="h-3 w-3 text-white" />
                      </div>
                      <p className="text-sm text-gray-600 font-medium">Verify that the buyer has the funds before you meet.</p>
                   </div>
                   <div className="flex gap-4">
                      <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                         <UserCheck className="h-3 w-3 text-white" />
                      </div>
                      <p className="text-sm text-gray-600 font-medium">Eliminate "buyer's remorse" or late payment excuses.</p>
                   </div>
                   <div className="flex gap-4">
                      <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                         <UserCheck className="h-3 w-3 text-white" />
                      </div>
                      <p className="text-sm text-gray-600 font-medium">Build trust and sell faster with the "Escrow Protected" badge.</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Critical Disclaimer */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
             <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex gap-4">
                <ShieldCheck className="h-6 w-6 text-amber-600 shrink-0" />
                <div className="space-y-1">
                   <p className="font-bold text-amber-900 text-[14px]">Important Marketplace Rule</p>
                   <p className="text-amber-800 text-[13px] leading-relaxed">
                      Always complete your transactions within the Bagcom app. If a buyer or seller asks you to pay directly via M-PESA or cash, report them immediately. We cannot protect or refund payments made outside our system.
                   </p>
                </div>
             </div>
          </div>
        </section>

      </div>
    </StorefrontLayout>
  );
}
