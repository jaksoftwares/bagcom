'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LifeBuoy, 
  Search, 
  ChevronRight, 
  User, 
  MessageCircle, 
  Clock,
  AlertCircle,
  CheckCircle2,
  Filter,
  Loader2,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Activity,
  History,
  CheckCircle,
  FileText,
  AlertTriangle,
  Lock,
  Send,
  UserCheck
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import UserDetailDrawer from '@/components/admin/UserDetailDrawer';
import { getCurrentUser } from '@/services/auth/authService';

export default function SupportTickets() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [responses, setResponses] = useState<any[]>([]);
  const [reply, setReply] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [adminId, setAdminId] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const user = await getCurrentUser();
      if (user) setAdminId(user.id);
      fetchTickets();
      fetchStats();
    }
    init();
  }, [activeTab]);

  async function fetchTickets() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/tickets?status=${activeTab}`);
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (e) {
      toast({ title: "Failed to load tickets", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchStats() {
    try {
      const res = await fetch('/api/admin/tickets?type=STATS');
      const data = await res.json();
      setStats(data.stats);
    } catch (e) {
      console.error('Stats load failed');
    }
  }

  const fetchResponses = async (ticketId: string) => {
    try {
      const res = await fetch(`/api/admin/tickets/${ticketId}/responses`);
      const data = await res.json();
      setResponses(data.responses || []);
    } catch (e) {
      console.error(e);
    }
  };

  const sendResponse = async (ticketId: string) => {
    if (!reply.trim()) return;
    setIsSending(true);
    try {
      const res = await fetch(`/api/admin/tickets/${ticketId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId, message: reply })
      });
      if (res.ok) {
        setReply('');
        fetchResponses(ticketId);
        toast({ title: "Response sent" });
      }
    } catch (e) {
      toast({ title: "Failed to send", variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  };

  const updateTicket = async (ticketId: string, status: string) => {
    try {
      const res = await fetch('/api/admin/tickets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, status, priority: 'NORMAL', adminId })
      });
      if (res.ok) {
        toast({ title: `Ticket status: ${status}` });
        fetchTickets();
        fetchStats();
      }
    } catch (e) {
      toast({ title: "Update failed", variant: "destructive" });
    }
  };

  const filteredTickets = tickets.filter(t => 
    t.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.user?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.user?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase tracking-widest">
              Tickets
            </h1>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           <Card className="p-8 bg-white border-border/40 shadow-none rounded-md flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                 <div className="h-12 w-12 bg-muted/5 rounded-md flex items-center justify-center text-sky-500 border border-border/10">
                    <AlertTriangle className="h-6 w-6" />
                 </div>
                 <div className="px-2 py-1 bg-sky-50 rounded text-[9px] font-bold text-sky-600 uppercase tracking-widest border border-sky-100">Review</div>
              </div>
              <div>
                 <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest mb-1.5">Open</p>
                 <p className="text-3xl font-bold text-foreground tracking-tight">{stats?.open || 0}</p>
              </div>
           </Card>
           <Card className="p-8 bg-white border-border/40 shadow-none rounded-md flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                 <div className="h-12 w-12 bg-muted/5 rounded-md flex items-center justify-center text-rose-500 border border-border/10">
                    <ShieldAlert className="h-6 w-6" />
                 </div>
              </div>
              <div>
                 <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest mb-1.5">High Priority</p>
                 <p className="text-3xl font-bold text-foreground tracking-tight">{stats?.high || 0}</p>
              </div>
           </Card>
           <Card className="p-8 bg-white border-border/40 shadow-none rounded-md flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                 <div className="h-12 w-12 bg-muted/5 rounded-md flex items-center justify-center text-emerald-600 border border-border/10">
                    <CheckCircle className="h-6 w-6" />
                 </div>
              </div>
              <div>
                 <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest mb-1.5">Settled</p>
                 <p className="text-3xl font-bold text-foreground tracking-tight">{stats?.resolved || 0}</p>
              </div>
           </Card>
           <Card className="p-8 bg-foreground border-foreground shadow-none rounded-md flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                 <div className="h-12 w-12 bg-white/10 rounded-md flex items-center justify-center text-white border border-white/10">
                    <FileText className="h-6 w-6" />
                 </div>
              </div>
              <div>
                 <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1.5">Total Volume</p>
                 <p className="text-3xl font-bold text-white tracking-tight">{stats?.total || 0}</p>
              </div>
           </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
           <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-border/40">
              <TabsList className="bg-transparent p-0 h-auto w-full md:w-auto justify-start rounded-none gap-8">
                <TabsTrigger value="ACTIVE" className="rounded-none border-b-2 border-transparent px-0 py-4 font-bold text-[10px] uppercase tracking-[0.2em] data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:shadow-none transition-all">Active</TabsTrigger>
                <TabsTrigger value="RESOLVED" className="rounded-none border-b-2 border-transparent px-0 py-4 font-bold text-[10px] uppercase tracking-[0.2em] data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:shadow-none transition-all">Settled</TabsTrigger>
                <TabsTrigger value="ALL" className="rounded-none border-b-2 border-transparent px-0 py-4 font-bold text-[10px] uppercase tracking-[0.2em] data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:shadow-none transition-all">All</TabsTrigger>
              </TabsList>

              <div className="relative w-full md:w-72 pb-2 md:pb-0">
                 <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40" />
                 <Input 
                   placeholder="SEARCH..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="border-none bg-transparent pl-7 pr-0 h-10 text-[10px] font-bold uppercase tracking-widest focus-visible:ring-0 placeholder:text-muted-foreground/30 shadow-none"
                 />
              </div>
           </div>

           <TabsContent value={activeTab} className="outline-none">
              {isLoading ? (
                <div className="py-24 flex flex-col items-center gap-6">
                  <div className="h-10 w-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">Loading...</p>
                </div>
              ) : filteredTickets.length === 0 ? (
                <div className="py-32 text-center border border-dashed border-border/40 rounded-md bg-muted/5">
                  <UserCheck className="h-8 w-8 text-muted-foreground/20 mx-auto mb-4" />
                  <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">Inbox Clear</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTickets.map((ticket) => (
                    <Card key={ticket.id} className="bg-white border-border/40 shadow-none rounded-md overflow-hidden group hover:border-primary/20 transition-all duration-300">
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                           {/* User Identity */}
                           <div className="flex items-center gap-4 w-64 shrink-0">
                              <div className="h-10 w-10 bg-muted/5 rounded-full flex items-center justify-center font-bold text-foreground text-[10px] border border-border/20 uppercase tracking-tighter shrink-0">
                                 {ticket.user?.first_name?.[0]}{ticket.user?.last_name?.[0]}
                              </div>
                              <div className="min-w-0">
                                 <button onClick={() => setSelectedUserId(ticket.user_id)} className="text-[11px] font-bold text-foreground hover:text-primary truncate block transition-colors uppercase tracking-tight">
                                    {ticket.user?.first_name} {ticket.user?.last_name}
                                 </button>
                                 <p className="text-[9px] text-muted-foreground/40 font-bold uppercase tracking-widest truncate">{ticket.user?.email}</p>
                              </div>
                           </div>

                           {/* Ticket Details */}
                           <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center gap-3">
                                 <h3 className="text-sm font-bold text-foreground truncate uppercase tracking-tight">{ticket.subject}</h3>
                                 {ticket.priority === 'HIGH' && (
                                   <Badge className="bg-rose-50 text-rose-600 border-none font-bold text-[8px] px-2 py-0.5 uppercase tracking-widest rounded">High Priority</Badge>
                                 )}
                              </div>
                              <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                                 <span className="truncate max-w-[400px]">{ticket.description || 'NO DESCRIPTION'}</span>
                                 <div className="h-1 w-1 bg-border rounded-full" />
                                 <span className="shrink-0">{new Date(ticket.created_at).toLocaleDateString()}</span>
                              </div>
                           </div>

                           {/* Actions */}
                           <div className="flex items-center gap-2 shrink-0">
                              {ticket.status === 'OPEN' && (
                                <Button 
                                  onClick={() => updateTicket(ticket.id, 'IN_PROGRESS')}
                                  className="h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white border-none rounded shadow-none font-bold text-[9px] uppercase tracking-widest"
                                >
                                   Claim
                                </Button>
                              )}
                              {ticket.status === 'IN_PROGRESS' && (
                                <Button 
                                  onClick={() => updateTicket(ticket.id, 'RESOLVED')}
                                  className="h-9 px-4 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white border-none rounded shadow-none font-bold text-[9px] uppercase tracking-widest"
                                >
                                   Resolve
                                </Button>
                              )}
                              {ticket.status === 'RESOLVED' && (
                                 <Badge className="bg-emerald-500 text-white border-none px-3 py-1 font-bold text-[9px] uppercase tracking-widest rounded shadow-none">Settled</Badge>
                              )}
                              
                              <div className="h-8 w-px bg-border/40 mx-2" />
                              <Button 
                                variant="ghost" 
                                className={`h-9 px-4 font-bold text-[9px] uppercase tracking-widest gap-2 ${selectedTicketId === ticket.id ? 'text-primary' : 'text-muted-foreground/40 hover:text-primary'}`}
                                onClick={() => {
                                  if (selectedTicketId === ticket.id) {
                                    setSelectedTicketId(null);
                                  } else {
                                    setSelectedTicketId(ticket.id);
                                    fetchResponses(ticket.id);
                                  }
                                }}
                              >
                                 {selectedTicketId === ticket.id ? 'Close Chat' : 'Open Chat'} <MessageCircle className="h-3 w-3" />
                              </Button>
                           </div>
                        </div>

                        {/* Transcript Section */}
                        {selectedTicketId === ticket.id && (
                          <div className="mt-8 border-t border-border/40 pt-8 space-y-6">
                             <div className="bg-muted/5 rounded-md p-6 space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                                {responses.length === 0 ? (
                                  <div className="py-8 text-center">
                                     <p className="text-[10px] font-bold text-muted-foreground/20 uppercase tracking-[0.2em]">End of Transcript</p>
                                  </div>
                                ) : (
                                  responses.map((resp) => (
                                    <div key={resp.id} className="flex gap-4">
                                       <div className="h-8 w-8 bg-white border border-border/20 rounded flex items-center justify-center font-bold text-[9px] uppercase shrink-0">
                                          {resp.sender?.role === 'ADMIN' ? 'AD' : 'US'}
                                       </div>
                                       <div className="flex-1 space-y-1">
                                          <div className="flex items-center gap-2">
                                             <span className="text-[10px] font-bold text-foreground uppercase tracking-tight">{resp.sender?.first_name} {resp.sender?.last_name}</span>
                                             <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">{new Date(resp.created_at).toLocaleTimeString()}</span>
                                          </div>
                                          <p className="text-sm text-foreground/80 leading-relaxed">{resp.message}</p>
                                       </div>
                                    </div>
                                  ))
                                )}
                             </div>

                             <div className="flex gap-4">
                                <Input 
                                  placeholder="REPLY..." 
                                  value={reply}
                                  onChange={(e) => setReply(e.target.value)}
                                  className="h-12 bg-white border-border/40 rounded shadow-none text-[11px] font-medium tracking-wide focus-visible:ring-1 focus-visible:ring-primary/20"
                                  onKeyDown={(e) => e.key === 'Enter' && sendResponse(ticket.id)}
                                />
                                <Button 
                                  onClick={() => sendResponse(ticket.id)}
                                  disabled={isSending || !reply.trim()}
                                  className="h-12 px-8 bg-foreground hover:bg-foreground/90 text-white font-bold text-[10px] uppercase tracking-widest gap-2 shadow-none rounded"
                                >
                                   {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send
                                </Button>
                             </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
           </TabsContent>
        </Tabs>
      </div>

      <UserDetailDrawer 
        userId={selectedUserId}
        onClose={() => setSelectedUserId(null)}
        onUpdate={() => {
          fetchTickets();
          fetchStats();
        }}
      />
    </AdminLayout>
  );
}
