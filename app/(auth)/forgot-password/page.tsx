'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { resetPassword } from '@/services/auth/authService';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full space-y-10">
        <div className="text-center space-y-4">
          <Link href="/" className="inline-block">
            <div className="flex items-center gap-2 group">
               <div className="w-10 h-10 bg-primary rounded-sm flex items-center justify-center text-white font-black text-xl">B</div>
               <span className="text-2xl font-black tracking-tighter uppercase group-hover:text-primary transition-colors">Bagcom</span>
            </div>
          </Link>
          <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">Reset <span className="text-primary">Access</span></h1>
          <p className="text-muted-foreground font-medium">Enter your email to receive a password recovery link.</p>
        </div>

        {isSubmitted ? (
          <div className="bg-primary/5 border border-primary/10 rounded-sm p-8 text-center space-y-6 animate-in fade-in zoom-in duration-500">
             <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="h-8 w-8 text-primary" />
             </div>
             <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">Email Sent!</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  We've sent a recovery link to your inbox. Please follow the instructions to reset your password.
                </p>
             </div>
             <Button variant="outline" className="w-full h-12 rounded-sm font-bold uppercase tracking-widest" asChild>
                <Link href="/login">Back to Login</Link>
             </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Verification Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  placeholder="name@university.edu" 
                  className="pl-10 h-12 rounded-sm border-border/40 focus-visible:ring-primary/20 bg-muted/5 shadow-none font-medium"
                  required
                />
              </div>
            </div>

            {error && <p className="text-xs font-bold text-red-600 uppercase italic tracking-wider">{error}</p>}

            <Button type="submit" className="w-full h-12 rounded-sm text-[12px] font-bold uppercase tracking-[0.2em]" disabled={isLoading}>
              {isLoading ? 'Sending Link...' : 'Send Recovery Link'}
            </Button>
          </form>
        )}

        <div className="pt-6 border-t border-border/40 text-center">
           <Link href="/login" className="inline-flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors">
              <ArrowLeft className="h-3 w-3" /> Back to Sign In
           </Link>
        </div>
      </div>
    </div>
  );
}
