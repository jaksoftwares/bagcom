'use client';

import { 
  Code, 
  Palette, 
  LineChart, 
  Users, 
  MapPin, 
  ArrowRight,
  Briefcase,
  Star,
  Globe,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import StorefrontLayout from '@/components/layout/StorefrontLayout';

const jobs = [
  { 
    title: "Senior Full Stack Engineer", 
    department: "Engineering", 
    location: "Remote / Nairobi",
    type: "Full-time",
    icon: Code 
  },
  { 
    title: "Product Designer (UI/UX)", 
    department: "Design", 
    location: "Remote / Nairobi",
    type: "Full-time",
    icon: Palette 
  },
  { 
    title: "Growth Marketing Manager", 
    department: "Marketing", 
    location: "Remote",
    type: "Full-time",
    icon: LineChart 
  }
];

export default function CareersPage() {
  return (
    <StorefrontLayout>
      <div className="bg-[#F9FAFB] min-h-screen">
        {/* Simplified Header */}
        <section className="bg-white border-b border-gray-200 py-12">
          <div className="container mx-auto px-4 max-w-4xl space-y-4">
            <nav className="flex items-center gap-1.5 text-[12px] text-gray-500 mb-6">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-gray-900 font-medium tracking-tight">Careers</span>
            </nav>
            <h1 className="text-[32px] md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
               Build the future of <span className="text-primary italic">local commerce</span>
            </h1>
            <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-2xl">
               We're a fast-growing team reimagining how communities trade. Join us in building Kenya's most trusted student marketplace.
            </p>
          </div>
        </section>

        {/* Why Join Us - Functional Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8">
               {[
                 { title: "Ownership", icon: Star, desc: "We empower every team member to take lead on high-impact projects from day one." },
                 { title: "Remote-First", icon: Globe, desc: "Work from anywhere. We value results and well-being over hours in an office." },
                 { title: "Impact", icon: Users, desc: "Your work directly helps thousands of local traders secure their livelihoods." }
               ].map((value, i) => (
                 <div key={i} className="bg-white border border-gray-200 rounded-xl p-8 space-y-5 hover:border-primary/20 transition-all shadow-sm">
                    <div className="h-11 w-11 bg-primary/5 rounded-lg flex items-center justify-center text-primary border border-white shrink-0">
                       <value.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">{value.title}</h3>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">{value.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* Open Positions - Practical List */}
        <section className="py-16 border-t border-gray-200 bg-white">
          <div className="container mx-auto px-4 max-w-4xl space-y-12">
             <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="space-y-2">
                   <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Open Roles</h2>
                   <p className="text-gray-500 font-medium">Find your place in the Bagcom team.</p>
                </div>
                <div className="bg-gray-100 px-4 py-1.5 rounded-full border border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-widest">
                   {jobs.length} Positions Available
                </div>
             </div>

             <div className="grid gap-4">
                {jobs.map((job, i) => (
                  <div key={i} className="group bg-white p-6 rounded-xl border border-gray-100 hover:border-primary/20 hover:bg-gray-50 transition-all flex flex-col md:flex-row md:items-center gap-6 cursor-pointer">
                     <div className="h-11 w-11 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all shrink-0 border border-white">
                        <job.icon className="h-5 w-5" />
                     </div>
                     <div className="flex-1 space-y-1">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors tracking-tight">{job.title}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                           <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                           <span className="h-3 w-px bg-gray-200 hidden sm:block" />
                           <span className="text-primary/80">{job.department}</span>
                        </div>
                     </div>
                     <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
                  </div>
                ))}
             </div>

             <div className="pt-10 text-center space-y-6">
                <p className="text-gray-400 text-[13px] font-medium italic">Don't see a role that fits? We're always looking for talented individuals.</p>
                <Button variant="outline" asChild className="h-11 px-10 rounded-lg font-bold border-gray-200">
                   <Link href="/contact">General Application</Link>
                </Button>
             </div>
          </div>
        </section>

        {/* Culture Section - Balanced Layout */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-6xl grid lg:grid-cols-2 gap-16 items-center">
             <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-200">
                <img 
                  src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  className="w-full h-full object-cover" 
                  alt="Team culture"
                />
             </div>
             <div className="space-y-8">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Our Culture</h2>
                <p className="text-lg text-gray-500 font-medium leading-relaxed">
                   We believe in radical transparency, extreme ownership, and a bias for action. At Bagcom, your voice matters, and your contributions define the trajectory of the marketplace.
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
                   <div className="p-6 bg-white border border-gray-100 rounded-xl space-y-2">
                      <h4 className="font-bold text-gray-900">Weekly Synced</h4>
                      <p className="text-[13px] text-gray-500 font-medium">We stay aligned through global syncs and open communication.</p>
                   </div>
                   <div className="p-6 bg-white border border-gray-100 rounded-xl space-y-2">
                      <h4 className="font-bold text-gray-900">Learning Budget</h4>
                      <p className="text-[13px] text-gray-500 font-medium">We invest in your growth with dedicated tool allowances.</p>
                   </div>
                </div>
             </div>
          </div>
        </section>
      </div>
    </StorefrontLayout>
  );
}
