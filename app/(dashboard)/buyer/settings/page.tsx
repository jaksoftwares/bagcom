'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser, getUserProfile } from '@/services/auth/authService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Bell, 
  CreditCard, 
  Camera, 
  Loader2, 
  CheckCircle2,
  Lock,
  Smartphone,
  MapPin
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    email: ''
  });

  useEffect(() => {
    async function loadData() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return;
        setUser(currentUser);
        
        const userProfile = await getUserProfile(currentUser.id);
        setProfile(userProfile);
        
        setFormData({
          first_name: userProfile?.first_name || '',
          last_name: userProfile?.last_name || '',
          phone_number: userProfile?.phone_number || '',
          email: currentUser.email || ''
        });
      } catch (error) {
        toast({ title: "Failed to load settings", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...formData
        })
      });
      if (res.ok) {
        toast({ 
          title: "Success",
          description: (
            <div className="flex items-center gap-2 mt-1">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Profile updated successfully</span>
            </div>
          )
        });
      }
    } catch (error) {
      toast({ title: "Update failed", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
    </div>
  );

  return (
    <div className="max-w-4xl space-y-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-gray-900">Account Settings</h1>
          <p className="text-gray-500 font-medium">Manage your personal information and security preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Navigation - Sticky */}
          <div className="lg:col-span-4 space-y-2 lg:sticky lg:top-24 h-fit">
             <Button variant="ghost" className="w-full justify-start gap-3 h-12 rounded-xl bg-primary/5 text-primary font-bold">
                <User className="h-4 w-4" /> Profile Information
             </Button>
             <Button variant="ghost" className="w-full justify-start gap-3 h-12 rounded-xl text-gray-500 hover:bg-gray-50 font-bold">
                <Shield className="h-4 w-4" /> Password & Security
             </Button>
             <Button variant="ghost" className="w-full justify-start gap-3 h-12 rounded-xl text-gray-500 hover:bg-gray-50 font-bold">
                <Bell className="h-4 w-4" /> Notification Rules
             </Button>
             <Button variant="ghost" className="w-full justify-start gap-3 h-12 rounded-xl text-gray-500 hover:bg-gray-50 font-bold">
                <Smartphone className="h-4 w-4" /> Connected Devices
             </Button>
          </div>

          {/* Form Content */}
          <div className="lg:col-span-8 space-y-10">
            {/* Profile Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-6">
                 <div className="relative group">
                    <div className="h-24 w-24 bg-gray-100 rounded-3xl flex items-center justify-center border-2 border-white shadow-lg overflow-hidden">
                       {profile?.profile_photo_url ? (
                         <img src={profile.profile_photo_url} className="h-full w-full object-cover" alt="" />
                       ) : (
                         <User className="h-10 w-10 text-gray-300" />
                       )}
                    </div>
                    <button className="absolute -bottom-2 -right-2 h-10 w-10 bg-primary text-white rounded-xl shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                       <Camera className="h-4 w-4" />
                    </button>
                 </div>
                 <div>
                    <h3 className="text-lg font-bold text-gray-900">Profile Photo</h3>
                    <p className="text-sm text-gray-500 mt-1">Upload a clear photo for seller trust.</p>
                 </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-8 pt-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400">First Name</Label>
                    <Input 
                      value={formData.first_name}
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                      className="h-12 border-gray-100 bg-gray-50 focus:bg-white rounded-xl font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Last Name</Label>
                    <Input 
                      value={formData.last_name}
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                      className="h-12 border-gray-100 bg-gray-50 focus:bg-white rounded-xl font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-gray-400">M-PESA Phone Number</Label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      value={formData.phone_number}
                      onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                      className="pl-12 h-12 border-gray-100 bg-gray-50 focus:bg-white rounded-xl font-medium"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Required for automated payouts and refunds.</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      disabled
                      value={formData.email}
                      className="pl-12 h-12 border-gray-100 bg-gray-50 opacity-60 rounded-xl font-medium cursor-not-allowed"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="h-12 px-8 bg-primary hover:bg-primary/90 font-bold rounded-xl shadow-lg shadow-primary/20 gap-2"
                >
                   {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Profile Changes'}
                </Button>
              </form>
            </section>

            <Separator className="bg-gray-100" />

            <section className="space-y-6">
               <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                  <h3 className="text-lg font-bold text-gray-900">Security & Authentication</h3>
               </div>
               <div className="grid gap-4">
                  <Card className="border-gray-100 shadow-none bg-gray-50/50 p-6 flex items-center justify-between">
                     <div>
                        <p className="text-sm font-bold text-gray-900">Multi-Factor Authentication</p>
                        <p className="text-xs text-gray-500 mt-1">Add an extra layer of security to your account.</p>
                     </div>
                     <Button variant="outline" className="border-gray-200 font-bold text-xs">Enable</Button>
                  </Card>
                  <Card className="border-gray-100 shadow-none bg-gray-50/50 p-6 flex items-center justify-between">
                     <div>
                        <p className="text-sm font-bold text-gray-900">Change Password</p>
                        <p className="text-xs text-gray-500 mt-1">Regularly update your password for better safety.</p>
                     </div>
                     <Button variant="outline" className="border-gray-200 font-bold text-xs">Update</Button>
                  </Card>
               </div>
            </section>
          </div>
        </div>
      </div>
  );
}

