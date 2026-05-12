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
        toast({ title: "Settings Saved", description: "Settings updated successfully." });
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
      <div className="space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
               <span>Admin</span>
               <ChevronRight className="h-3 w-3 opacity-50" />
               <span className="text-primary">Settings</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              System Settings
            </h1>
            <p className="text-sm text-slate-500 font-medium max-w-xl leading-relaxed">
              Manage platform settings and security.
            </p>
          </div>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] uppercase tracking-wider h-11 px-6 rounded-lg shadow-sm transition-all"
          >
             {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />} 
             Save
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
           {/* Navigation Sidebar */}
           <div className="space-y-2">
              {[
                { name: 'General', icon: Settings, active: true },
                { name: 'Security', icon: Shield },
                { name: 'Notifications', icon: Bell },
                { name: 'Localization', icon: Globe },
                { name: 'Database', icon: Database },
                { name: 'API', icon: Zap },
              ].map((item) => (
                <Button 
                  key={item.name}
                  variant="ghost" 
                  className={`w-full justify-start h-12 px-4 rounded-lg gap-3 font-bold text-xs transition-all ${
                    item.active 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Button>
              ))}
           </div>

           {/* Content Area */}
           <div className="lg:col-span-2 space-y-6">
              {isLoading ? (
                <div className="py-24 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-slate-200" /></div>
              ) : (
                <Card className="bg-white border-slate-200 p-8 rounded-xl shadow-sm">
                  <div className="space-y-8">
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-bold text-primary uppercase tracking-wider">Global Settings</p>
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">General Settings</h3>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="space-y-0.5">
                              <Label className="text-sm font-bold text-slate-900">Maintenance Mode</Label>
                              <p className="text-[11px] text-slate-500 font-medium">Disable all buyer and seller actions globally.</p>
                            </div>
                            <Switch 
                              checked={settings.maintenance_mode === 'true'} 
                              onCheckedChange={() => toggleSetting('maintenance_mode')} 
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="space-y-0.5">
                              <Label className="text-sm font-bold text-slate-900">Auto-Release</Label>
                              <p className="text-[11px] text-slate-500 font-medium">Release funds automatically after period of delivery.</p>
                            </div>
                            <Switch 
                              checked={settings.auto_release_days !== '0'} 
                              onCheckedChange={() => setSettings({...settings, auto_release_days: settings.auto_release_days === '0' ? '7' : '0'})} 
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="space-y-0.5">
                              <Label className="text-sm font-bold text-slate-900">Self-Vetting</Label>
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

              <Card className="bg-white border-slate-200 p-8 rounded-xl shadow-sm">
                 <div className="space-y-8">
                    <div className="space-y-0.5">
                       <p className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Restricted Actions</p>
                       <h3 className="text-xl font-bold text-slate-900 tracking-tight">Danger Zone</h3>
                    </div>
                    <div className="p-4 bg-rose-50 rounded-lg border border-rose-100 flex items-center justify-between">
                       <p className="text-xs text-rose-700 font-bold">Clear Cache</p>
                       <Button variant="outline" className="border-rose-200 bg-white text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-bold text-[10px] uppercase tracking-wider h-9 px-4 rounded-md">Clear</Button>
                    </div>
                 </div>
              </Card>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
}
