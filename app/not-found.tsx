'use client';

import Link from 'next/link';
import StorefrontLayout from '@/components/layout/StorefrontLayout';
import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft, PackageSearch } from 'lucide-react';

export default function NotFound() {
  return (
    <StorefrontLayout>
      <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-xl w-full text-center space-y-10">
          
          {/* Visual Indicator */}
          <div className="relative inline-block">
             <div className="h-40 w-40 bg-slate-50 rounded-[3rem] flex items-center justify-center mx-auto shadow-inner border border-slate-100/50">
                <PackageSearch className="h-20 w-20 text-slate-300" />
             </div>
             <div className="absolute -top-4 -right-4 bg-primary text-white font-black text-xl h-14 w-14 rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 rotate-12">
                404
             </div>
          </div>

          {/* Text Content */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              Page <span className="text-primary underline decoration-primary/20 decoration-8 underline-offset-8">Not Found</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-md mx-auto">
              We couldn't find the page you're looking for. It might have been moved, deleted, or never existed in the first place.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
             <Link href="/" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto rounded-2xl font-bold h-14 px-8 gap-2 shadow-xl shadow-primary/10">
                   <Home className="h-5 w-5" /> Back to Home
                </Button>
             </Link>
             <Link href="/products" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-2xl font-bold h-14 px-8 gap-2 border-slate-100 hover:bg-slate-50">
                   <Search className="h-5 w-5" /> Browse Marketplace
                </Button>
             </Link>
          </div>

          {/* Helper Links */}
          <div className="pt-10 flex items-center justify-center gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
             <Link href="/help" className="hover:text-primary transition-colors">Help Center</Link>
             <div className="h-1 w-1 bg-slate-200 rounded-full" />
             <Link href="/support" className="hover:text-primary transition-colors">Report Issue</Link>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
