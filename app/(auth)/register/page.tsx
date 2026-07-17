'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Store,
  GraduationCap,
  Phone,
  MapPin,
  Building,
  User as UserIcon,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { signUp, signInWithGoogle } from '@/services/auth/authService';
import { useRouter } from 'next/navigation';

import Logo from '@/components/shared/Logo';
import DocumentUploadDropzone from '@/components/ui/DocumentUploadDropzone';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [userRole, setUserRole] = useState<'BUYER' | 'SELLER'>('BUYER');
  const [sellerType, setSellerType] = useState<'INDIVIDUAL' | 'BUSINESS'>('INDIVIDUAL');
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  const router = useRouter();

  const uploadToCloudinary = async (file: File): Promise<string> => {
    // 1. Get Signature from our API
    const sigRes = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder: 'bagcom_documents' })
    });
    
    if (!sigRes.ok) throw new Error('Failed to generate upload signature');
    const { signature, timestamp, cloudName, apiKey, folder } = await sigRes.json();

    // 2. Upload directly to Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('folder', folder);

    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: 'POST',
      body: formData
    });

    if (!uploadRes.ok) throw new Error('Failed to upload document');
    const data = await uploadRes.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirm_password') as string;
    const first_name = formData.get('first_name') as string;
    const last_name = formData.get('last_name') as string;
    const terms = formData.get('terms');

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!terms) {
      setError("You must agree to the Terms of Service to continue.");
      return;
    }

    if (userRole === 'SELLER' && !documentFile) {
      setError("An official identification document is required to register as a seller.");
      return;
    }

    setIsLoading(true);

    try {
      let documentUrl = '';
      if (documentFile) {
        documentUrl = await uploadToCloudinary(documentFile);
      }

      const signupData: any = { 
        email, 
        password, 
        first_name, 
        last_name, 
        role: userRole 
      };

      if (userRole === 'SELLER') {
        signupData.seller_type = sellerType;
        signupData.phone_number = formData.get('phone_number') as string;
        signupData.city = formData.get('city') as string;
        signupData.planned_categories = formData.get('planned_categories') as string;
        signupData.store_description = formData.get('store_description') as string;
        signupData.physical_address = formData.get('physical_address') as string;

        if (sellerType === 'BUSINESS') {
          signupData.business_name = formData.get('business_name') as string;
          signupData.business_registration_number = formData.get('business_registration_number') as string;
          signupData.business_certificate_url = documentUrl;
        } else {
          signupData.id_number = formData.get('id_number') as string;
          signupData.id_document_url = documentUrl;
        }
      }

      await signUp(signupData);
      router.push('/verify-email');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your network and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
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
               className={`p-4 border rounded-sm text-left transition-all relative overflow-hidden group ${userRole === 'SELLER' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border/40 hover:border-border'}`}
             >
                <div className={`h-8 w-8 rounded-sm flex items-center justify-center mb-2 ${userRole === 'SELLER' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground group-hover:bg-muted/20'}`}>
                   <Store className="h-4 w-4" />
                </div>
                <p className="text-sm font-bold text-foreground mb-1">Seller Account</p>
                <p className="text-xs text-muted-foreground font-medium">I want to list and sell items</p>
                {userRole === 'SELLER' && <div className="absolute top-2 right-2 h-1.5 w-1.5 bg-primary rounded-full" />}
             </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-sm flex items-start gap-3">
               <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
               <p className="text-[12px] font-bold text-red-600 leading-tight">
                 {error}
               </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">First Name</Label>
                <Input id="first_name" name="first_name" placeholder="Jane" className="h-12 rounded-sm border-border/40 focus-visible:ring-primary/20 bg-muted/5 font-medium" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Last Name</Label>
                <Input id="last_name" name="last_name" placeholder="Doe" className="h-12 rounded-sm border-border/40 focus-visible:ring-primary/20 bg-muted/5 font-medium" required />
              </div>
            </div>

            {userRole === 'SELLER' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="pt-4 border-t border-border/40">
                  <p className="text-sm font-bold text-foreground mb-4">Select Seller Type</p>
                  <div className="flex gap-4">
                    <label className={`flex-1 flex items-center gap-3 p-4 border rounded-sm cursor-pointer transition-colors ${sellerType === 'INDIVIDUAL' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border/40 hover:bg-muted/10'}`}>
                      <input type="radio" name="sellerType" value="INDIVIDUAL" checked={sellerType === 'INDIVIDUAL'} onChange={() => setSellerType('INDIVIDUAL')} className="sr-only" />
                      <UserIcon className={`h-5 w-5 ${sellerType === 'INDIVIDUAL' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="text-sm font-bold">Individual</span>
                    </label>
                    <label className={`flex-1 flex items-center gap-3 p-4 border rounded-sm cursor-pointer transition-colors ${sellerType === 'BUSINESS' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border/40 hover:bg-muted/10'}`}>
                      <input type="radio" name="sellerType" value="BUSINESS" checked={sellerType === 'BUSINESS'} onChange={() => setSellerType('BUSINESS')} className="sr-only" />
                      <Building className={`h-5 w-5 ${sellerType === 'BUSINESS' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="text-sm font-bold">Business</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {sellerType === 'BUSINESS' ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="business_name" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Registered Business Name</Label>
                        <Input id="business_name" name="business_name" placeholder="e.g. Joy's Electronics Ltd" className="h-12 rounded-sm border-border/40 focus-visible:ring-primary/20 bg-muted/5 font-medium" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="business_registration_number" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Business Registration Number</Label>
                        <Input id="business_registration_number" name="business_registration_number" placeholder="e.g. PVT-XXXXXX" className="h-12 rounded-sm border-border/40 focus-visible:ring-primary/20 bg-muted/5 font-medium" required />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="id_number" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">National ID Number</Label>
                      <Input id="id_number" name="id_number" placeholder="ID Number" className="h-12 rounded-sm border-border/40 focus-visible:ring-primary/20 bg-muted/5 font-medium" required />
                    </div>
                  )}

                  <div className="pt-4 pb-2">
                    <div className="mb-4 bg-blue-50/50 p-4 border border-blue-100 rounded-sm">
                      <p className="text-xs text-blue-800 leading-relaxed font-medium">
                        To ensure our marketplace remains safe and secure for the entire community, please provide an official document that identifies you or your business.
                      </p>
                    </div>
                    <DocumentUploadDropzone 
                      onFileSelect={setDocumentFile}
                      label={sellerType === 'BUSINESS' ? 'Business Registration Certificate' : 'Official Identification Document (Scan)'}
                      description="Upload a clear PDF, JPG, or PNG. Maximum file size 5MB."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone_number" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">M-PESA Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                        <Input id="phone_number" name="phone_number" placeholder="0712345678" className="pl-10 h-12 rounded-sm border-border/40 focus-visible:ring-primary/20 bg-muted/5 font-medium" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">City / Town</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                        <Input id="city" name="city" placeholder="e.g. Nairobi" className="pl-10 h-12 rounded-sm border-border/40 focus-visible:ring-primary/20 bg-muted/5 font-medium" required />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="planned_categories" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">What do you plan to sell?</Label>
                    <Input id="planned_categories" name="planned_categories" placeholder="e.g. Smartphones, Laptops, Fashion" className="h-12 rounded-sm border-border/40 focus-visible:ring-primary/20 bg-muted/5 font-medium" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store_description" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Short Store Description</Label>
                    <Input id="store_description" name="store_description" placeholder="Tell us about what you offer..." className="h-12 rounded-sm border-border/40 focus-visible:ring-primary/20 bg-muted/5 font-medium" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="physical_address" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Physical Address / Pickup Location</Label>
                    <Input id="physical_address" name="physical_address" placeholder="Building, Street, Room Number" className="h-12 rounded-sm border-border/40 focus-visible:ring-primary/20 bg-muted/5 font-medium" required />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4 pt-4 border-t border-border/40">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                  <Input id="email" name="email" type="email" placeholder="jane@example.com" className="pl-10 h-12 rounded-sm border-border/40 focus-visible:ring-primary/20 bg-muted/5 font-medium" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                    <Input 
                      id="password" 
                      name="password"
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="Min. 8 chars" 
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
                <div className="space-y-2">
                  <Label htmlFor="confirm_password" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                    <Input 
                      id="confirm_password" 
                      name="confirm_password"
                      type={showConfirmPassword ? 'text' : 'password'} 
                      placeholder="Min. 8 chars" 
                      className="pl-10 h-12 rounded-sm border-border/40 focus-visible:ring-primary/20 bg-muted/5 font-medium"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 pt-2">
              <Checkbox id="terms" name="terms" required className="mt-1 rounded-sm border-border/40 data-[state=checked]:bg-primary" />
              <label htmlFor="terms" className="text-[12px] text-muted-foreground leading-relaxed cursor-pointer font-medium">
                I agree to the <Link href="/terms" className="text-primary font-bold hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary font-bold hover:underline">Privacy Policy</Link>. I confirm that the information provided is accurate and authentic.
              </label>
            </div>

            <Button type="submit" className="w-full h-12 rounded-sm text-[12px] font-bold uppercase tracking-[0.2em]" disabled={isLoading}>
              {isLoading ? (userRole === 'SELLER' ? 'Authenticating Documents...' : 'Creating Account...') : `Join as ${userRole === 'SELLER' ? 'Seller' : 'Buyer'}`}
            </Button>
          </form>

          {userRole === 'BUYER' && (
            <div className="space-y-4 pt-4 border-t border-border/40">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/40" />
                </div>
                <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                  <span className="bg-white px-4">Or continue with</span>
                </div>
              </div>

              <Button 
                type="button"
                variant="outline" 
                className="w-full h-12 rounded-sm border-border/60 font-semibold text-sm gap-2"
                onClick={async () => {
                  try {
                    await signInWithGoogle();
                  } catch (err: any) {
                    setError(err.message || 'Google sign up failed');
                  }
                }}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </Button>
            </div>
          )}

          <p className="text-center text-[13px] font-medium text-muted-foreground pt-2">
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
              src="https://images.pexels.com/photos/1036856/pexels-photo-1036856.jpeg?auto=compress&cs=tinysrgb&w=800"
              className="w-full h-full object-cover"
              alt="Kenyan merchants collaborating"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
