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
import { uploadToCloudinary } from '@/lib/cloudinary/cloudinary';

export default function SellerSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    try {
      const file = e.target.files[0];
      const res = await uploadToCloudinary(file);
      if (res && res.secure_url) {
        setProfile((prev: any) => ({ ...prev, profile_photo_url: res.secure_url }));
        toast({ title: "Photo uploaded", description: "Remember to save your settings." });
      }
    } catch (err) {
      toast({ title: "Upload Failed", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error("Not authenticated");
      
      const res = await fetch('/api/seller/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          shop_name: profile.seller_profiles?.[0]?.shop_name || profile.shop_name,
          bio: profile.seller_profiles?.[0]?.bio || profile.bio,
          mpesa_number: profile.phone_number,
          profile_photo_url: profile.profile_photo_url
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast({ 
        title: "Settings Saved", 
        description: "Your seller profile has been updated successfully." 
      });
    } catch (err: any) {
      toast({ title: "Update Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
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
                    <label className="relative h-20 w-20 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 group cursor-pointer hover:border-primary/50 transition-colors overflow-hidden">
                       {profile?.profile_photo_url ? (
                         <img src={profile.profile_photo_url} alt="Profile" className="absolute inset-0 w-full h-full object-cover" />
                       ) : (
                         <>
                           {isUploading ? <Loader2 className="h-5 w-5 mb-1 animate-spin" /> : <Upload className="h-5 w-5 mb-1" />}
                           <span className="text-[10px] font-bold uppercase tracking-widest">{isUploading ? 'WAIT' : 'Update'}</span>
                         </>
                       )}
                       <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                    </label>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Store Logo / Profile Photo</p>
                      <p className="text-xs text-gray-500 mt-1">Recommended size: 400x400px. JPG or PNG.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">First Name</Label>
                      <Input value={profile?.first_name || ''} onChange={(e) => setProfile({...profile, first_name: e.target.value})} className="h-12 border-gray-200 font-medium" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Last Name</Label>
                      <Input value={profile?.last_name || ''} onChange={(e) => setProfile({...profile, last_name: e.target.value})} className="h-12 border-gray-200 font-medium" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Shop Name</Label>
                    <Input placeholder="e.g. Joseph's Tech Store" value={profile?.shop_name || profile?.seller_profiles?.[0]?.shop_name || ''} onChange={(e) => setProfile({...profile, shop_name: e.target.value})} className="h-12 border-gray-200 font-medium" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Shop Bio</Label>
                    <Textarea 
                      placeholder="Tell buyers about your shop and what you specialize in..." 
                      className="min-h-[120px] border-gray-200 font-medium p-4"
                      value={profile?.bio || profile?.seller_profiles?.[0]?.bio || ''} 
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
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
                    <Input value={profile?.phone_number || ''} onChange={(e) => setProfile({...profile, phone_number: e.target.value})} className="h-12 border-gray-200 font-medium" />
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
