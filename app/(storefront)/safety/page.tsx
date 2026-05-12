'use client';

import { 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  ChevronRight,
  ShieldAlert,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import StorefrontLayout from '@/components/layout/StorefrontLayout';

export default function SafetyHubPage() {
  return (
    <StorefrontLayout>
      <div className="bg-[#F9FAFB] min-h-screen">
        
        {/* Compact Hero */}
        <section className="bg-white border-b border-gray-200 py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <nav className="flex items-center gap-1.5 text-[12px] text-gray-500 mb-6">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-gray-900 font-medium">Trust & Safety</span>
            </nav>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Trust & Safety Center</h1>
              <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
                Everything you need to trade securely on Bagcom. Learn about our protection systems and how to stay safe.
              </p>
            </div>
          </div>
        </section>

        {/* Protection Pillars - Functional Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 p-8 rounded-xl space-y-6">
                <div className="h-12 w-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center border border-green-100">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-gray-900">Escrow Protection</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    We hold your payment securely until you receive and inspect your item. Your money is safe with us until the trade is confirmed.
                  </p>
                  <Button variant="link" asChild className="p-0 text-primary font-bold h-auto">
                    <Link href="/escrow">How Escrow works <ArrowRight className="h-3 w-3 ml-1" /></Link>
                  </Button>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-8 rounded-xl space-y-6">
                <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center border border-blue-100">
                  <UserCheck className="h-6 w-6" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-gray-900">Verified Sellers</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Look for the blue checkmark. Verified sellers have completed a full identity check to ensure they are real people you can trust.
                  </p>
                  <Button variant="link" asChild className="p-0 text-primary font-bold h-auto">
                    <Link href="/verification">About verification <ArrowRight className="h-3 w-3 ml-1" /></Link>
                  </Button>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-8 rounded-xl space-y-6">
                <div className="h-12 w-12 bg-red-50 text-red-600 rounded-lg flex items-center justify-center border border-red-100">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-gray-900">Fraud Prevention</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Our team monitors listings 24/7. We use advanced technology to detect and remove suspicious activity before it reaches you.
                  </p>
                  <Button variant="link" asChild className="p-0 text-primary font-bold h-auto">
                    <Link href="/support">See safety tips <ArrowRight className="h-3 w-3 ml-1" /></Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Actionable Guides */}
        <section className="py-12 bg-white border-y border-gray-200">
          <div className="container mx-auto px-4 max-w-4xl space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Safe Trading Checklist</h2>
              <p className="text-gray-500 text-sm">Follow these steps for a perfect transaction every time.</p>
            </div>

            <div className="grid gap-4">
              {[
                { title: "Keep it on Bagcom", desc: "Always communicate and pay through our platform to stay protected by our Escrow system." },
                { title: "Meet in Public", desc: "Choose a well-lit, busy public place like a coffee shop or a campus hub for physical exchanges." },
                { title: "Inspect Before Confirming", desc: "Take your time to check the item thoroughly. Don't release the payment until you're 100% satisfied." },
                { title: "Trust Your Gut", desc: "If a deal feels too good to be true or a seller is pressuring you, walk away and report it." }
              ].map((step, i) => (
                <div key={i} className="flex gap-5 p-5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="h-8 w-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-gray-900">{step.title}</h4>
                    <p className="text-[13px] text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reporting Action */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">Seen something suspicious?</h3>
                <p className="text-sm text-gray-500">Report fraudulent listings or users immediately to help keep the community safe.</p>
              </div>
              <Button variant="destructive" className="h-12 px-8 rounded-lg font-bold shadow-lg shadow-red-100">
                Report Incident
              </Button>
            </div>
          </div>
        </section>

      </div>
    </StorefrontLayout>
  );
}
