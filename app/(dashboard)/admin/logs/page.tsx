'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  History, 
  Search, 
  ChevronRight, 
  User, 
  Activity, 
  Clock,
  Database,
  Loader2,
  Terminal
} from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function AdminLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch('/api/admin/logs'); // Need to create this API too
        const data = await res.json();
        setLogs(data.logs || []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLogs();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
               <span>Admin</span>
               <ChevronRight className="h-3 w-3 opacity-30" />
               <span className="text-primary">Governance Audit</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.1]">
              System <span className="text-primary/80">Audit Trail</span>
            </h1>
            <p className="text-base text-slate-400 font-medium max-w-xl leading-relaxed">
              Transparent record of all administrative actions. Every status change, financial override, and setting update is logged for compliance.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-primary/10 border border-primary/20 px-6 py-3 rounded-[1.5rem] shadow-xl shadow-primary/5">
             <Terminal className="h-5 w-5 text-primary" />
             <span className="text-[11px] font-black text-primary uppercase tracking-[0.1em]">{logs.length} Actions Logged</span>
          </div>
        </div>

        <div className="space-y-8">
           <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search audit trail..." 
                className="pl-12 bg-white/5 border-white/5 h-12 rounded-xl text-xs font-medium focus-visible:ring-primary/20 transition-all"
              />
           </div>

           <Card className="bg-slate-900/40 border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-slate-950/50 border-b border-white/5">
                       <tr>
                          <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Timestamp</th>
                          <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Administrator</th>
                          <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Action & Entity</th>
                          <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Impact Details</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {isLoading ? (
                         <tr><td colSpan={4} className="px-8 py-16 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary/40" /></td></tr>
                       ) : logs.length === 0 ? (
                         <tr><td colSpan={4} className="px-8 py-16 text-center text-slate-500 font-bold uppercase tracking-[0.2em]">No audit records found.</td></tr>
                       ) : (
                         logs.map((log) => (
                           <tr key={log.id} className="hover:bg-white/5 transition-all duration-300 group">
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                    <Clock className="h-3.5 w-3.5 opacity-40" />
                                    {new Date(log.created_at).toLocaleString()}
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-slate-800 rounded-lg flex items-center justify-center">
                                       <User className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <div className="space-y-0.5">
                                       <p className="text-xs text-white font-bold">{log.admin?.first_name} {log.admin?.last_name}</p>
                                       <p className="text-[10px] text-slate-500 font-mono uppercase tracking-tighter">{log.admin?.role}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <div className="space-y-1.5">
                                    <Badge className="bg-primary/10 text-primary border-none text-[9px] font-bold uppercase tracking-widest px-2 py-0.5">
                                       {log.action}
                                    </Badge>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                       {log.entity_type}: <span className="text-slate-400">#{log.entity_id?.slice(0,8)}</span>
                                    </p>
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 font-mono text-[10px] text-slate-400 max-w-md line-clamp-2">
                                    {JSON.stringify(log.details)}
                                 </div>
                              </td>
                           </tr>
                         ))
                       )}
                    </tbody>
                 </table>
              </div>
           </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
