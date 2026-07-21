'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
  Loader2,
  Upload,
  CheckCircle2,
  Camera,
  MapPin,
  Save,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser, getUserProfile } from '@/services/auth/authService';
import { uploadToCloudinary } from '@/lib/cloudinary/cloudinary';
import { cn } from '@/lib/utils';

// Zod Validation Schema
const settingsSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  shop_name: z.string().min(3, 'Shop name must be at least 3 characters'),
  bio: z.string().max(300, 'Bio must be under 300 characters').optional().or(z.literal('')),
  city: z.string().min(2, 'City is required'),
  physical_address: z.string().min(5, 'Physical address is required'),
  mpesa_number: z.string().regex(/^(?:\+254|0)[17]\d{8}$/, 'Must be a valid Kenyan M-PESA number (e.g. 0712345678)')
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SellerSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState<'id' | 'biz' | null>(null);
  
  const [user, setUser] = useState<any>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [idDocument, setIdDocument] = useState<string | null>(null);
  const [businessCertificate, setBusinessCertificate] = useState<string | null>(null);
  const [sellerStatus, setSellerStatus] = useState<string>('PENDING');
  
  const [activeTab, setActiveTab] = useState<'profile' | 'payments' | 'verification'>('profile');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema)
  });

  useEffect(() => {
    async function loadProfile() {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        const data = await getUserProfile(currentUser.id);
        
        // Initialize form
        reset({
          first_name: data?.first_name || '',
          last_name: data?.last_name || '',
          shop_name: data?.seller_profiles?.[0]?.shop_name || data?.shop_name || '',
          bio: data?.seller_profiles?.[0]?.bio || data?.bio || '',
          city: data?.city || '',
          physical_address: data?.physical_address || '',
          mpesa_number: data?.phone_number || ''
        });
        
        if (data?.profile_photo_url) setProfilePhoto(data.profile_photo_url);
        if (data?.id_document_url) setIdDocument(data.id_document_url);
        if (data?.business_certificate_url) setBusinessCertificate(data.business_certificate_url);
        if (data?.seller_status) setSellerStatus(data.seller_status);
      }
      setIsLoading(false);
    }
    loadProfile();
  }, [reset]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploadingPhoto(true);
    try {
      const file = e.target.files[0];
      const res = await uploadToCloudinary(file);
      if (res && res.secure_url) {
        setProfilePhoto(res.secure_url);
        toast({ title: "Photo uploaded", description: "Remember to save your settings to apply this change." });
      }
    } catch (err) {
      toast({ title: "Upload Failed", variant: "destructive" });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'id' | 'biz') => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploadingDoc(type);
    try {
      const file = e.target.files[0];
      const res = await uploadToCloudinary(file);
      if (res && res.secure_url) {
        if (type === 'id') setIdDocument(res.secure_url);
        if (type === 'biz') setBusinessCertificate(res.secure_url);
        toast({ title: "Document uploaded", description: "Remember to save your settings to apply this change." });
      }
    } catch (err) {
      toast({ title: "Upload Failed", variant: "destructive" });
    } finally {
      setIsUploadingDoc(null);
    }
  };

  const onSubmit = async (data: SettingsFormValues) => {
    if (!user) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/seller/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          first_name: data.first_name,
          last_name: data.last_name,
          shop_name: data.shop_name,
          bio: data.bio,
          mpesa_number: data.mpesa_number,
          profile_photo_url: profilePhoto,
          city: data.city,
          physical_address: data.physical_address,
          id_document_url: idDocument,
          business_certificate_url: businessCertificate
        })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      toast({ 
        title: "Settings Saved", 
        description: "Your seller profile has been updated successfully." 
      });
      
      // Update local state if a doc was just submitted for verification
      if (idDocument || businessCertificate) {
        setSellerStatus('PENDING');
      }
      
    } catch (err: any) {
      toast({ title: "Update Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <SellerLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-gray-500 tracking-wider uppercase animate-pulse">Loading Settings</p>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className="w-full mx-auto space-y-4 sm:space-y-6 pb-8 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">Settings</h1>
            <p className="text-gray-500 font-medium mt-1 text-sm">Manage your account.</p>
          </div>
          <Button 
            onClick={handleSubmit(onSubmit)} 
            disabled={isSaving}
            className="w-full sm:w-auto h-11 px-8 font-medium text-sm rounded-xl bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition-all"
          >
            {isSaving ? <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Saving...</> : <><Save className="h-5 w-5 mr-2" /> Save Changes</>}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1 lg:sticky lg:top-6 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide shrink-0">
             <button 
                onClick={() => setActiveTab('profile')}
                className={cn("whitespace-nowrap flex-1 lg:flex-none lg:w-full flex items-center justify-center lg:justify-start gap-2 lg:gap-3 px-4 lg:px-5 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-medium transition-all text-sm", activeTab === 'profile' ? "bg-primary text-white shadow-sm" : "text-gray-500 hover:bg-gray-50 lg:hover:bg-white lg:hover:shadow-sm")}
             >
                <User className="h-4 w-4 lg:h-5 lg:w-5" /> Profile
             </button>
             <button 
                onClick={() => setActiveTab('payments')}
                className={cn("whitespace-nowrap flex-1 lg:flex-none lg:w-full flex items-center justify-center lg:justify-start gap-2 lg:gap-3 px-4 lg:px-5 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-medium transition-all text-sm", activeTab === 'payments' ? "bg-primary text-white shadow-sm" : "text-gray-500 hover:bg-gray-50 lg:hover:bg-white lg:hover:shadow-sm")}
             >
                <CreditCard className="h-4 w-4 lg:h-5 lg:w-5" /> Payouts
             </button>
             <button 
                onClick={() => setActiveTab('verification')}
                className={cn("whitespace-nowrap flex-1 lg:flex-none lg:w-full flex items-center justify-center lg:justify-start lg:justify-between gap-2 lg:gap-3 px-4 lg:px-5 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-medium transition-all text-sm", activeTab === 'verification' ? "bg-primary text-white shadow-sm" : "text-gray-500 hover:bg-gray-50 lg:hover:bg-white lg:hover:shadow-sm")}
             >
                <span className="flex items-center gap-2 lg:gap-3"><ShieldCheck className="h-4 w-4 lg:h-5 lg:w-5" /> Verification</span>
                {sellerStatus !== 'APPROVED' && <div className="h-2 w-2 rounded-full bg-amber-500 ml-1 lg:ml-0"></div>}
             </button>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <form id="settings-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* TAB: PROFILE */}
              {activeTab === 'profile' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden bg-white">
                    <CardHeader className="p-5 sm:p-6 border-b border-gray-50">
                      <CardTitle className="text-lg font-semibold text-gray-900">Store Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 sm:p-6 space-y-6">
                      {/* Avatar Editor */}
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                        <label className="relative h-28 w-28 shrink-0 rounded-[1.5rem] bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 group cursor-pointer hover:border-primary/50 transition-colors overflow-hidden shadow-inner">
                           {profilePhoto ? (
                             <>
                               <img src={profilePhoto} alt="Profile" className="absolute inset-0 w-full h-full object-cover" />
                               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                 <Camera className="h-8 w-8 text-white" />
                               </div>
                             </>
                           ) : (
                             <>
                               {isUploadingPhoto ? <Loader2 className="h-8 w-8 mb-2 animate-spin text-primary" /> : <Upload className="h-8 w-8 mb-2 group-hover:text-primary transition-colors" />}
                               <span className="text-[10px] font-medium uppercase tracking-wider">{isUploadingPhoto ? 'Uploading...' : 'Upload Logo'}</span>
                             </>
                           )}
                           <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploadingPhoto} />
                        </label>
                        <div className="space-y-1 pt-2">
                          <h3 className="text-base font-semibold text-gray-900">Store Logo</h3>
                          <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-sm">
                            Displayed on your store. Recommended: 400x400px.
                          </p>
                        </div>
                      </div>

                      {/* Inputs */}
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-xs font-medium uppercase tracking-wider text-gray-500">First Name <span className="text-red-500">*</span></Label>
                          <Input {...register('first_name')} className="h-12 border-gray-200 focus-visible:ring-primary/20 font-medium rounded-xl" />
                          {errors.first_name && <p className="text-xs font-medium text-red-500 mt-1">{errors.first_name.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-medium uppercase tracking-wider text-gray-500">Last Name <span className="text-red-500">*</span></Label>
                          <Input {...register('last_name')} className="h-12 border-gray-200 focus-visible:ring-primary/20 font-medium rounded-xl" />
                          {errors.last_name && <p className="text-xs font-medium text-red-500 mt-1">{errors.last_name.message}</p>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-medium uppercase tracking-wider text-gray-500">Shop Name <span className="text-red-500">*</span></Label>
                        <Input {...register('shop_name')} placeholder="e.g. NextGen Electronics" className="h-12 border-gray-200 focus-visible:ring-primary/20 font-semibold text-lg rounded-xl" />
                        {errors.shop_name && <p className="text-xs font-medium text-red-500 mt-1">{errors.shop_name.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-medium uppercase tracking-wider text-gray-500">Shop Bio</Label>
                        <Textarea 
                          {...register('bio')}
                          placeholder="Tell buyers about your shop and what you specialize in..." 
                          className="min-h-[120px] border-gray-200 focus-visible:ring-primary/20 font-medium p-4 rounded-2xl resize-none"
                        />
                        {errors.bio && <p className="text-xs font-medium text-red-500 mt-1">{errors.bio.message}</p>}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden bg-white">
                    <CardHeader className="p-5 sm:p-6 border-b border-gray-50">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <CardTitle className="text-lg font-semibold text-gray-900">Location Details</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-5 sm:p-6 space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-xs font-medium uppercase tracking-wider text-gray-500">City / Town <span className="text-red-500">*</span></Label>
                          <Input {...register('city')} placeholder="e.g. Nairobi" className="h-12 border-gray-200 focus-visible:ring-primary/20 font-medium rounded-xl" />
                          {errors.city && <p className="text-xs font-medium text-red-500 mt-1">{errors.city.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-medium uppercase tracking-wider text-gray-500">Physical Address <span className="text-red-500">*</span></Label>
                          <Input {...register('physical_address')} placeholder="e.g. Moi Avenue, Biashara Street" className="h-12 border-gray-200 focus-visible:ring-primary/20 font-medium rounded-xl" />
                          {errors.physical_address && <p className="text-xs font-medium text-red-500 mt-1">{errors.physical_address.message}</p>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* TAB: PAYMENTS */}
              {activeTab === 'payments' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden bg-white">
                    <CardHeader className="p-5 sm:p-6 border-b border-gray-50">
                      <CardTitle className="text-lg font-semibold text-gray-900">Withdrawal Methods</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 sm:p-6 space-y-6">
                      <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100/50 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4">
                         <div className="h-14 w-14 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                            <CreditCard className="h-6 w-6" />
                         </div>
                         <div>
                            <p className="text-base font-semibold text-emerald-900">M-PESA Transfer</p>
                            <p className="text-xs font-medium text-emerald-700/80 mt-1 leading-relaxed">
                              Funds are sent here upon withdrawal.
                            </p>
                         </div>
                      </div>

                      <div className="space-y-2 max-w-md">
                        <Label className="text-xs font-medium uppercase tracking-wider text-gray-500">M-PESA Number <span className="text-red-500">*</span></Label>
                        <Input {...register('mpesa_number')} placeholder="07XXXXXXXX" className="h-12 border-gray-200 focus-visible:ring-emerald-500/20 font-semibold text-lg rounded-xl" />
                        {errors.mpesa_number && <p className="text-xs font-medium text-red-500 mt-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> {errors.mpesa_number.message}</p>}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* TAB: VERIFICATION */}
              {activeTab === 'verification' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden bg-white relative">
                    <div className="absolute top-0 right-0 p-5 sm:p-6">
                       <Badge className={cn(
                         "border-none px-3 py-1 text-[10px] font-medium uppercase tracking-wider shadow-sm",
                         sellerStatus === 'APPROVED' ? "bg-emerald-100 text-emerald-700" :
                         sellerStatus === 'REJECTED' ? "bg-rose-100 text-rose-700" :
                         "bg-amber-100 text-amber-700"
                       )}>
                         {sellerStatus === 'APPROVED' ? 'Verified' :
                          sellerStatus === 'REJECTED' ? 'Rejected' :
                          'Action Required'}
                       </Badge>
                    </div>
                    <CardHeader className="p-5 sm:p-6 border-b border-gray-50">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg font-semibold text-gray-900">Verification</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-5 sm:p-6 space-y-6">
                      <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-2xl">
                        Identity verification required for withdrawals. This is a secure, one-time process.
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                         
                         {/* National ID Upload */}
                         <label className="p-6 border-2 border-dashed border-gray-200 rounded-2xl hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group flex flex-col items-center justify-center text-center h-40 relative overflow-hidden">
                            {idDocument ? (
                               <div className="absolute inset-0 bg-emerald-50 flex flex-col items-center justify-center">
                                 <FileText className="h-10 w-10 text-emerald-500 mb-2" />
                                 <p className="text-xs font-medium text-emerald-700">Document Uploaded</p>
                                 <p className="text-[10px] text-emerald-600/70 uppercase tracking-widest mt-1 group-hover:text-emerald-700 transition-colors">Tap to replace</p>
                               </div>
                            ) : (
                               <>
                                 <div className="h-14 w-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                   {isUploadingDoc === 'id' ? <Loader2 className="h-6 w-6 text-primary animate-spin" /> : <Upload className="h-6 w-6 text-gray-400 group-hover:text-primary" />}
                                 </div>
                                 <p className="text-base font-semibold text-gray-900">National ID / Passport</p>
                                 <p className="text-xs text-primary font-medium mt-1">{isUploadingDoc === 'id' ? 'Uploading...' : 'Tap to upload'}</p>
                               </>
                            )}
                            <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => handleDocUpload(e, 'id')} disabled={isUploadingDoc !== null} />
                         </label>

                         {/* Business Certificate Upload */}
                         <label className="p-6 border-2 border-dashed border-gray-200 rounded-2xl hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group flex flex-col items-center justify-center text-center h-40 relative overflow-hidden">
                            {businessCertificate ? (
                               <div className="absolute inset-0 bg-emerald-50 flex flex-col items-center justify-center">
                                 <FileText className="h-10 w-10 text-emerald-500 mb-2" />
                                 <p className="text-xs font-medium text-emerald-700">Document Uploaded</p>
                                 <p className="text-[10px] text-emerald-600/70 uppercase tracking-widest mt-1 group-hover:text-emerald-700 transition-colors">Tap to replace</p>
                               </div>
                            ) : (
                               <>
                                 <div className="h-14 w-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                    {isUploadingDoc === 'biz' ? <Loader2 className="h-6 w-6 text-primary animate-spin" /> : <Upload className="h-6 w-6 text-gray-400 group-hover:text-primary" />}
                                 </div>
                                 <p className="text-base font-semibold text-gray-900">Business Certificate</p>
                                 <p className="text-xs text-primary font-medium mt-1">{isUploadingDoc === 'biz' ? 'Uploading...' : 'Tap to upload (Optional)'}</p>
                               </>
                            )}
                            <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => handleDocUpload(e, 'biz')} disabled={isUploadingDoc !== null} />
                         </label>

                      </div>

                      <div className="flex items-start gap-3 p-5 bg-gray-50 rounded-2xl">
                         <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                         <p className="text-xs font-medium text-gray-500 leading-relaxed">
                           Your documents are end-to-end encrypted and stored securely according to the Kenyan Data Protection Act. They will never be shared with third parties.
                         </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

            </form>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
