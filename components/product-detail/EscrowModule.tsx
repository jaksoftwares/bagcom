'use client';

import { 
  ShieldCheck, 
  Lock, 
  Truck, 
  CheckCircle2, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function EscrowModule() {
  const steps = [
    {
      icon: Lock,
      title: "Secure Payment",
      desc: "Funds held in Bagcom Escrow",
      color: "text-blue-500"
    },
    {
      icon: Truck,
      title: "Item Delivery",
      desc: "Seller ships or meets with you",
      color: "text-amber-500"
    },
    {
      icon: CheckCircle2,
      title: "Confirm & Release",
      desc: "Release funds after inspection",
      color: "text-emerald-500"
    }
  ];

  return (
    <div className="bg-muted/5 rounded-md p-8 border border-border/40 space-y-8 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary/10 rounded-md flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Bagcom Protected</h3>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary mt-1">100% Buyer Protection</p>
          </div>
        </div>
        <TooltipProvider>
           <Tooltip>
              <TooltipTrigger asChild>
                 <button className="text-muted-foreground/30 hover:text-primary transition-colors">
                    <HelpCircle className="h-4 w-4" />
                 </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-[200px] bg-white text-slate-900 border border-border/40 p-3 rounded-md shadow-xl">
                 <p className="text-[11px] font-semibold leading-relaxed">Your money is only released to the seller after you confirm that the item is exactly as described.</p>
              </TooltipContent>
           </Tooltip>
        </TooltipProvider>
      </div>

      {/* Steps Visualization */}
      <div className="grid grid-cols-1 gap-6">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-4 group/step">
             <div className="h-9 w-9 rounded-md bg-white border border-border/20 flex items-center justify-center shrink-0">
                <step.icon className={`h-4 w-4 ${step.color}`} />
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-foreground leading-none">{step.title}</p>
                <p className="text-[10px] font-semibold text-muted-foreground/60 mt-1 uppercase tracking-tighter truncate">{step.desc}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Trust Details */}
      <div className="pt-6 border-t border-border/20 flex items-center justify-between">
         <div className="flex items-center gap-3 opacity-30 grayscale">
            <div className="text-[9px] font-bold uppercase tracking-widest border border-foreground/20 px-1.5 py-0.5 rounded-sm">SSL Secure</div>
            <div className="text-[9px] font-bold uppercase tracking-widest border border-foreground/20 px-1.5 py-0.5 rounded-sm">PCI Ready</div>
         </div>
         <div className="flex items-center gap-1.5 text-primary opacity-60">
            <AlertCircle className="h-3 w-3" />
            <span className="text-[9px] font-bold uppercase tracking-tighter">Verified Policy</span>
         </div>
      </div>
    </div>
  );
}
