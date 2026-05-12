'use client';

import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full text-center space-y-10">
        {/* Logo */}
        <Link href="/" className="inline-block">
          <div className="flex items-center gap-2 group mx-auto">
             <div className="w-10 h-10 bg-primary rounded-sm flex items-center justify-center text-white font-black text-xl">B</div>
             <span className="text-2xl font-black tracking-tighter uppercase group-hover:text-primary transition-colors">Bagcom</span>
          </div>
        </Link>

        {/* Visual Icon */}
        <div className="relative">
          <div className="h-24 w-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto relative z-10">
             <Mail className="h-10 w-10 text-primary animate-bounce" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 bg-primary/5 rounded-full animate-ping opacity-20" />
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">Check Your <span className="text-primary">Inbox</span></h1>
          <p className="text-muted-foreground font-medium text-lg">
            We've sent a verification link to your email. Please click the link to confirm your account and start trading.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4 pt-6">
          <Button className="w-full h-12 rounded-sm text-[12px] font-bold uppercase tracking-[0.2em]" asChild>
            <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer">Open Gmail</a>
          </Button>
          
          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-medium text-muted-foreground">Didn't receive the email?</p>
            <button className="text-[11px] font-black text-primary uppercase tracking-[0.2em] hover:underline">Resend Verification Link</button>
          </div>
        </div>

        {/* Footer Link */}
        <div className="pt-8 border-t border-border/40">
           <Link href="/login" className="inline-flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors">
              <ArrowLeft className="h-3 w-3" /> Back to Login
           </Link>
        </div>
      </div>
    </div>
  );
}
