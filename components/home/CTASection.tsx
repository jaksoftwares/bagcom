'use client';

import { Button } from '@/components/ui/button';
import { 
  ShoppingBag, 
  Shield, 
  ArrowRight,
  Zap,
  Lock
} from 'lucide-react';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-32 bg-white border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="mb-6 leading-tight">
                Ready to sell your products?
              </h2>
              <p className="text-lg mb-10 max-w-md">
                Join a community of trusted local sellers. List your items in minutes and get paid securely.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/buyer">
                  <Button className="rounded-md bg-primary text-white px-8 py-6 font-semibold shadow-subtle hover:bg-primary/90 transition-all">
                    Start selling
                  </Button>
                </Link>
                <Link href="/products">
                  <Button variant="outline" className="rounded-md px-8 py-6 font-semibold border-border hover:bg-muted/50 transition-all">
                    Browse marketplace
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {[
                { 
                  icon: Shield, 
                  title: 'Secure payments', 
                  desc: 'We use escrow protection to ensure both buyers and sellers are safe.' 
                },
                { 
                  icon: Zap, 
                  title: 'Fast local trading', 
                  desc: 'Find items near you and complete transactions in person or remotely.' 
                },
                { 
                  icon: Lock, 
                  title: 'Privacy first', 
                  desc: 'Your data is encrypted and we never share your personal information.' 
                }
              ].map((feature, i) => (
                <div key={i} className="flex gap-5 group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-md bg-muted/50 flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}