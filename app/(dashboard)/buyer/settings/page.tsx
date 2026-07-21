'use client';

import { useState, useEffect, useRef } from 'react';
import { getCurrentUser, getUserProfile } from '@/services/auth/authService';
import { supabase } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Shield, 
  Camera, 
  Loader2, 
  CheckCircle2,
  Lock,
  Smartphone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  // Form State
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    profile_photo_url: ''
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
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
          email: currentUser.email || '',
          profile_photo_url: userProfile?.profile_photo_url || ''
        });
      } catch (error) {
        toast({ title: "Failed to load settings", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [toast]);

  const handleUpdateProfile = async (e?: React.FormEvent, updatedData?: any) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    
    const dataToSubmit = updatedData || formData;
    
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...dataToSubmit
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
        if (updatedData) {
          setFormData(prev => ({ ...prev, ...updatedData }));
        }
      }
    } catch (error) {
      toast({ title: "Update failed", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      });

      if (!uploadRes.ok) throw new Error('Upload failed');
      const uploadData = await uploadRes.json();
      
      const newPhotoUrl = uploadData.secure_url;
      
      // Update the profile locally and via API
      setProfile((prev: any) => ({ ...prev, profile_photo_url: newPhotoUrl }));
      await handleUpdateProfile(undefined, { ...formData, profile_photo_url: newPhotoUrl });
      
    } catch (error) {
      toast({ title: "Photo upload failed", variant: "destructive" });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      toast({ 
        title: "Success",
        description: "Password updated successfully"
      });
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast({ title: error.message || "Failed to update password", variant: "destructive" });
    } finally {
      setIsUpdatingPassword(false);
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
             <Button 
               onClick={() => setActiveTab('profile')}
               variant="ghost" 
               className={`w-full justify-start gap-3 h-12 rounded-xl font-bold transition-all ${
                 activeTab === 'profile' ? 'bg-primary/5 text-primary' : 'text-gray-500 hover:bg-gray-50'
               }`}
             >
                <User className="h-4 w-4" /> Profile Information
             </Button>
             <Button 
               onClick={() => setActiveTab('security')}
               variant="ghost" 
               className={`w-full justify-start gap-3 h-12 rounded-xl font-bold transition-all ${
                 activeTab === 'security' ? 'bg-primary/5 text-primary' : 'text-gray-500 hover:bg-gray-50'
               }`}
             >
                <Shield className="h-4 w-4" /> Password & Security
             </Button>
          </div>

          {/* Form Content */}
          <div className="lg:col-span-8 space-y-10">
            {activeTab === 'profile' && (
              <section className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-6">
                   <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <div className="h-24 w-24 bg-gray-100 rounded-3xl flex items-center justify-center border-2 border-white shadow-lg overflow-hidden relative">
                         {isUploadingPhoto ? (
                           <Loader2 className="h-8 w-8 text-primary animate-spin" />
                         ) : profile?.profile_photo_url ? (
                           <img src={profile.profile_photo_url} className="h-full w-full object-cover" alt="Profile" />
                         ) : (
                           <User className="h-10 w-10 text-gray-300" />
                         )}
                         <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="h-6 w-6 text-white" />
                         </div>
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handlePhotoUpload} 
                        accept="image/*" 
                        className="hidden" 
                      />
                   </div>
                   <div>
                      <h3 className="text-lg font-bold text-gray-900">Profile Photo</h3>
                      <p className="text-sm text-gray-500 mt-1">Click the image to upload a new profile photo.</p>
                   </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-8 pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                        placeholder="e.g. 0712345678"
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Used for automated payouts and order notifications.</p>
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
            )}

            {activeTab === 'security' && (
              <section className="space-y-6 animate-in fade-in duration-300">
                 <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-gray-400" />
                    <h3 className="text-lg font-bold text-gray-900">Security & Authentication</h3>
                 </div>
                 
                 <Card className="border-gray-100 shadow-none bg-white p-6 md:p-8 space-y-6 rounded-3xl">
                    <div>
                       <p className="text-sm font-bold text-gray-900">Change Password</p>
                       <p className="text-xs text-gray-500 mt-1">Ensure your account is using a long, random password to stay secure.</p>
                    </div>
                    
                    <form onSubmit={handleChangePassword} className="space-y-5">
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-gray-400">New Password</Label>
                        <Input 
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          className="h-12 border-gray-100 bg-gray-50 focus:bg-white rounded-xl font-medium"
                          placeholder="At least 6 characters"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Confirm New Password</Label>
                        <Input 
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          className="h-12 border-gray-100 bg-gray-50 focus:bg-white rounded-xl font-medium"
                          placeholder="Confirm your new password"
                          required
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        disabled={isUpdatingPassword}
                        variant="outline"
                        className="h-12 px-8 border-gray-200 hover:bg-gray-50 font-bold rounded-xl gap-2"
                      >
                         {isUpdatingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Password'}
                      </Button>
                    </form>
                 </Card>
              </section>
            )}
          </div>
        </div>
      </div>
  );
}

