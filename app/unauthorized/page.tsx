'use client';

import { ShieldAlert, ArrowLeft, Home, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Logo from '@/components/shared/Logo';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        {/* Icon */}
        <div className="relative flex justify-center">
          <div className="h-24 w-24 bg-red-50 rounded-full flex items-center justify-center border border-red-100 shadow-sm animate-pulse">
            <ShieldAlert className="h-12 w-12 text-red-500" />
          </div>
          <div className="absolute -top-2 -right-2 h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-md border border-border/40">
            <Lock className="h-4 w-4 text-primary" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Access Denied</h1>
          <p className="text-muted-foreground font-medium leading-relaxed">
            You don't have permission to access the requested resource. 
            The admin panel is reserved for authorized personnel only.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full h-12 gap-2 font-bold uppercase tracking-widest text-[11px] border-border/60">
              <Home className="h-4 w-4" /> Go to Home
            </Button>
          </Link>
          <Link href="/login" className="flex-1">
            <Button className="w-full h-12 gap-2 font-bold uppercase tracking-widest text-[11px]">
              <ArrowLeft className="h-4 w-4" /> Sign in as Admin
            </Button>
          </Link>
        </div>

        {/* Support Note */}
        <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] pt-8">
          Reference ID: UNAUTH_403_ACCESS_VIOLATION
        </p>
      </div>
    </div>
  );
}
