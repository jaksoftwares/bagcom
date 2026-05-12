'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  onAuth: (role: 'admin' | 'seller' | 'buyer') => void;
}

export default function AuthModal({ isOpen, onClose, mode, onAuth }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userRole, setUserRole] = useState<'seller' | 'buyer'>('buyer');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: mode === 'login' ? 'Welcome back' : 'Account created',
        description: mode === 'login' ? 'Successfully logged into your account.' : 'Your marketplace journey starts here.',
      });
      onAuth(userRole);
      onClose();
    }, 800);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-border/40 shadow-medium rounded-md">
        <div className="p-8">
          <DialogHeader className="mb-8 space-y-2">
            <DialogTitle className="text-2xl font-bold text-foreground text-center">
              {mode === 'login' ? 'Log in to Bagcom' : 'Create an account'}
            </DialogTitle>
            <p className="text-muted-foreground text-center text-sm">
              {mode === 'login' ? 'Enter your details below' : 'Join our community of trusted traders'}
            </p>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  className="rounded-md border-border bg-muted/30 focus:bg-white focus:ring-1 focus:ring-primary transition-all"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="rounded-md border-border bg-muted/30 focus:bg-white focus:ring-1 focus:ring-primary transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</Label>
                {mode === 'login' && (
                  <button type="button" className="text-xs font-semibold text-primary hover:underline">Forgot password?</button>
                )}
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="rounded-md border-border bg-muted/30 focus:bg-white focus:ring-1 focus:ring-primary transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {mode === 'signup' && (
              <div className="space-y-3 pt-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">I want to...</Label>
                <RadioGroup 
                  value={userRole} 
                  onValueChange={(value) => setUserRole(value as 'seller' | 'buyer')}
                  className="grid grid-cols-2 gap-3"
                >
                  <div className={`flex items-center justify-center py-2 px-4 rounded-md border transition-all cursor-pointer text-sm font-medium ${userRole === 'buyer' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/30'}`}>
                    <RadioGroupItem value="buyer" id="buyer" className="sr-only" />
                    <Label htmlFor="buyer" className="cursor-pointer">Buy items</Label>
                  </div>
                  <div className={`flex items-center justify-center py-2 px-4 rounded-md border transition-all cursor-pointer text-sm font-medium ${userRole === 'seller' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/30'}`}>
                    <RadioGroupItem value="seller" id="seller" className="sr-only" />
                    <Label htmlFor="seller" className="cursor-pointer">Sell items</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            <Button type="submit" className="w-full py-6 rounded-md bg-primary text-white font-semibold text-sm shadow-subtle hover:bg-primary/90 transition-all mt-4" disabled={loading}>
              {loading ? 'Processing...' : mode === 'login' ? 'Log in' : 'Create account'}
            </Button>
            
            <div className="text-center text-sm text-muted-foreground pt-2">
              {mode === 'login' ? (
                <span>Don't have an account? <button type="button" className="text-primary font-semibold hover:underline">Sign up</button></span>
              ) : (
                <span>Already have an account? <button type="button" className="text-primary font-semibold hover:underline">Log in</button></span>
              )}
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}