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
        toast({ title: "Settings Synchronized", description: "Global platform parameters updated." });
        fetchSettings();
      } else {
        throw new Error('Save failed');
      }
    } catch (e) {
      toast({ title: "Synchronization failed", variant: "destructive" });
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
        {/* Header Section */}
        <div className="flex justify-between items-end gap-8 pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-widest text-slate-900 uppercase">
              Platform Configuration
            </h1>
          </div>
          <div className="flex gap-4">
             <Button 
               onClick={handleSave}
               disabled={isSaving || isLoading}
               className="h-10 px-8 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-widest rounded-none shadow-none"
             >
                {isSaving ? 'Processing...' : 'Commit Protocol'}
             </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="py-24 text-center">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Synchronizing System Map...</p>
          </div>
        ) : (
          <div className="space-y-16 max-w-6xl">
            
            {/* 1. Governance Module */}
            <section className="space-y-6">
               <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Governance & Access</p>
                  <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Module 01</span>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-6 bg-white border border-slate-200 rounded-none flex items-center justify-between">
                     <div>
                        <Label className="text-[11px] font-bold text-slate-900 uppercase">Maintenance Lock</Label>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Suspend platform activity</p>
                     </div>
                     <Switch 
                       checked={settings.maintenance_mode === 'true'} 
                       onCheckedChange={(val) => updateValue('maintenance_mode', val ? 'true' : 'false')} 
                     />
                  </div>
                  <div className="p-6 bg-white border border-slate-200 rounded-none flex items-center justify-between">
                     <div>
                        <Label className="text-[11px] font-bold text-slate-900 uppercase">Automated Vetting</Label>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Merchant self-onboarding</p>
                     </div>
                     <Switch 
                       checked={settings.self_vetting === 'true'} 
                       onCheckedChange={(val) => updateValue('self_vetting', val ? 'true' : 'false')} 
                     />
                  </div>
                  <div className="p-6 bg-white border border-slate-200 rounded-none flex items-center justify-between">
                     <div>
                        <Label className="text-[11px] font-bold text-slate-900 uppercase">Verbose Audit</Label>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">High-density logging</p>
                     </div>
                     <Switch 
                       checked={settings.verbose_logging === 'true'} 
                       onCheckedChange={(val) => updateValue('verbose_logging', val ? 'true' : 'false')} 
                     />
                  </div>
               </div>
            </section>

            {/* 2. Financial Architecture Module */}
            <section className="space-y-6">
               <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Financial Parameters</p>
                  <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Module 02</span>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Escrow Hold (Days)</p>
                     <Input 
                       type="number"
                       value={settings.auto_release_days}
                       onChange={(e) => updateValue('auto_release_days', e.target.value)}
                       className="h-10 rounded-none border-slate-200 bg-slate-50 text-sm font-bold focus-visible:ring-0 shadow-none"
                     />
                  </div>
                  <div className="p-6 bg-white border border-slate-200 rounded-none space-y-4">
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Payout Floor (KSh)</p>
                     <Input 
                       type="number"
                       value={settings.min_payout_amount}
                       onChange={(e) => updateValue('min_payout_amount', e.target.value)}
                       className="h-10 rounded-none border-slate-200 bg-slate-50 text-sm font-bold focus-visible:ring-0 shadow-none"
                     />
                  </div>
                  <div className="p-6 bg-white border border-slate-200 rounded-none space-y-4">
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Daily Payout Cap (KSh)</p>
                     <Input 
                       type="number"
                       value={settings.max_daily_payout || 100000}
                       onChange={(e) => updateValue('max_daily_payout', e.target.value)}
                       className="h-10 rounded-none border-slate-200 bg-slate-50 text-sm font-bold focus-visible:ring-0 shadow-none"
                     />
                  </div>
               </div>
            </section>

            {/* 3. Gateway & Logistics Module */}
            <section className="space-y-6">
               <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Gateway & Logistics</p>
                  <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Module 03</span>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 bg-white border border-slate-200 rounded-none space-y-6">
                     <div className="flex justify-between items-center">
                        <Label className="text-[11px] font-bold text-slate-900 uppercase">M-Pesa Payout Shortcode</Label>
                        <span className="text-[9px] px-2 py-0.5 border border-slate-900 text-slate-900 font-bold uppercase tracking-widest">Active</span>
                     </div>
                     <Input 
                       value={settings.mpesa_payout_shortcode || '4085600'}
                       onChange={(e) => updateValue('mpesa_payout_shortcode', e.target.value)}
                       className="h-10 rounded-none border-slate-200 bg-slate-50 text-sm font-bold focus-visible:ring-0 shadow-none"
                     />
                  </div>
                  <div className="p-6 bg-white border border-slate-200 rounded-none space-y-6">
                     <div className="flex justify-between items-center">
                        <Label className="text-[11px] font-bold text-slate-900 uppercase">Settlement Environment</Label>
                        <span className={`text-[9px] px-2 py-0.5 border font-bold uppercase tracking-widest ${settings.mpesa_env === 'production' ? 'bg-slate-900 text-white border-slate-900' : 'border-amber-200 text-amber-600'}`}>
                           {settings.mpesa_env === 'production' ? 'Live Production' : 'Sandbox / Test'}
                        </span>
                     </div>
                     <div className="flex gap-2">
                        <Button 
                          onClick={() => updateValue('mpesa_env', 'sandbox')}
                          className={`flex-1 h-10 rounded-none font-bold text-[9px] uppercase tracking-widest transition-all ${settings.mpesa_env !== 'production' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                        >Sandbox</Button>
                        <Button 
                          onClick={() => updateValue('mpesa_env', 'production')}
                          className={`flex-1 h-10 rounded-none font-bold text-[9px] uppercase tracking-widest transition-all ${settings.mpesa_env === 'production' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                        >Live Production</Button>
                     </div>
                  </div>
               </div>
            </section>

            {/* 4. Security Protocols Module */}
            <section className="space-y-6">
               <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Security Protocols</p>
                  <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Module 04</span>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 bg-white border border-slate-200 rounded-none flex items-center justify-between">
                     <div>
                        <Label className="text-[11px] font-bold text-slate-900 uppercase">Session Timeout (Min)</Label>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Auto-logout duration</p>
                     </div>
                     <Input 
                       type="number"
                       value={settings.session_timeout || 60}
                       onChange={(e) => updateValue('session_timeout', e.target.value)}
                       className="w-24 h-10 rounded-none border-slate-200 bg-slate-50 text-sm font-bold text-center focus-visible:ring-0 shadow-none"
                     />
                  </div>
                  <div className="p-6 bg-white border border-slate-200 rounded-none flex items-center justify-between">
                     <div>
                        <Label className="text-[11px] font-bold text-slate-900 uppercase">Forced Overrides</Label>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Require 2FA for sensitive actions</p>
                     </div>
                     <Switch 
                       checked={settings.force_2fa === 'true'} 
                       onCheckedChange={(val) => updateValue('force_2fa', val ? 'true' : 'false')} 
                     />
                  </div>
               </div>
            </section>

            {/* Platform Master Reset */}
            <div className="p-10 bg-slate-900 text-white rounded-none flex flex-col md:flex-row justify-between items-center gap-8">
               <div className="space-y-1">
                  <p className="text-xl font-bold uppercase tracking-tight">Platform Master Reset</p>
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Purge platform indices, flush cache, and synchronize global state</p>
               </div>
               <Button 
                 variant="outline" 
                 className="h-12 px-12 border-white/20 text-white hover:bg-white hover:text-slate-900 font-bold text-[10px] uppercase tracking-widest rounded-none transition-all"
               >
                  Execute Reset
               </Button>
            </div>

          </div>
        )}

        {/* Forensic Footer */}
        <div className="pt-12 border-t border-slate-100 flex justify-between items-center text-[9px] font-bold text-slate-300 uppercase tracking-widest">
           <p>Last Sync: {new Date().toLocaleTimeString()}</p>
           <p>Protocol Status: Active</p>
        </div>
      </div>
    </AdminLayout>
  );
}
