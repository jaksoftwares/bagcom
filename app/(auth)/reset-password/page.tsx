'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { updatePassword } from '@/services/auth/authService';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirm_password') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      await updatePassword(password);
      setIsSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
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
          <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">Set New <span className="text-primary">Secret</span></h1>
          <p className="text-muted-foreground font-medium">Create a strong, secure password for your account.</p>
        </div>

        {isSuccess ? (
          <div className="bg-green-50 border border-green-100 rounded-sm p-8 text-center space-y-6 animate-in fade-in zoom-in duration-500">
             <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
             </div>
             <div className="space-y-2">
                <h3 className="text-xl font-bold text-green-800 uppercase tracking-tight">Security Updated</h3>
                <p className="text-green-700/80 font-medium">
                  Your password has been changed successfully. Redirecting you to login...
                </p>
             </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                  <Input 
                    id="password" 
                    name="password"
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Min. 8 characters" 
                    className="pl-10 h-12 rounded-sm border-border/40 focus-visible:ring-primary/20 bg-muted/5 shadow-none font-medium"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm_password" className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Confirm Security</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                  <Input 
                    id="confirm_password" 
                    name="confirm_password"
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Repeat password" 
                    className="pl-10 h-12 rounded-sm border-border/40 focus-visible:ring-primary/20 bg-muted/5 shadow-none font-medium"
                    required
                  />
                </div>
              </div>
            </div>

            {error && <p className="text-xs font-bold text-red-600 uppercase italic tracking-wider">{error}</p>}

            <Button type="submit" className="w-full h-12 rounded-sm text-[12px] font-bold uppercase tracking-[0.2em]" disabled={isLoading}>
              {isLoading ? 'Updating Security...' : 'Update Password'}
            </Button>
          </form>
        )}

        <div className="pt-6 border-t border-border/40 text-center">
           <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
              <ShieldCheck className="h-3 w-3" /> Secure Password Reset
           </div>
        </div>
      </div>
    </div>
  );
}
