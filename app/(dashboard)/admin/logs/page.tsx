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
      <div className="space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
               <span>Admin</span>
               <ChevronRight className="h-3 w-3 opacity-50" />
               <span className="text-primary">Logs</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Activity History
            </h1>
            <p className="text-sm text-slate-500 font-medium max-w-xl leading-relaxed">
              A record of all actions performed by administrators.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white border border-slate-200 px-5 py-2.5 rounded-xl shadow-sm">
             <Terminal className="h-4 w-4 text-primary" />
             <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wide">{logs.length} Entries</span>
          </div>
        </div>

        <div className="space-y-6">
           <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
              <Input 
                placeholder="Search..." 
                className="pl-11 bg-white border-slate-200 h-11 rounded-lg text-sm font-medium focus:border-slate-300 shadow-sm transition-all"
              />
           </div>

           <Card className="bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                       <tr>
                          <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Date</th>
                          <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Admin</th>
                          <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Action</th>
                          <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Details</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {isLoading ? (
                         <tr><td colSpan={4} className="px-6 py-16 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-200" /></td></tr>
                       ) : logs.length === 0 ? (
                         <tr><td colSpan={4} className="px-6 py-16 text-center text-slate-400 font-bold uppercase tracking-wider">No logs found.</td></tr>
                       ) : (
                         logs.map((log) => (
                           <tr key={log.id} className="hover:bg-slate-50 transition-all duration-200 group">
                              <td className="px-6 py-5">
                                 <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                                    <Clock className="h-3.5 w-3.5 opacity-60" />
                                    {new Date(log.created_at).toLocaleString()}
                                 </div>
                              </td>
                              <td className="px-6 py-5">
                                 <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center">
                                       <User className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <div className="space-y-0.5">
                                       <p className="text-xs text-slate-900 font-bold">{log.admin?.first_name} {log.admin?.last_name}</p>
                                       <p className="text-[10px] text-slate-400 font-mono uppercase tracking-tighter">{log.admin?.role}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-5">
                                 <div className="space-y-1.5">
                                    <Badge className="bg-slate-100 text-slate-600 border-none text-[9px] font-bold uppercase tracking-wider px-2 py-0.5">
                                       {log.action}
                                    </Badge>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                       {log.entity_type}: <span className="text-slate-500">#{log.entity_id?.slice(0,8)}</span>
                                    </p>
                                 </div>
                              </td>
                              <td className="px-6 py-5">
                                 <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono text-[10px] text-slate-600 max-w-md line-clamp-2">
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
