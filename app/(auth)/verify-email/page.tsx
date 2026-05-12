'use client';

import { Mail, ArrowLeft, CheckCircle2, ChevronRight, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Logo from '@/components/shared/Logo';

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFF] px-4 sm:px-6">
      <div className="max-w-xl w-full text-center space-y-12">
        
        {/* Logo Section */}
        <div className="flex justify-center">
          <Link href="/">
             <Logo className="h-10 w-auto" />
          </Link>
        </div>

        {/* Visual Identity Section */}
        <div className="relative inline-block">
           <div className="h-44 w-44 bg-slate-50 rounded-[3.5rem] flex items-center justify-center mx-auto shadow-inner border border-slate-100/50">
              <Inbox className="h-20 w-20 text-primary/20" />
           </div>
           <div className="absolute -top-4 -right-4 bg-primary text-white h-16 w-16 rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-primary/30 rotate-12 animate-in zoom-in duration-700">
              <Mail className="h-8 w-8" />
           </div>
           <div className="absolute -bottom-2 -left-2 h-8 w-8 bg-emerald-500 rounded-full border-4 border-white shadow-lg animate-pulse" />
        </div>

        {/* Content Section */}
        <div className="space-y-6">
          <div className="space-y-2">
             <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-4">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Account Registration
             </div>
             <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-[1.1]">
               Check Your <span className="text-primary underline decoration-primary/20 decoration-8 underline-offset-8">Inbox</span>
             </h1>
          </div>
          <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-md mx-auto">
            We've sent a verification link to your email. Please click the link to confirm your account and start trading on the marketplace.
          </p>
        </div>

        {/* Action Engine */}
        <div className="max-w-sm mx-auto space-y-6 pt-4">
          <Button 
            className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-primary text-white font-bold text-sm shadow-2xl shadow-slate-900/10 transition-all gap-3" 
            asChild
          >
            <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer">
              Open My Mailbox <ChevronRight className="h-4 w-4 opacity-50" />
            </a>
          </Button>
          
          <div className="space-y-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Didn't receive the email?</p>
            <Button variant="link" className="text-xs font-black text-primary uppercase tracking-[0.2em] h-auto p-0 hover:no-underline hover:text-slate-900 transition-colors">
               Resend Verification Code
            </Button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="pt-12 border-t border-slate-100 max-w-xs mx-auto">
           <Link href="/login" className="inline-flex items-center gap-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest hover:text-primary transition-all group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Login
           </Link>
        </div>

        {/* Subtle Brand Watermark */}
        <div className="pt-8 opacity-20 pointer-events-none">
           <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-300">Bagcom Secure Authentication</p>
        </div>
      </div>
    </div>
  );
}
