'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

export default function SupportTickets() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [responses, setResponses] = useState<any[]>([]);
  const [reply, setReply] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    async function loadTickets() {
      try {
        const res = await fetch('/api/admin/tickets');
        const data = await res.json();
        setTickets(data.tickets || []);
      } catch (e) {
        toast({ title: "Failed to load tickets", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    loadTickets();
  }, []);

  const fetchResponses = async (ticketId: string) => {
    try {
      const res = await fetch(`/api/admin/tickets/${ticketId}/responses`);
      const data = await res.json();
      setResponses(data.responses || []);
    } catch (e) {
      console.error(e);
    }
  };

  const sendResponse = async () => {
    if (!reply.trim() || !selectedTicket) return;
    setIsSending(true);
    try {
      const res = await fetch(`/api/admin/tickets/${selectedTicket.id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: reply })
      });
      if (res.ok) {
        setReply('');
        fetchResponses(selectedTicket.id);
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
        body: JSON.stringify({ ticketId, status })
      });
      if (res.ok) {
        toast({ title: "Ticket updated" });
        setTickets(tickets.map(t => t.id === ticketId ? { ...t, status } : t));
      }
    } catch (e) {
      toast({ title: "Update failed", variant: "destructive" });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN': return <Badge className="bg-sky-500/10 text-sky-400 border-sky-500/20">Open</Badge>;
      case 'IN_PROGRESS': return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">In Progress</Badge>;
      case 'RESOLVED': return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Resolved</Badge>;
      case 'CLOSED': return <Badge className="bg-slate-500/10 text-slate-400 border-white/5">Closed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
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
               <span className="text-primary">Support Desk</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.1]">
              Ticket <span className="text-primary/80">Management</span>
            </h1>
            <p className="text-base text-slate-400 font-medium max-w-xl leading-relaxed">
              Resolve user inquiries and platform issues. Maintain high service levels by tracking response times and resolution rates.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-primary/10 border border-primary/20 px-6 py-3 rounded-[1.5rem] shadow-xl shadow-primary/5">
             <LifeBuoy className="h-5 w-5 text-primary" />
             <span className="text-[11px] font-black text-primary uppercase tracking-[0.1em]">{tickets.filter(t => t.status === 'OPEN').length} New Tickets</span>
          </div>
        </div>

        <div className="grid gap-8">
           {isLoading ? (
             <div className="py-24 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary/40" /></div>
           ) : tickets.length === 0 ? (
             <Card className="bg-slate-900/40 border-white/5 p-24 text-center space-y-6 rounded-[2.5rem]">
                <div className="h-20 w-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                   <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-white">No active support tickets</h3>
             </Card>
           ) : (
             tickets.map((ticket) => (
               <Card key={ticket.id} className="bg-slate-900/40 border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden group hover:border-primary/20 transition-all duration-500">
                  <div className="p-8 flex flex-col lg:flex-row gap-10">
                     <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-4">
                           {getStatusBadge(ticket.status)}
                           <Badge variant="outline" className={`border-white/5 text-[9px] font-bold uppercase ${ticket.priority === 'HIGH' ? 'text-rose-400' : 'text-slate-500'}`}>
                              {ticket.priority} Priority
                           </Badge>
                           <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-tighter ml-auto">TKT-#{ticket.id.slice(0,8)}</span>
                        </div>
                        
                        <div className="space-y-2">
                           <h3 className="text-2xl font-bold text-white tracking-tight">{ticket.subject}</h3>
                           <p className="text-sm text-slate-400 leading-relaxed">{ticket.description || 'No detailed description provided.'}</p>
                        </div>

                        <div className="flex items-center gap-8 pt-6 border-t border-white/5">
                           <div className="flex items-center gap-3">
                              <div className="h-10 w-10 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-primary text-xs shadow-inner">
                                 {ticket.user?.first_name?.[0]}{ticket.user?.last_name?.[0]}
                              </div>
                              <div className="space-y-0.5">
                                 <p className="text-xs font-bold text-white leading-tight">{ticket.user?.first_name} {ticket.user?.last_name}</p>
                                 <p className="text-[10px] text-slate-500 font-medium">{ticket.user?.email}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                              <Clock className="h-3.5 w-3.5" />
                              Opened {new Date(ticket.created_at).toLocaleDateString()}
                           </div>
                        </div>
                     </div>

                     <div className="lg:w-64 space-y-4 flex flex-col justify-center border-l border-white/5 pl-10">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center mb-2">Resolution Hub</p>
                        <Button 
                          onClick={() => updateTicket(ticket.id, 'IN_PROGRESS')}
                          disabled={ticket.status === 'IN_PROGRESS'}
                          variant="outline" 
                          className="w-full border-white/5 bg-white/5 hover:bg-amber-500 hover:text-white font-bold text-[10px] uppercase tracking-widest h-12 rounded-xl transition-all"
                        >
                           Mark In-Progress
                        </Button>
                        <Button 
                          onClick={() => updateTicket(ticket.id, 'RESOLVED')}
                          disabled={ticket.status === 'RESOLVED'}
                          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-widest h-12 rounded-xl shadow-lg shadow-emerald-500/10 transition-all"
                        >
                           Resolve Issue
                        </Button>
                        <Button 
                          onClick={() => {
                            setSelectedTicket(ticket);
                            fetchResponses(ticket.id);
                          }}
                          variant="ghost" 
                          className="w-full text-slate-500 hover:text-white font-bold text-[10px] uppercase tracking-widest h-12 rounded-xl transition-all"
                        >
                           Open Case Chat
                        </Button>
                     </div>
                  </div>

                  {/* Chat Section (Only visible when selected) */}
                  {selectedTicket?.id === ticket.id && (
                    <div className="border-t border-white/5 bg-slate-950/30 p-8 space-y-6">
                       <div className="space-y-4 max-h-80 overflow-y-auto pr-4 custom-scrollbar">
                          {responses.length === 0 ? (
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center py-4">No responses yet.</p>
                          ) : (
                            responses.map((resp) => (
                              <div key={resp.id} className={`flex ${resp.sender?.role === 'ADMIN' ? 'justify-end' : 'justify-start'}`}>
                                 <div className={`max-w-[80%] p-4 rounded-2xl text-xs font-medium ${
                                   resp.sender?.role === 'ADMIN' 
                                     ? 'bg-primary text-white rounded-tr-none' 
                                     : 'bg-white/5 text-slate-300 rounded-tl-none'
                                 }`}>
                                    <p>{resp.message}</p>
                                    <p className={`text-[9px] mt-2 opacity-50 ${resp.sender?.role === 'ADMIN' ? 'text-right' : 'text-left'}`}>
                                       {new Date(resp.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                 </div>
                              </div>
                            ))
                          )}
                       </div>

                       <div className="flex gap-4">
                          <Input 
                            placeholder="Type your response..." 
                            className="bg-white/5 border-white/5 h-12 rounded-xl text-xs"
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendResponse()}
                          />
                          <Button 
                            onClick={sendResponse}
                            disabled={isSending || !reply.trim()}
                            className="bg-primary hover:bg-primary/90 h-12 px-6 rounded-xl"
                          >
                             {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                          </Button>
                       </div>
                    </div>
                  )}
               </Card>
             ))
           )}
        </div>
      </div>
    </AdminLayout>
  );
}
