'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  Shield, 
  Bell, 
  Globe, 
  Database, 
  Zap,
  Save,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function AdminSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
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
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      });
      if (res.ok) {
        toast({ title: "Settings Saved", description: "Global protocol updated successfully." });
      }
    } catch (e) {
      toast({ title: "Save failed", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSetting = (key: string) => {
    setSettings({
      ...settings,
      [key]: settings[key] === 'true' ? 'false' : 'true'
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
               <span>Admin</span>
               <ChevronRight className="h-3 w-3 opacity-30" />
               <span className="text-primary">System Configuration</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.1]">
              Platform <span className="text-primary/80">Protocol</span>
            </h1>
            <p className="text-base text-slate-400 font-medium max-w-xl leading-relaxed">
              Configure global parameters, security protocols, and integration hooks. These settings affect all marketplace participants.
            </p>
          </div>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90 font-bold text-[11px] uppercase tracking-widest h-14 px-8 rounded-2xl shadow-xl shadow-primary/20 transition-all"
          >
             {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-3" /> : <Save className="h-4 w-4 mr-3" />} 
             Commit Changes
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
           {/* Navigation Sidebar */}
           <div className="space-y-4">
              {[
                { name: 'General Protocol', icon: Settings, active: true },
                { name: 'Security & Access', icon: Shield },
                { name: 'Notification Hooks', icon: Bell },
                { name: 'Regional Locales', icon: Globe },
                { name: 'Database Integrity', icon: Database },
                { name: 'API & Webhooks', icon: Zap },
              ].map((item) => (
                <Button 
                  key={item.name}
                  variant="ghost" 
                  className={`w-full justify-start h-14 px-6 rounded-2xl gap-4 font-bold text-xs transition-all ${
                    item.active 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'text-slate-500 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <item.icon className="h-4.5 w-4.5" />
                  {item.name}
                </Button>
              ))}
           </div>

           {/* Content Area */}
           <div className="lg:col-span-2 space-y-8">
              {isLoading ? (
                <div className="py-24 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary/40" /></div>
              ) : (
                <Card className="bg-slate-900/40 border-white/5 p-10 rounded-[2.5rem] shadow-2xl">
                  <div className="space-y-10">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Global Parameters</p>
                        <h3 className="text-2xl font-bold text-white tracking-tight">Marketplace Logic</h3>
                      </div>

                      <div className="space-y-8">
                        <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                            <div className="space-y-1">
                              <Label className="text-sm font-bold text-white">Maintenance Mode</Label>
                              <p className="text-[11px] text-slate-500 font-medium">Disable all buyer and seller actions globally.</p>
                            </div>
                            <Switch 
                              checked={settings.maintenance_mode === 'true'} 
                              onCheckedChange={() => toggleSetting('maintenance_mode')} 
                            />
                        </div>

                        <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                            <div className="space-y-1">
                              <Label className="text-sm font-bold text-white">Auto-Escrow Release</Label>
                              <p className="text-[11px] text-slate-500 font-medium">Release funds automatically after period of delivery.</p>
                            </div>
                            <Switch 
                              checked={settings.auto_release_days !== '0'} 
                              onCheckedChange={() => setSettings({...settings, auto_release_days: settings.auto_release_days === '0' ? '7' : '0'})} 
                            />
                        </div>

                        <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                            <div className="space-y-1">
                              <Label className="text-sm font-bold text-white">Merchant Self-Vetting</Label>
                              <p className="text-[11px] text-slate-500 font-medium">Allow low-value sales without full KYC approval.</p>
                            </div>
                            <Switch 
                              checked={settings.self_vetting === 'true'} 
                              onCheckedChange={() => toggleSetting('self_vetting')}
                            />
                        </div>
                      </div>
                  </div>
                </Card>
              )}

              <Card className="bg-slate-900/40 border-white/5 p-10 rounded-[2.5rem] shadow-2xl">
                 <div className="space-y-10">
                    <div className="space-y-1">
                       <p className="text-[10px] font-bold text-rose-500 uppercase tracking-[0.2em]">Restricted Actions</p>
                       <h3 className="text-2xl font-bold text-white tracking-tight">Danger Zone</h3>
                    </div>
                    <div className="p-6 bg-rose-500/5 rounded-2xl border border-rose-500/10 flex items-center justify-between">
                       <p className="text-xs text-rose-400 font-bold">Purge Transaction Cache</p>
                       <Button variant="outline" className="border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white font-bold text-[10px] uppercase tracking-widest h-10 px-6 rounded-xl">Execute Purge</Button>
                    </div>
                 </div>
              </Card>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
}
