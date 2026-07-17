'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  ShieldCheck, 
  ShieldAlert, 
  Ban, 
  CheckCircle2, 
  Mail, 
  Phone, 
  Calendar, 
  ShoppingBag, 
  History, 
  MessageCircle,
  TrendingUp,
  ExternalLink,
  Shield,
  CreditCard,
  Package,
  Activity,
  AlertTriangle,
  ArrowRight,
  FileText,
  Maximize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import ProductDetailDrawer from './ProductDetailDrawer';

interface UserDetailDrawerProps {
  userId: string | null;
  onClose: () => void;
  onUpdate: () => void;
}

export default function UserDetailDrawer({ userId, onClose, onUpdate }: UserDetailDrawerProps) {
  const { toast } = useToast();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isEditingKyc, setIsEditingKyc] = useState(false);
  const [kycDraft, setKycDraft] = useState('');
  const [expandedDoc, setExpandedDoc] = useState<{url: string, title: string} | null>(null);

  useEffect(() => {
    if (userId) {
      setData(null);
      setError(null);
      fetchDetails();
    }
  }, [userId]);

  async function fetchDetails() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}`);
      const json = await res.json();
      if (res.ok) {
        setData(json);
      } else {
        setError(json.error || 'Failed to load profile');
      }
    } catch (e) {
      setError('A network error occurred');
      toast({ title: "Error loading user profile", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  const handleAction = async (updates: any, actionName: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...updates })
      });
      if (res.ok) {
        toast({ title: `Action: ${actionName}`, description: "User profile updated." });
        fetchDetails();
        onUpdate();
      }
    } catch (e) {
      toast({ title: "Action failed", variant: "destructive" });
    }
  };

  const getPreviewUrl = (url: string) => {
    if (!url) return url;
    if (url.includes('cloudinary.com') && url.toLowerCase().endsWith('.pdf')) {
      return url.replace(/\.pdf$/i, '.jpg');
    }
    return url;
  };

  const getDownloadUrl = (url: string) => {
    if (!url) return url;
    if (url.includes('cloudinary.com') && url.toLowerCase().endsWith('.pdf')) {
      return url.replace('/upload/', '/upload/fl_attachment/');
    }
    return url;
  };

  if (!userId) return null;

  return (
    <div className={`fixed inset-0 z-[100] transition-all duration-500 ${userId ? 'visible' : 'invisible'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ${userId ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose}
      />
      
      {/* Drawer Panel */}
      <div className={`absolute inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl transition-transform duration-500 ease-out border-l border-slate-200 flex flex-col ${userId ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center font-bold text-slate-400 shadow-sm">
              {isLoading ? '...' : (error ? '!' : (data?.user?.first_name?.[0] || 'U'))}
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {isLoading ? 'Loading User...' : (error ? 'Error Loading Data' : `${data?.user?.first_name} ${data?.user?.last_name}`)}
              </h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-slate-900 text-white border-none text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                  {error ? 'AUTH_REQUIRED' : data?.user?.role}
                </Badge>
                {!isLoading && !error && data?.user?.is_active === false && (
                   <Badge className="bg-rose-500 text-white border-none text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">Suspended</Badge>
                )}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-slate-900 hover:bg-white rounded-full transition-all">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Expanded Document Modal */}
        {expandedDoc && (
          <div className="absolute inset-0 z-50 bg-slate-900 flex flex-col">
            <div className="flex justify-between items-center p-6 text-white border-b border-white/10">
              <h3 className="font-bold text-sm tracking-widest uppercase">{expandedDoc.title}</h3>
              <div className="flex gap-4">
                <Button asChild variant="ghost" className="text-white hover:bg-white/10 h-10 px-4 font-bold text-[10px] uppercase tracking-widest">
                  <a href={getDownloadUrl(expandedDoc.url)} target="_blank" rel="noreferrer">
                     Download <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full h-10 w-10" onClick={() => setExpandedDoc(null)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
              {expandedDoc.url.toLowerCase().endsWith('.pdf') ? (
                <img src={getPreviewUrl(expandedDoc.url)} alt={expandedDoc.title} className="max-w-full max-h-full object-contain rounded-xl shadow-2xl bg-white" />
              ) : (
                <img src={getPreviewUrl(expandedDoc.url)} alt={expandedDoc.title} className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" />
              )}
            </div>
          </div>
        )}

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
          {error ? (
            <div className="py-20 text-center space-y-4">
               <div className="h-16 w-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle className="h-8 w-8" />
               </div>
               <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">Failed to load profile</p>
                  <p className="text-xs text-slate-400 font-medium">{error}</p>
               </div>
               <Button 
                 variant="outline" 
                 size="sm" 
                 onClick={fetchDetails}
                 className="mt-4 border-slate-200 font-bold text-[10px] uppercase tracking-wider h-10 px-6 rounded-xl"
               >
                 Try Again
               </Button>
            </div>
          ) : isLoading || !data ? (
            <div className="space-y-6">
              {[1,2,3].map(i => <div key={i} className="h-24 w-full bg-slate-50 animate-pulse rounded-xl" />)}
            </div>
          ) : (
            <>
              {/* Financial Summary */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-6 bg-emerald-50/30 border-emerald-100/50 flex flex-col justify-between h-32 rounded-2xl shadow-sm border">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Total Earnings</p>
                    <p className="text-2xl font-bold text-slate-900 tracking-tight">KSh {data.stats.totalEarned.toLocaleString()}</p>
                  </div>
                </Card>
                <Card className="p-6 bg-primary/5 border-primary/10 flex flex-col justify-between h-32 rounded-2xl shadow-sm border">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Total Spent</p>
                    <p className="text-2xl font-bold text-slate-900 tracking-tight">KSh {data.stats.totalSpent.toLocaleString()}</p>
                  </div>
                </Card>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                <TabsList className="bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <TabsTrigger value="overview" className="rounded-lg px-6 py-2 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all">Overview</TabsTrigger>
                  <TabsTrigger value="activity" className="rounded-lg px-6 py-2 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all">Orders</TabsTrigger>
                  {data.user.role === 'SELLER' && (
                    <TabsTrigger value="store" className="rounded-lg px-6 py-2 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all">Store</TabsTrigger>
                  )}
                  <TabsTrigger value="security" className="rounded-lg px-6 py-2 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all">Audit</TabsTrigger>
                </TabsList>

                {/* OVERVIEW TAB */}
                <TabsContent value="overview" className="space-y-8 outline-none">
                  {/* Account Details */}
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Contact Information</p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                          <Mail className="h-4 w-4 opacity-40" /> {data.user.email}
                        </div>
                        <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                          <Phone className="h-4 w-4 opacity-40" /> {data.user.phone_number || 'No phone'}
                        </div>
                        <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                          <Calendar className="h-4 w-4 opacity-40" /> Joined {new Date(data.user.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Identity Verification</p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                          <Shield className="h-4 w-4 opacity-40" /> ID/Reg: {data.user.id_number || data.user.business_registration_number || 'Not provided'}
                        </div>
                        <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                          <Package className="h-4 w-4 opacity-40" /> Business: {data.user.business_name || 'N/A'}
                        </div>
                        <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                          <ShieldCheck className="h-4 w-4 opacity-40" /> Verification: <span className={data.user.seller_status === 'APPROVED' ? 'text-emerald-500' : 'text-amber-500'}>{data.user.seller_status}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* KYC Notes */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">KYC Verification Notes</p>
                      {!isEditingKyc && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-[10px] font-bold uppercase tracking-wider text-primary hover:bg-primary/5"
                          onClick={() => {
                            setKycDraft(data.user.kyc_notes || '');
                            setIsEditingKyc(true);
                          }}
                        >
                          Edit Notes
                        </Button>
                      )}
                    </div>
                    
                    {isEditingKyc ? (
                      <div className="space-y-3">
                        <textarea 
                          value={kycDraft}
                          onChange={(e) => setKycDraft(e.target.value)}
                          className="w-full min-h-[100px] p-4 bg-white border border-primary/20 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                          placeholder="Enter internal verification notes..."
                          autoFocus
                        />
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setIsEditingKyc(false)}
                            className="h-8 text-[10px] font-bold uppercase tracking-widest text-slate-500"
                          >
                            Cancel
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => {
                              handleAction({ kyc_notes: kycDraft }, 'Update Notes');
                              setIsEditingKyc(false);
                            }}
                            className="h-8 text-[10px] font-bold uppercase tracking-widest"
                          >
                            Save Notes
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl text-sm text-slate-600 font-medium leading-relaxed italic">
                        {data.user.kyc_notes || 'No internal notes recorded for this user.'}
                      </div>
                    )}
                  </div>

                  {/* Verification Documents (Inline Viewer) */}
                  {data.user.role === 'SELLER' && (
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Verification Documents</p>
                      
                      {/* Individual ID Document */}
                      {(data.user.seller_type === 'INDIVIDUAL' || data.user.id_document_url || (!data.user.seller_type && !data.user.business_certificate_url)) && (
                        <div className="space-y-2">
                           <div className="flex items-center gap-2">
                             <p className="text-xs font-bold text-slate-600">National ID Document</p>
                             {!data.user.id_document_url && <Badge variant="destructive" className="text-[9px] uppercase tracking-widest h-5 px-2">Missing</Badge>}
                           </div>
                           {data.user.id_document_url ? (
                              <div 
                                className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl group hover:border-primary/30 transition-all cursor-pointer"
                                onClick={() => setExpandedDoc({ url: data.user.id_document_url, title: 'National Identity Card' })}
                              >
                                <div className="flex items-center gap-4 pointer-events-none">
                                  <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                                    <FileText className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-slate-900">National Identity Card</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                      {data.user.id_document_url.toLowerCase().endsWith('.pdf') ? 'PDF Document' : 'Image Document'}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-900" onClick={(e) => e.stopPropagation()}>
                                    <a href={getDownloadUrl(data.user.id_document_url)} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4" /></a>
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 pointer-events-none"
                                  >
                                    <Maximize2 className="h-3 w-3" /> Expand
                                  </Button>
                                </div>
                              </div>
                           ) : (
                             <div className="p-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                               <ShieldAlert className="h-8 w-8 mx-auto mb-3 opacity-20" />
                               No identity document provided
                             </div>
                           )}
                        </div>
                      )}

                      {/* Business Certificate Document */}
                      {(data.user.seller_type === 'BUSINESS' || data.user.business_certificate_url) && (
                        <div className="space-y-2 pt-4">
                           <div className="flex items-center gap-2">
                             <p className="text-xs font-bold text-slate-600">Business Registration Certificate</p>
                             {!data.user.business_certificate_url && <Badge variant="destructive" className="text-[9px] uppercase tracking-widest h-5 px-2">Missing</Badge>}
                           </div>
                           {data.user.business_certificate_url ? (
                              <div 
                                className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl group hover:border-primary/30 transition-all cursor-pointer"
                                onClick={() => setExpandedDoc({ url: data.user.business_certificate_url, title: 'Registration Certificate' })}
                              >
                                <div className="flex items-center gap-4 pointer-events-none">
                                  <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                                    <FileText className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-slate-900">Registration Certificate</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                      {data.user.business_certificate_url.toLowerCase().endsWith('.pdf') ? 'PDF Document' : 'Image Document'}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-900" onClick={(e) => e.stopPropagation()}>
                                    <a href={getDownloadUrl(data.user.business_certificate_url)} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4" /></a>
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 pointer-events-none"
                                  >
                                    <Maximize2 className="h-3 w-3" /> Expand
                                  </Button>
                                </div>
                              </div>
                           ) : (
                             <div className="p-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                               <ShieldAlert className="h-8 w-8 mx-auto mb-3 opacity-20" />
                               No registration certificate provided
                             </div>
                           )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="pt-4 border-t border-slate-100">
                     <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-6">Actions</p>
                     <div className="flex flex-wrap gap-4">
                        {data.user.is_active ? (
                          <Button 
                            variant="destructive" 
                            className="bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 font-bold text-[11px] uppercase tracking-wider h-11 px-6 rounded-xl transition-all"
                            onClick={() => handleAction({ is_active: false }, 'Suspend')}
                          >
                             <Ban className="h-4 w-4 mr-2" /> Suspend Account
                          </Button>
                        ) : (
                          <Button 
                            className="bg-emerald-50 border border-emerald-100 text-emerald-600 hover:bg-emerald-100 font-bold text-[11px] uppercase tracking-wider h-11 px-6 rounded-xl transition-all"
                            onClick={() => handleAction({ is_active: true }, 'Reactivate')}
                          >
                             <CheckCircle2 className="h-4 w-4 mr-2" /> Reactivate Account
                          </Button>
                        )}
                        
                        {data.user.role === 'SELLER' && data.user.seller_status !== 'APPROVED' && (
                          <Button 
                            className="bg-slate-900 text-white hover:bg-slate-800 font-bold text-[11px] uppercase tracking-wider h-11 px-6 rounded-xl transition-all"
                            onClick={() => handleAction({ seller_status: 'APPROVED', approved_at: new Date().toISOString() }, 'Verify Seller')}
                          >
                             <ShieldCheck className="h-4 w-4 mr-2" /> Verify Identity
                          </Button>
                        )}

                        {data.user.role === 'SELLER' && data.user.seller_status === 'PENDING' && (
                           <Button 
                             variant="outline"
                             className="border-rose-200 bg-rose-50/30 text-rose-600 hover:bg-rose-50 font-bold text-[11px] uppercase tracking-wider h-11 px-6 rounded-xl transition-all"
                             onClick={() => {
                               const reason = prompt('Reason for rejection:');
                               if (reason) handleAction({ seller_status: 'REJECTED', kyc_notes: `Rejected: ${reason}` }, 'Reject Seller');
                             }}
                           >
                              <ShieldAlert className="h-4 w-4 mr-2" /> Reject
                           </Button>
                        )}

                        <Button 
                          variant="outline"
                          className="border-slate-200 bg-white hover:bg-slate-50 font-bold text-[11px] uppercase tracking-wider h-11 px-6 rounded-xl transition-all"
                          onClick={() => {
                            const newRole = data.user.role === 'BUYER' ? 'SELLER' : 'BUYER';
                            if (confirm(`Change role to ${newRole}?`)) handleAction({ role: newRole }, 'Change Role');
                          }}
                        >
                           <User className="h-4 w-4 mr-2 opacity-60" /> Change Role
                        </Button>

                        <Button 
                          variant="outline"
                          className="border-slate-200 bg-white hover:bg-slate-50 font-bold text-[11px] uppercase tracking-wider h-11 px-6 rounded-xl transition-all"
                          onClick={() => {
                            if (confirm('Send password reset email to this user?')) handleAction({ action: 'RESET_PASSWORD' }, 'Reset Password');
                          }}
                        >
                           <History className="h-4 w-4 mr-2 opacity-60" /> Reset Password
                        </Button>

                        <Button 
                          variant="outline"
                          className="border-slate-200 bg-white hover:bg-slate-50 font-bold text-[11px] uppercase tracking-wider h-11 px-6 rounded-xl transition-all"
                          onClick={() => window.location.href = `mailto:${data.user.email}`}
                        >
                           <Mail className="h-4 w-4 mr-2 opacity-60" /> Send Email
                        </Button>

                        <Button 
                          variant="ghost"
                          className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 font-bold text-[11px] uppercase tracking-wider h-11 px-6 rounded-xl transition-all"
                          onClick={() => {
                            if (confirm('Are you sure you want to permanently delete this user account? This action cannot be undone.')) handleAction({ action: 'DELETE_ACCOUNT' }, 'Delete Account');
                          }}
                        >
                           <AlertTriangle className="h-4 w-4 mr-2" /> Delete Account
                        </Button>
                     </div>
                  </div>
                </TabsContent>

                {/* ACTIVITY TAB (ORDERS) */}
                <TabsContent value="activity" className="space-y-6 outline-none">
                   <div className="space-y-4">
                      {data.activity.orders.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 font-bold uppercase tracking-wider italic text-sm">No recent transactions found.</div>
                      ) : (
                        data.activity.orders.map((order: any) => (
                          <div key={order.id} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-xl hover:border-slate-200 transition-all shadow-sm">
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center">
                                <ShoppingBag className="h-5 w-5 text-slate-400" />
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-sm font-bold text-slate-900">Order #{order.order_number || order.id.slice(0, 8)}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{new Date(order.created_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="text-right space-y-1">
                               <p className="text-sm font-bold text-slate-900">KSh {order.total_amount.toLocaleString()}</p>
                               <Badge className={`border-none text-[9px] font-black uppercase tracking-widest px-2 py-0 h-4 ${
                                 order.status === 'COMPLETED' ? 'bg-emerald-500 text-white' : 
                                 order.status === 'DISPUTED' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600'
                               }`}>
                                 {order.status.replace(/_/g, ' ')}
                               </Badge>
                            </div>
                          </div>
                        ))
                      )}
                   </div>
                </TabsContent>

                {/* STORE TAB (PRODUCTS) */}
                {data.user.role === 'SELLER' && (
                  <TabsContent value="store" className="space-y-6 outline-none">
                    <div className="flex items-center justify-between">
                       <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Store Products</p>
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         className="h-7 text-[10px] font-bold uppercase tracking-wider text-primary hover:bg-primary/5 gap-2"
                         asChild
                       >
                         <a href={`/admin/products?sellerId=${userId}`}>
                           View All Products <ExternalLink className="h-3 w-3" />
                         </a>
                       </Button>
                    </div>
                    <div className="space-y-4">
                      {data.activity.products.length === 0 ? (
                        <div className="py-20 text-center border border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
                          <Package className="h-8 w-8 text-slate-200 mx-auto mb-4" />
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No listings found</p>
                        </div>
                      ) : (
                        data.activity.products.map((product: any) => (
                          <div key={product.id} className="flex items-center gap-6 p-4 bg-white border border-slate-100 rounded-xl hover:border-primary/20 transition-all shadow-none group">
                            <div className="h-14 w-14 bg-slate-50 rounded-lg border border-slate-100 overflow-hidden shrink-0">
                               {product.product_images?.[0]?.image_url ? (
                                 <img src={product.product_images[0].image_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                               ) : (
                                 <div className="w-full h-full flex items-center justify-center text-slate-300">
                                   <Package className="h-5 w-5" />
                                 </div>
                               )}
                            </div>
                            
                            <div className="flex-1 min-w-0 space-y-1">
                               <h4 className="text-sm font-bold text-slate-900 truncate tracking-tight uppercase">{product.title}</h4>
                               <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                  <span className="text-primary">KSh {product.price.toLocaleString()}</span>
                                  <div className="h-1 w-1 bg-slate-200 rounded-full" />
                                  <Badge className={`border-none text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0 h-4 rounded ${
                                    product.is_available ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                                  }`}>
                                    {product.is_available ? 'Live' : 'Hidden'}
                                  </Badge>
                               </div>
                            </div>

                            <div className="flex items-center gap-2">
                               <Button 
                                 variant="ghost" 
                                 size="icon" 
                                 className="h-9 w-9 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                                 onClick={() => setSelectedProductId(product.id)}
                               >
                                  <ArrowRight className="h-4 w-4" />
                               </Button>
                               <Button 
                                 variant="ghost" 
                                 size="icon" 
                                 className={`h-9 w-9 rounded-lg transition-all ${product.is_available ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                                 onClick={async () => {
                                   if (confirm(`Are you sure you want to ${product.is_available ? 'DEACTIVATE' : 'ACTIVATE'} this product?`)) {
                                      const res = await fetch('/api/admin/products', {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ productId: product.id, is_available: !product.is_available })
                                      });
                                      if (res.ok) {
                                        toast({ title: "Inventory updated" });
                                        fetchDetails();
                                      }
                                   }
                                 }}
                               >
                                 {product.is_available ? <Ban className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                               </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </TabsContent>
                )}

                {/* SECURITY TAB (AUDIT LOGS) */}
                <TabsContent value="security" className="space-y-6 outline-none">
                   <div className="flex items-center justify-between">
                     <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Activity Log</p>
                     <Activity className="h-4 w-4 text-slate-200" />
                   </div>
                   <div className="space-y-4">
                      {data.activity.auditLogs.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 font-bold uppercase tracking-wider italic text-sm">No activity logs found for this user.</div>
                      ) : (
                        data.activity.auditLogs.map((log: any) => (
                          <div key={log.id} className="p-5 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-4 transition-all hover:bg-white hover:shadow-md group">
                             <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                   <Badge className="bg-slate-900 text-white border-none text-[9px] font-black uppercase tracking-widest px-2.5 py-1">
                                      {log.action}
                                   </Badge>
                                   <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-600">{new Date(log.created_at).toLocaleString()}</span>
                                </div>
                                <Shield className="h-3.5 w-3.5 text-slate-200 group-hover:text-primary transition-colors" />
                             </div>
                             
                             <div className="space-y-1 px-1">
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administrator</p>
                               <p className="text-sm font-bold text-slate-900">{log.admin?.first_name} {log.admin?.last_name}</p>
                             </div>

                             {log.details && (
                               <div className="bg-white border border-slate-100 p-4 rounded-xl font-mono text-[10px] text-slate-500 overflow-x-auto custom-scrollbar">
                                  <pre>{JSON.stringify(log.details, null, 2)}</pre>
                               </div>
                             )}
                          </div>
                        ))
                      )}
                   </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>

      <ProductDetailDrawer
        productId={selectedProductId}
        onClose={() => setSelectedProductId(null)}
        onUpdate={() => {
          fetchDetails();
          onUpdate();
        }}
      />
    </div>
  );
}
