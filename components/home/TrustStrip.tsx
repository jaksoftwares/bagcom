'use client';

import { ShieldCheck, Truck, RefreshCcw } from 'lucide-react';

export default function TrustStrip() {
  const features = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: 'Secure Escrow',
      description: 'Funds held safely until delivery'
    },
    {
      icon: <Truck className="h-6 w-6 text-primary" />,
      title: 'Fast Campus Delivery',
      description: 'Get your items within hours'
    },
    {
      icon: <RefreshCcw className="h-6 w-6 text-primary" />,
      title: 'Easy Returns',
      description: 'Hassle-free 24h return policy'
    }
  ];

  return (
    <div className="bg-white border-y border-border/40 py-6">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-border/40">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center justify-center gap-4 py-4 md:py-0 px-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                {feature.icon}
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">{feature.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
