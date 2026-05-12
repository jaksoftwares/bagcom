'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ShieldCheck,
  Store,
  GraduationCap
} from 'lucide-react';
import Link from 'next/link';
import { signUp } from '@/services/auth/authService';
import { useRouter } from 'next/navigation';

import Logo from '@/components/shared/Logo';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'BUYER' | 'SELLER'>('BUYER');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const first_name = formData.get('first_name') as string;
    const last_name = formData.get('last_name') as string;

    try {
      await signUp({ 
        email, 
        password, 
        first_name, 
        last_name, 
        role: userRole,
        business_name: formData.get('business_name') as string,
        id_number: formData.get('id_number') as string,
        planned_categories: formData.get('planned_categories') as string,
        store_description: formData.get('store_description') as string,
        physical_address: formData.get('physical_address') as string
      });
      // Redirect to verification notice
      router.push('/verify-email');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
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
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Create your account</h1>
            <p className="text-base text-muted-foreground font-medium">Join the trusted marketplace and start trading today.</p>
          </div>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-4">
             <button 
               onClick={() => setUserRole('BUYER')}
               className={`p-4 border rounded-sm text-left transition-all relative overflow-hidden group ${userRole === 'BUYER' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border/40 hover:border-border'}`}
             >
                <div className={`h-8 w-8 rounded-sm flex items-center justify-center mb-2 ${userRole === 'BUYER' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground group-hover:bg-muted/20'}`}>
                   <GraduationCap className="h-4 w-4" />
                </div>
                <p className="text-sm font-bold text-foreground mb-1">Buyer Account</p>
                <p className="text-xs text-muted-foreground font-medium">I want to shop for products</p>
                {userRole === 'BUYER' && <div className="absolute top-2 right-2 h-1.5 w-1.5 bg-primary rounded-full" />}
             </button>

             <button 
               onClick={() => setUserRole('SELLER')}
               className={`p-4 border rounded-lg text-left transition-all relative overflow-hidden group ${userRole === 'SELLER' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border/40 hover:border-border'}`}
             >
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center mb-2 ${userRole === 'SELLER' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground group-hover:bg-muted/20'}`}>
                   <Store className="h-4 w-4" />
                </div>
                <p className="text-sm font-bold text-foreground mb-1">Seller Account</p>
                <p className="text-xs text-muted-foreground font-medium">I want to list and sell items</p>
                {userRole === 'SELLER' && <div className="absolute top-2 right-2 h-1.5 w-1.5 bg-primary rounded-full" />}
             </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-sm italic uppercase text-[11px] font-bold text-red-600">
               {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">First Name</Label>
                <Input id="first_name" name="first_name" placeholder="John" className="h-12 rounded-sm border-border/40 focus-visible:ring-primary/20 bg-muted/5 font-medium" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Last Name</Label>
                <Input id="last_name" name="last_name" placeholder="Doe" className="h-12 rounded-sm border-border/40 focus-visible:ring-primary/20 bg-muted/5 font-medium" required />
              </div>
            </div>

            {userRole === 'SELLER' && (
              <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="business_name" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Shop / Business Name</Label>
                  <Input id="business_name" name="business_name" placeholder="e.g. Joy's Electronics" className="h-12 rounded-sm border-border/40 focus-visible:ring-primary/20 bg-muted/5 font-medium" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="id_number" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">National ID / Passport</Label>
                  <Input id="id_number" name="id_number" placeholder="ID Number" className="h-12 rounded-sm border-border/40 focus-visible:ring-primary/20 bg-muted/5 font-medium" required />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="planned_categories" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">What do you plan to sell?</Label>
                  <Input id="planned_categories" name="planned_categories" placeholder="e.g. Smartphones, Laptops, Fashion" className="h-12 rounded-sm border-border/40 focus-visible:ring-primary/20 bg-muted/5 font-medium" required />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="store_description" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Short Store Description</Label>
                  <Input id="store_description" name="store_description" placeholder="Tell us about your business..." className="h-12 rounded-sm border-border/40 focus-visible:ring-primary/20 bg-muted/5 font-medium" required />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="physical_address" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Physical Address / Pickup Location</Label>
                  <Input id="physical_address" name="physical_address" placeholder="Building, Street, Room Number" className="h-12 rounded-sm border-border/40 focus-visible:ring-primary/20 bg-muted/5 font-medium" required />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                <Input id="email" name="email" type="email" placeholder="john@university.edu" className="pl-10 h-12 rounded-sm border-border/40 focus-visible:ring-primary/20 bg-muted/5 font-medium" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Create Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                <Input 
                  id="password" 
                  name="password"
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Min. 8 characters" 
                  className="pl-10 h-12 rounded-sm border-border/40 focus-visible:ring-primary/20 bg-muted/5 font-medium"
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

            <p className="text-[11px] text-muted-foreground/60 leading-relaxed italic">
              By clicking the button below, you agree to Bagcom's <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>

            <Button type="submit" className="w-full h-12 rounded-sm text-[12px] font-bold uppercase tracking-[0.2em]" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : `Join as ${userRole === 'SELLER' ? 'Seller' : 'Buyer'}`}
            </Button>
          </form>

          <p className="text-center text-[13px] font-medium text-muted-foreground">
            Already have an account? <Link href="/login" className="text-primary font-black hover:underline underline-offset-4">Sign In Instead</Link>
          </p>
        </div>
      </div>

      {/* Right Side: Visual Content */}
      <div className="hidden lg:block relative overflow-hidden bg-muted/5 p-12">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="relative h-full flex flex-col justify-center border-l border-border/10 pl-12 space-y-12">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-tight">
              Start your <br /> <span className="text-primary">journey</span>
            </h2>
            <p className="text-lg text-muted-foreground font-medium max-w-sm leading-relaxed">
              Join a community of thousands trading quality items every day. Bagcom is your partner for secure local trade.
            </p>
          </div>

          <div className="relative aspect-[16/10] rounded-sm border border-border/40 overflow-hidden shadow-2xl">
            <img 
              src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"
              className="w-full h-full object-cover"
              alt="Students collaborating"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
