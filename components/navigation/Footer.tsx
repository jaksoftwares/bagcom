'use client';

import { Facebook, Twitter, Instagram, ShieldCheck, Mail, Phone, MapPin, Send, ArrowRight, Lock } from 'lucide-react';
import Link from 'next/link';
import Logo from '../shared/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Footer() {
  return (
    <footer className="bg-foreground text-white border-t border-white/5">
      
      {/* Newsletter & Trust Strip */}
      <div className="border-b border-white/10 bg-white/5">
        <div className="container mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-2">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" /> Stay in the loop
              </h3>
              <p className="text-white/60 text-sm">Subscribe to our newsletter for exclusive deals, new arrivals, and marketplace tips.</p>
            </div>
            <div className="flex max-w-md w-full lg:ml-auto">
              <Input 
                placeholder="Enter your email address"
                className="rounded-r-none h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:ring-primary focus:border-primary"
              />
              <Button className="rounded-l-none h-12 px-6 bg-primary text-white font-bold hover:bg-primary/90">
                Subscribe <Send className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 sm:gap-16">
          {/* Brand & Mission */}
          <div className="md:col-span-4 lg:col-span-5 space-y-8">
            <Logo variant="dark" className="h-8 w-auto" />
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              A modern trusted marketplace for buying and selling second-hand goods locally. Built with security and community in mind.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3 text-white/60 text-sm">
                 <Phone className="h-4 w-4 text-primary" />
                 <span>+254 700 000 000</span>
              </div>
              <div className="flex items-center gap-3 text-white/60 text-sm">
                 <MapPin className="h-4 w-4 text-primary" />
                 <span>Nairobi, Kenya</span>
              </div>
            </div>

            <div className="flex space-x-4 pt-2">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-primary hover:text-white transition-all">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Grid */}
          <div className="md:col-span-8 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10">
            <div className="space-y-6">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-white">Marketplace</h3>
              <ul className="space-y-3">
                <li><Link href="/products" className="text-sm text-white/60 hover:text-white transition-colors">Browse Products</Link></li>
                <li><Link href="/categories" className="text-sm text-white/60 hover:text-white transition-colors">All Categories</Link></li>
                <li><Link href="/seller" className="text-sm text-white/60 hover:text-white transition-colors">Become a Seller</Link></li>
                <li><Link href="/safety" className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-2"><ShieldCheck className="h-3 w-3" /> Trust & Safety</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-white">Support</h3>
              <ul className="space-y-3">
                <li><Link href="/help" className="text-sm text-white/60 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/faq" className="text-sm text-white/60 hover:text-white transition-colors">FAQs</Link></li>
                <li><Link href="/contact" className="text-sm text-white/60 hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/verification" className="text-sm text-white/60 hover:text-white transition-colors">Get Verified</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-white">Legal</h3>
              <ul className="space-y-3">
                <li><Link href="/terms" className="text-sm text-white/60 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-sm text-white/60 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/refund-policy" className="text-sm text-white/60 hover:text-white transition-colors">Refund Policy</Link></li>
                <li><Link href="/guidelines" className="text-sm text-white/60 hover:text-white transition-colors">Community Rules</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center lg:items-start gap-2">
            <p className="text-white/40 text-[11px] font-medium">
              © {new Date().getFullYear()} Bagcom Marketplace. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-white/30 text-[10px]">
               <Lock className="h-3 w-3" /> Secure SSL Encrypted Checkout
            </div>
          </div>
          
          {/* Trust Badges */}
          <div className="flex items-center gap-4 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
             <img src="https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg" alt="M-Pesa" className="h-6 object-contain bg-white/90 px-2 py-1 rounded" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 object-contain bg-white/90 px-2 py-1 rounded" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6 object-contain bg-white/90 px-2 py-1 rounded" />
          </div>
        </div>
      </div>
    </footer>
  );
}
