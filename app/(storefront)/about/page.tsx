'use client';

import { 
  Building, 
  Target, 
  Users, 
  ShieldCheck, 
  Briefcase, 
  ChevronRight,
  ArrowRight,
  MapPin,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import StorefrontLayout from '@/components/layout/StorefrontLayout';

export default function CompanyHubPage() {
  return (
    <StorefrontLayout>
      <div className="bg-[#F9FAFB] min-h-screen pb-20">
        
        {/* Simplified Header */}
        <section className="bg-white border-b border-gray-200 py-12">
          <div className="container mx-auto px-4 max-w-4xl space-y-4">
            <nav className="flex items-center gap-1.5 text-[12px] text-gray-500 mb-6">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-gray-900 font-medium">About Bagcom</span>
            </nav>
            <h1 className="text-[32px] md:text-5xl font-bold text-gray-900 tracking-tight text-center md:text-left">Building Kenya's Trusted Student Marketplace</h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto md:mx-0 font-medium">
              Bagcom is a peer-to-peer commerce platform designed to make buying and selling pre-owned items secure, local, and sustainable.
            </p>
          </div>
        </section>

        {/* Mission & Pillars - Functional */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-3 gap-10">
               {[
                 { 
                   title: "Trust First", 
                   desc: "We built the first escrow-based student marketplace in Kenya to eliminate scams and payment anxiety.",
                   icon: ShieldCheck,
                   color: "text-primary bg-primary/5"
                 },
                 { 
                   title: "Community Growth", 
                   desc: "By enabling local trade, we keep resources within student communities and support sustainable consumption.",
                   icon: Users,
                   color: "text-primary bg-primary/5"
                 },
                 { 
                   title: "Marketplace Innovation", 
                   desc: "We leverage modern tech like M-PESA Express and verification systems to solve real-world commerce problems.",
                   icon: Target,
                   color: "text-primary bg-primary/5"
                 }
               ].map((pillar) => (
                 <div key={pillar.title} className="bg-white border border-gray-100 rounded-xl p-8 space-y-5 hover:border-primary/20 transition-all shadow-sm">
                    <div className={`h-12 w-12 ${pillar.color} rounded-lg flex items-center justify-center border border-white`}>
                       <pillar.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">{pillar.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed font-medium">{pillar.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* Careers Section - Practical */}
        <section className="py-20 border-t border-gray-200 bg-white">
          <div className="container mx-auto px-4 max-w-4xl space-y-12">
             <div className="text-center md:text-left space-y-3">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Join the Team</h2>
                <p className="text-gray-500 text-base font-medium">We're looking for passionate individuals to help us redefine local commerce.</p>
             </div>
             
             <div className="grid gap-4">
                {[
                  { role: "Backend Engineer", dept: "Engineering", location: "Nairobi / Remote" },
                  { role: "Community Manager", dept: "Operations", location: "Nairobi" },
                  { role: "Product Designer", dept: "Design", location: "Remote" }
                ].map((job) => (
                  <div key={job.role} className="group p-6 bg-white border border-gray-100 rounded-xl hover:border-primary/20 hover:bg-gray-50 transition-all flex items-center justify-between cursor-pointer">
                     <div className="space-y-1.5">
                        <h4 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors tracking-tight">{job.role}</h4>
                        <div className="flex items-center gap-4 text-xs text-gray-400 font-bold uppercase tracking-widest">
                           <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" /> {job.dept}</span>
                           <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                        </div>
                     </div>
                     <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
                  </div>
                ))}
             </div>
             
             <div className="pt-6 text-center">
                <p className="text-xs text-gray-400 italic">Don't see a role? Send your CV to careers@bagcom.co.ke</p>
             </div>
          </div>
        </section>

        {/* Community Rules Preview */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
             <div className="bg-gray-900 rounded-2xl p-8 md:p-12 text-center space-y-8 relative overflow-hidden">
                <div className="relative z-10 space-y-3">
                   <h2 className="text-2xl font-bold text-white tracking-tight">Our Community Rules</h2>
                   <p className="text-gray-400 text-sm max-w-sm mx-auto">Every Bagcom user agrees to our professional trading standards and code of conduct.</p>
                </div>
                <div className="flex justify-center relative z-10">
                   <Button variant="outline" asChild className="h-11 px-8 rounded-lg font-bold border-gray-700 text-white hover:bg-white/5">
                      <Link href="/guidelines">Read Community Rules</Link>
                   </Button>
                </div>
                <div className="absolute top-0 left-0 h-full w-1/3 bg-white/5 skew-x-12 -translate-x-1/2" />
             </div>
          </div>
        </section>

      </div>
    </StorefrontLayout>
  );
}
