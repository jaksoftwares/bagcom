'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Github, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ShieldCheck,
  Zap,
  LayoutGrid,
  X
} from 'lucide-react';
import Link from 'next/link';
import { signIn } from '@/services/auth/authService';
import { useRouter } from 'next/navigation';

import Logo from '@/components/shared/Logo';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await signIn({ email, password });
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Invalid login credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Left Side: Form */}
      <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-24 py-12">
        <div className="max-w-md w-full mx-auto space-y-10">
          <div className="space-y-4">
            <Logo className="mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Welcome back</h1>
            <p className="text-base text-muted-foreground font-medium">Enter your details to access your account.</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-sm">
              <p className="text-sm font-bold text-red-600 flex items-center gap-2 italic uppercase">
                <X className="h-4 w-4" /> {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    placeholder="name@example.com" 
                    className="pl-10 h-12 rounded-sm border-border/40 focus-visible:ring-primary/20 bg-muted/5 shadow-none font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Password</Label>
                  <Link href="/forgot-password" className="text-[11px] font-bold text-primary uppercase tracking-widest hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                  <Input 
                    id="password" 
                    name="password"
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••" 
                    className="pl-10 h-12 rounded-sm border-border/40 focus-visible:ring-primary/20 bg-muted/5 shadow-none font-medium"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" className="rounded-sm border-border/40 data-[state=checked]:bg-primary" />
              <label htmlFor="remember" className="text-[13px] font-medium text-muted-foreground cursor-pointer">
                Keep me logged in
              </label>
            </div>

            <Button type="submit" className="w-full h-12 rounded-sm text-[12px] font-bold uppercase tracking-[0.2em]" disabled={isLoading}>
              {isLoading ? 'Authenticating...' : 'Sign In to Bagcom'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/40" />
            </div>
            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
              <span className="bg-white px-4">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-12 rounded-lg border-border/60 font-semibold text-sm gap-2">
               <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </Button>
            <Button variant="outline" className="h-12 rounded-lg border-border/60 font-semibold text-sm gap-2">
              <Github className="h-4 w-4" />
              Github
            </Button>
          </div>

          <p className="text-center text-sm font-medium text-muted-foreground pt-4">
            Don't have an account? <Link href="/register" className="text-primary font-bold hover:underline">Join for free</Link>
          </p>
        </div>
      </div>

      {/* Right Side: Visual Content */}
      <div className="hidden lg:block relative overflow-hidden bg-muted/5 p-12">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="relative h-full flex flex-col justify-between border-l border-border/10 pl-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="h-1.5 w-12 bg-primary rounded-full" />
               <span className="text-xs font-bold uppercase tracking-widest text-primary">Modern Marketplace</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-tight">
              Join the largest <br /> local economy
            </h2>
            <div className="pt-8 max-w-sm">
              <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                Connect with thousands of local traders in a modern, secure marketplace.
              </p>
            </div>
          </div>

          <div className="relative aspect-video rounded-sm border border-border/40 overflow-hidden shadow-2xl">
            <img 
              src="https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=800"
              className="w-full h-full object-cover"
              alt="Students in library"
            />
            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
          </div>
        </div>
      </div>
    </div>
  );
}

