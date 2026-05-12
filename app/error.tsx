'use client';

import { useEffect } from 'react';
import StorefrontLayout from '@/components/layout/StorefrontLayout';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Home, AlertCircle, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Platform Runtime Error:', error);
  }, [error]);

  return (
    <StorefrontLayout>
      <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-xl w-full text-center space-y-10">
          
          {/* Visual Indicator */}
          <div className="relative inline-block">
             <div className="h-40 w-40 bg-rose-50 rounded-[3rem] flex items-center justify-center mx-auto shadow-inner border border-rose-100/50">
                <ShieldAlert className="h-20 w-20 text-rose-200" />
             </div>
             <div className="absolute -top-4 -right-4 bg-rose-500 text-white font-black text-xl h-14 w-14 rounded-2xl flex items-center justify-center shadow-xl shadow-rose-500/20 -rotate-12">
                ERR
             </div>
          </div>

          {/* Text Content */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              Something <span className="text-rose-500 underline decoration-rose-500/20 decoration-8 underline-offset-8">Went Wrong</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-md mx-auto">
              We've encountered an unexpected error. Our team has been notified and we're working to get things back to normal.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
             <Button 
               size="lg" 
               onClick={() => reset()}
               className="w-full sm:w-auto rounded-2xl font-bold h-14 px-10 gap-3 bg-slate-900 shadow-xl shadow-slate-900/10 hover:bg-primary transition-all"
             >
                <RefreshCcw className="h-5 w-5" /> Try Again
             </Button>
             <Link href="/" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-2xl font-bold h-14 px-10 gap-2 border-slate-100 hover:bg-slate-50">
                   <Home className="h-5 w-5" /> Go Home
                </Button>
             </Link>
          </div>

          {/* Error Reference */}
          <div className="pt-10 space-y-2">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">System Fault Record</p>
             <code className="text-[11px] bg-slate-50 px-4 py-2 rounded-lg text-slate-400 font-mono border border-slate-100">
               {error.digest || 'Internal platform reference ID not generated'}
             </code>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
