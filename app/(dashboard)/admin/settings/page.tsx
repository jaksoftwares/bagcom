'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function AdminSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      setSettings(data.settings || {});
    } catch (e) {
      toast({ title: "Failed to load settings", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      });
      if (res.ok) {
        toast({ title: "Settings Saved", description: "System parameters updated." });
        fetchSettings();
      } else {
        throw new Error('Save failed');
      }
    } catch (e) {
      toast({ title: "Save failed", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const updateValue = (key: string, value: string) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <AdminLayout>
      <div className="space-y-12">
        {/* Header */}
        <div className="flex justify-between items-end gap-8 pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-widest text-slate-900 uppercase">
              Settings
            </h1>
          </div>
          <div className="flex gap-4">
             <Button 
               onClick={handleSave}
               disabled={isSaving || isLoading}
               className="h-10 px-8 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-widest rounded-none shadow-none"
             >
                {isSaving ? 'Saving...' : 'Save Settings'}
             </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="py-24 text-center">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl">
            
            {/* 1. General */}
            <section className="space-y-6">
               <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2">General</p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-6 bg-white border border-slate-200 rounded-none flex items-center justify-between">
                     <div>
                        <Label className="text-[11px] font-bold text-slate-900 uppercase">Maintenance Mode</Label>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Suspend platform activity</p>
                     </div>
                     <Switch 
                       checked={settings.maintenance_mode === 'true'} 
                       onCheckedChange={(val) => updateValue('maintenance_mode', val ? 'true' : 'false')} 
                     />
                  </div>
                  <div className="p-6 bg-white border border-slate-200 rounded-none flex items-center justify-between">
                     <div>
                        <Label className="text-[11px] font-bold text-slate-900 uppercase">Self-Verification</Label>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Merchant self-onboarding</p>
                     </div>
                     <Switch 
                       checked={settings.self_vetting === 'true'} 
                       onCheckedChange={(val) => updateValue('self_vetting', val ? 'true' : 'false')} 
                     />
                  </div>
               </div>
            </section>

            {/* 2. Financials */}
            <section className="space-y-6">
               <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2">Financials</p>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white border border-slate-200 rounded-none space-y-4">
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Commission (%)</p>
                     <Input 
                       type="number"
                       value={settings.commission_rate}
                       onChange={(e) => updateValue('commission_rate', e.target.value)}
                       className="h-10 rounded-none border-slate-200 bg-slate-50 text-sm font-bold focus-visible:ring-0 shadow-none"
                     />
                  </div>
                  <div className="p-6 bg-white border border-slate-200 rounded-none space-y-4">
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Escrow Days</p>
                     <Input 
                       type="number"
                       value={settings.auto_release_days}
                       onChange={(e) => updateValue('auto_release_days', e.target.value)}
                       className="h-10 rounded-none border-slate-200 bg-slate-50 text-sm font-bold focus-visible:ring-0 shadow-none"
                     />
                  </div>
               </div>
            </section>

            {/* 3. Catalog */}
            <section className="space-y-6">
               <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2">Catalog</p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-6 bg-white border border-slate-200 rounded-none space-y-4">
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Images Limit</p>
                     <Input 
                       type="number"
                       value={settings.max_images_per_product || 5}
                       onChange={(e) => updateValue('max_images_per_product', e.target.value)}
                       className="h-10 rounded-none border-slate-200 bg-slate-50 text-sm font-bold focus-visible:ring-0 shadow-none"
                     />
                  </div>
                  <div className="p-6 bg-white border border-slate-200 rounded-none flex items-center justify-between">
                     <div>
                        <Label className="text-[11px] font-bold text-slate-900 uppercase">Product Review</Label>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Manual audit every listing</p>
                     </div>
                     <Switch 
                       checked={settings.require_product_approval === 'true'} 
                       onCheckedChange={(val) => updateValue('require_product_approval', val ? 'true' : 'false')} 
                     />
                  </div>
               </div>
            </section>

            {/* 4. Payments */}
            <section className="space-y-6">
               <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2">Payments</p>
               <div className="grid grid-cols-1 gap-4">
                  <div className="p-6 bg-white border border-slate-200 rounded-none flex flex-col sm:flex-row justify-between items-center gap-6">
                     <div className="space-y-1 w-full sm:w-auto">
                        <Label className="text-[11px] font-bold text-slate-900 uppercase">M-Pesa Environment</Label>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Status: {settings.mpesa_env || 'sandbox'}</p>
                     </div>
                     <div className="flex gap-2 w-full sm:w-auto">
                        <Button 
                          onClick={() => updateValue('mpesa_env', 'sandbox')}
                          className={`flex-1 h-10 rounded-none font-bold text-[9px] uppercase tracking-widest transition-all ${settings.mpesa_env !== 'production' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}
                        >Sandbox</Button>
                        <Button 
                          onClick={() => updateValue('mpesa_env', 'production')}
                          className={`flex-1 h-10 rounded-none font-bold text-[9px] uppercase tracking-widest transition-all ${settings.mpesa_env === 'production' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}
                        >Production</Button>
                     </div>
                  </div>
               </div>
            </section>

            {/* 5. Support */}
            <section className="space-y-6">
               <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2">Support</p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-6 bg-white border border-slate-200 rounded-none space-y-4">
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Support Email</p>
                     <Input 
                       value={settings.support_email || 'ops@bagcom.com'}
                       onChange={(e) => updateValue('support_email', e.target.value)}
                       className="h-10 rounded-none border-slate-200 bg-slate-50 text-sm font-bold focus-visible:ring-0 shadow-none"
                     />
                  </div>
                  <div className="p-6 bg-white border border-slate-200 rounded-none space-y-4">
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Dispute Grace Period</p>
                     <Input 
                       type="number"
                       value={settings.dispute_grace_days || 3}
                       onChange={(e) => updateValue('dispute_grace_days', e.target.value)}
                       className="h-10 rounded-none border-slate-200 bg-slate-50 text-sm font-bold focus-visible:ring-0 shadow-none"
                     />
                  </div>
               </div>
            </section>

            {/* 6. Notifications */}
            <section className="space-y-6">
               <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2">Alerts</p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-6 bg-white border border-slate-200 rounded-none flex items-center justify-between">
                     <div>
                        <Label className="text-[11px] font-bold text-slate-900 uppercase">SMS Alerts</Label>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Global SMS state</p>
                     </div>
                     <Switch 
                       checked={settings.enable_sms_alerts === 'true'} 
                       onCheckedChange={(val) => updateValue('enable_sms_alerts', val ? 'true' : 'false')} 
                     />
                  </div>
                  <div className="p-6 bg-white border border-slate-200 rounded-none flex items-center justify-between">
                     <div>
                        <Label className="text-[11px] font-bold text-slate-900 uppercase">Email Alerts</Label>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Global Email state</p>
                     </div>
                     <Switch 
                       checked={settings.enable_email_alerts === 'true'} 
                       onCheckedChange={(val) => updateValue('enable_email_alerts', val ? 'true' : 'false')} 
                     />
                  </div>
               </div>
            </section>

          </div>
        )}

        {/* Footer */}
        <div className="pt-12 border-t border-slate-100 flex justify-between items-center text-[9px] font-bold text-slate-300 uppercase tracking-widest">
           <p>Last Sync: {new Date().toLocaleDateString()}</p>
           <p>Status: {isLoading ? 'Polling...' : 'Ready'}</p>
        </div>
      </div>
    </AdminLayout>
  );
}
