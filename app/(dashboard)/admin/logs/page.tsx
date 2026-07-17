'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function AdminLogs() {
  const { toast } = useToast();
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/logs');
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (e) {
      toast({ title: "Failed to load audit logs", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  const filteredLogs = logs.filter(log => 
    log.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.entity_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.admin?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.admin?.last_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Header Section */}
        <div className="flex justify-between items-end gap-8 pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-widest text-foreground uppercase">
              Audit Logs
            </h1>
          </div>
          <div className="flex gap-4">
             <Button 
               onClick={fetchLogs}
               variant="outline" 
               className="h-10 px-6 border-slate-200 font-bold text-[10px] uppercase tracking-widest rounded-none shadow-none"
             >
                {isLoading ? 'Refreshing...' : 'Refresh Logs'}
             </Button>
          </div>
        </div>

        {/* Search & Statistics */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-8">
              <div>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Actions</p>
                 <p className="text-xl font-bold text-slate-900 tracking-tight">{logs.length}</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Retention</p>
                 <p className="text-xl font-bold text-slate-900 tracking-tight">200 Records</p>
              </div>
           </div>

           <div className="relative w-full md:w-72">
              <Input 
                placeholder="FILTER ACTIONS..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-none bg-transparent pl-0 pr-0 h-10 text-[10px] font-bold uppercase tracking-widest focus-visible:ring-0 placeholder:text-slate-300 shadow-none border-b border-slate-200 rounded-none"
              />
           </div>
        </div>

        {/* Logs Table */}
        <div className="space-y-1">
           {/* Table Header */}
           <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 border-y border-slate-200">
              <div className="col-span-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Timestamp</div>
              <div className="col-span-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Administrator</div>
              <div className="col-span-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Action</div>
              <div className="col-span-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Subject</div>
              <div className="col-span-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Payload Details</div>
           </div>

           {isLoading ? (
             <div className="py-24 flex flex-col items-center gap-4">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Loading...</p>
             </div>
           ) : (
             <div className="divide-y divide-slate-100 border-x border-b border-slate-200">
               {filteredLogs.map((log) => (
                 <div key={log.id} className="grid grid-cols-12 gap-4 px-6 py-4 bg-white hover:bg-slate-50 transition-colors items-center">
                    <div className="col-span-2">
                       <p className="text-[10px] font-mono text-slate-400">{new Date(log.created_at).toLocaleDateString()}</p>
                       <p className="text-[10px] font-mono text-slate-900 font-bold">{new Date(log.created_at).toLocaleTimeString()}</p>
                    </div>
                    <div className="col-span-2">
                       <p className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">
                          {log.admin?.first_name} {log.admin?.last_name}
                       </p>
                       <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{log.admin?.role}</p>
                    </div>
                    <div className="col-span-2">
                       <span className="px-2 py-1 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-widest">
                          {log.action}
                       </span>
                    </div>
                    <div className="col-span-2">
                       <p className="text-[10px] font-bold text-slate-900 uppercase tracking-tight">{log.entity_type}</p>
                       <p className="text-[9px] text-slate-400 font-mono">ID: {log.entity_id?.slice(0, 8)}...</p>
                    </div>
                    <div className="col-span-4 overflow-hidden">
                       <p className="text-[9px] font-mono text-slate-400 truncate bg-slate-50 p-2 border border-slate-200">
                          {JSON.stringify(log.details)}
                       </p>
                    </div>
                 </div>
               ))}
               
               {filteredLogs.length === 0 && (
                 <div className="py-24 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No matching logs found in this cycle.</p>
                 </div>
               )}
             </div>
           )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-8 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
           <p>Immutable Record Protocol v1.0</p>
           <p>Authenticated Session</p>
        </div>
      </div>
    </AdminLayout>
  );
}
