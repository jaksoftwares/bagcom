'use client';

import { 
  ShieldCheck, 
  CheckCircle2, 
  Truck, 
  RotateCcw,
  Users,
  Award
} from 'lucide-react';

export default function MarketplaceTrustBanner() {
  const trustPoints = [
    {
      icon: ShieldCheck,
      title: "Escrow Protection",
      desc: "Funds held securely until delivery",
      color: "text-blue-500"
    },
    {
      icon: CheckCircle2,
      title: "Verified Community",
      desc: "Trusted and vetted local members",
      color: "text-emerald-500"
    },
    {
      icon: Truck,
      title: "Safe Pickup",
      desc: "Campus & mall meeting points",
      color: "text-amber-500"
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      desc: "Protection against inaccurate items",
      color: "text-rose-500"
    }
  ];

  return (
    <div className="bg-white border-y border-border/20 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {trustPoints.map((point, idx) => (
            <div key={idx} className="flex items-start gap-4 group">
              <div className="h-12 w-12 rounded-md bg-muted/20 flex items-center justify-center shrink-0">
                <point.icon className={`h-5 w-5 ${point.color}`} />
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground mb-1">{point.title}</h4>
                <p className="text-[11px] font-medium text-muted-foreground leading-relaxed uppercase tracking-tight">{point.desc}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Social Proof */}
        <div className="mt-16 pt-16 border-t border-border/20 flex flex-col md:flex-row items-center justify-between gap-10">
           <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                 {[1, 2, 3, 4].map(i => (
                   <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-muted/20 flex items-center justify-center overflow-hidden grayscale opacity-80">
                      <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" className="h-full w-full object-cover" />
                   </div>
                 ))}
                 <div className="h-10 w-10 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[9px] font-bold text-white">
                    +2K
                 </div>
              </div>
              <p className="text-sm font-semibold text-muted-foreground">
                 Trusted by <span className="text-foreground font-bold">2,400+ members</span> across the community.
              </p>
           </div>
           
           <div className="flex items-center gap-8 opacity-40">
              <div className="flex items-center gap-2">
                 <Users className="h-4 w-4" />
                 <span className="text-[9px] font-bold uppercase tracking-widest">Active Community</span>
              </div>
              <div className="flex items-center gap-2">
                 <Award className="h-4 w-4" />
                 <span className="text-[9px] font-bold uppercase tracking-widest">Secure Payments</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
