'use client';

import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import Logo from '../shared/Logo';

export default function Footer() {
  return (
    <footer className="bg-foreground text-white border-t border-white/5">
      <div className="container mx-auto px-4 sm:px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 sm:gap-16">
          {/* Brand & Mission */}
          <div className="md:col-span-4 lg:col-span-5 space-y-6">
            <Logo variant="dark" className="h-8 w-auto" />
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              A modern trusted marketplace for buying and selling second-hand goods locally. Built with security and community in mind.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="text-white/40 hover:text-white transition-colors">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Grid */}
          <div className="md:col-span-8 lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-10">
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">Marketplace</h3>
              <ul className="space-y-3">
                <li><Link href="/products" className="text-sm text-white/60 hover:text-white transition-colors">Browse Products</Link></li>
                <li><Link href="/categories" className="text-sm text-white/60 hover:text-white transition-colors">All Categories</Link></li>
                <li><Link href="/safety" className="text-sm text-white/60 hover:text-white transition-colors">Trust & Safety</Link></li>
                <li><Link href="/escrow" className="text-sm text-white/60 hover:text-white transition-colors">Escrow Protection</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">Support</h3>
              <ul className="space-y-3">
                <li><Link href="/help" className="text-sm text-white/60 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/faq" className="text-sm text-white/60 hover:text-white transition-colors">FAQs</Link></li>
                <li><Link href="/contact" className="text-sm text-white/60 hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/verification" className="text-sm text-white/60 hover:text-white transition-colors">Get Verified</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">Company</h3>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-sm text-white/60 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="text-sm text-white/60 hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/guidelines" className="text-sm text-white/60 hover:text-white transition-colors">Community Rules</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">Legal</h3>
              <ul className="space-y-3">
                <li><Link href="/terms" className="text-sm text-white/60 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-sm text-white/60 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/refund-policy" className="text-sm text-white/60 hover:text-white transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-white/40 text-[11px] font-medium">
              © {new Date().getFullYear()} Bagcom Marketplace. Built for trusted local trade.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-[11px] font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest">Privacy</Link>
              <Link href="/terms" className="text-[11px] font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest">Terms</Link>
              <Link href="/cookies" className="text-[11px] font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
