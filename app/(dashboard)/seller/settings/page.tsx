'use client';

import { useState, useEffect } from 'react';
import SellerLayout from '@/components/layout/SellerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Store, 
  ShieldCheck, 
  CreditCard, 
  Bell, 
  Lock,
  Loader2,
  Upload,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser, getUserProfile } from '@/services/auth/authService';

export default function SellerSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function loadProfile() {
      const user = await getCurrentUser();
      if (user) {
        const data = await getUserProfile(user.id);
        setProfile(data);
      }
      setIsLoading(false);
    }
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      setIsSaving(false);
      toast({ 
        title: "Settings Saved", 
        description: "Your seller profile has been updated successfully." 
      });
    }, 1000);
  };

  if (isLoading) {
    return (
      <SellerLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className="max-w-4xl space-y-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Store Settings</h1>
          <p className="text-gray-500 font-medium">Manage your seller profile, payment methods, and verification status.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Navigation Sidebar (Local) */}
          <div className="space-y-1">
             <Button variant="ghost" className="w-full justify-start font-bold text-primary bg-primary/5 rounded-xl">
                <User className="h-4 w-4 mr-3" /> Profile
             </Button>
             <Button variant="ghost" className="w-full justify-start font-bold text-gray-500 hover:bg-gray-50 rounded-xl">
                <CreditCard className="h-4 w-4 mr-3" /> Payments
             </Button>
             <Button variant="ghost" className="w-full justify-start font-bold text-gray-500 hover:bg-gray-50 rounded-xl">
                <ShieldCheck className="h-4 w-4 mr-3" /> Verification
             </Button>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-8">
            <form onSubmit={handleSave} className="space-y-8">
              <Card className="border-gray-200/60 shadow-sm overflow-hidden">
                <CardHeader className="p-8 border-b border-gray-50">
                  <CardTitle className="text-xl font-black">Public Profile</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-6 pb-6 border-b border-gray-50">
                    <div className="h-20 w-20 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 group cursor-pointer hover:border-primary/50 transition-colors">
                       <Upload className="h-5 w-5 mb-1" />
                       <span className="text-[10px] font-bold uppercase tracking-widest">Update</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Store Logo / Profile Photo</p>
                      <p className="text-xs text-gray-500 mt-1">Recommended size: 400x400px. JPG or PNG.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">First Name</Label>
                      <Input defaultValue={profile?.first_name} className="h-12 border-gray-200 font-medium" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Last Name</Label>
                      <Input defaultValue={profile?.last_name} className="h-12 border-gray-200 font-medium" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Shop Name</Label>
                    <Input placeholder="e.g. Joseph's Tech Store" className="h-12 border-gray-200 font-medium" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Shop Bio</Label>
                    <Textarea 
                      placeholder="Tell buyers about your shop and what you specialize in..." 
                      className="min-h-[120px] border-gray-200 font-medium p-4"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200/60 shadow-sm overflow-hidden">
                <CardHeader className="p-8 border-b border-gray-50">
                  <CardTitle className="text-xl font-black">Payment & Payouts</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-4">
                     <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                        <CreditCard className="h-6 w-6" />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-indigo-900">M-PESA Payout Method</p>
                        <p className="text-xs text-indigo-700 mt-0.5">Funds will be sent to this number automatically.</p>
                     </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">M-PESA Number</Label>
                    <Input defaultValue={profile?.phone_number} className="h-12 border-gray-200 font-medium" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200/60 shadow-sm overflow-hidden border-l-4 border-l-amber-400">
                <CardHeader className="p-8 border-b border-gray-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-black">Seller Verification (KYC)</CardTitle>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Action Required</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    To enable automatic payouts and list high-value items, we need to verify your identity. This is a one-time process.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl hover:border-primary/50 transition-all cursor-pointer group">
                        <div className="flex flex-col items-center justify-center text-center">
                           <div className="h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                              <Upload className="h-6 w-6 text-gray-400 group-hover:text-primary" />
                           </div>
                           <p className="text-sm font-bold text-gray-900">National ID Front</p>
                           <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Upload Image</p>
                        </div>
                     </div>
                     <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl hover:border-primary/50 transition-all cursor-pointer group">
                        <div className="flex flex-col items-center justify-center text-center">
                           <div className="h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                              <Upload className="h-6 w-6 text-gray-400 group-hover:text-primary" />
                           </div>
                           <p className="text-sm font-bold text-gray-900">National ID Back</p>
                           <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Upload Image</p>
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                     <CheckCircle2 className="h-5 w-5 text-gray-300" />
                     <p className="text-xs text-gray-500 font-medium">Your data is encrypted and stored securely according to Kenyan Data Privacy laws.</p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end pt-6">
                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="px-10 h-14 text-base font-bold shadow-lg shadow-primary/20 rounded-xl"
                >
                  {isSaving ? <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Saving Changes...</> : "Save All Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
