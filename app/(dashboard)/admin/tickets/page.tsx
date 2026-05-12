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
      <div className="space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
               <span>Admin</span>
               <ChevronRight className="h-3 w-3 opacity-50" />
               <span className="text-primary">Tickets</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Support Tickets
            </h1>
            <p className="text-sm text-slate-500 font-medium max-w-xl leading-relaxed">
              Manage and resolve customer support requests.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white border border-slate-200 px-5 py-2.5 rounded-xl shadow-sm">
             <LifeBuoy className="h-4 w-4 text-primary" />
             <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wide">{tickets.filter(t => t.status === 'OPEN').length} New Tickets</span>
          </div>
        </div>

        <div className="grid gap-6">
           {isLoading ? (
             <div className="py-24 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary/40" /></div>
           ) : tickets.length === 0 ? (
             <Card className="bg-white border-slate-200 p-24 text-center space-y-6 rounded-2xl shadow-sm">
                <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                   <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No active support tickets</h3>
             </Card>
           ) : (
             tickets.map((ticket) => (
               <Card key={ticket.id} className="bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden group hover:border-slate-300 transition-all duration-300">
                  <div className="p-6 flex flex-col lg:flex-row gap-8">
                     <div className="flex-1 space-y-5">
                        <div className="flex items-center gap-3">
                           {getStatusBadge(ticket.status)}
                           <Badge variant="outline" className={`border-slate-100 text-[10px] font-bold uppercase ${ticket.priority === 'HIGH' ? 'text-rose-500 bg-rose-50' : 'text-slate-500 bg-slate-50'}`}>
                              {ticket.priority} Priority
                           </Badge>
                           <span className="text-[11px] font-mono text-slate-400 font-bold ml-auto uppercase tracking-tighter"># {ticket.id.slice(0,8)}</span>
                        </div>
                        
                        <div className="space-y-1">
                           <h3 className="text-xl font-bold text-slate-900 tracking-tight">{ticket.subject}</h3>
                           <p className="text-sm text-slate-500 leading-relaxed">{ticket.description || 'No detailed description provided.'}</p>
                        </div>

                        <div className="flex items-center gap-8 pt-5 border-t border-slate-50">
                           <div className="flex items-center gap-3">
                              <div className="h-9 w-9 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-700 text-xs">
                                 {ticket.user?.first_name?.[0]}{ticket.user?.last_name?.[0]}
                              </div>
                              <div className="space-y-0.5">
                                 <p className="text-xs font-bold text-slate-900 leading-tight">{ticket.user?.first_name} {ticket.user?.last_name}</p>
                                 <p className="text-[10px] text-slate-400 font-medium">{ticket.user?.email}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                              <Clock className="h-3.5 w-3.5" />
                              Opened {new Date(ticket.created_at).toLocaleDateString()}
                           </div>
                        </div>
                     </div>

                     <div className="lg:w-56 space-y-3 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center mb-1">Actions</p>
                        <Button 
                          onClick={() => updateTicket(ticket.id, 'IN_PROGRESS')}
                          disabled={ticket.status === 'IN_PROGRESS'}
                          variant="outline" 
                          className="w-full border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-[11px] uppercase tracking-wider h-10 rounded-lg transition-all"
                        >
                           In Progress
                        </Button>
                        <Button 
                          onClick={() => updateTicket(ticket.id, 'RESOLVED')}
                          disabled={ticket.status === 'RESOLVED'}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] uppercase tracking-wider h-10 rounded-lg shadow-sm transition-all"
                        >
                           Resolve
                        </Button>
                        <Button 
                          onClick={() => {
                            setSelectedTicket(ticket);
                            fetchResponses(ticket.id);
                          }}
                          variant="ghost" 
                          className="w-full text-slate-500 hover:text-slate-900 font-bold text-[11px] uppercase tracking-wider h-10 rounded-lg transition-all"
                        >
                           Open Chat
                        </Button>
                     </div>
                  </div>

                  {/* Chat Section (Only visible when selected) */}
                  {selectedTicket?.id === ticket.id && (
                    <div className="border-t border-slate-100 bg-slate-50/50 p-6 space-y-5">
                       <div className="space-y-4 max-h-80 overflow-y-auto pr-4 custom-scrollbar">
                          {responses.length === 0 ? (
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider text-center py-4">No responses yet.</p>
                          ) : (
                            responses.map((resp) => (
                              <div key={resp.id} className={`flex ${resp.sender?.role === 'ADMIN' ? 'justify-end' : 'justify-start'}`}>
                                 <div className={`max-w-[80%] p-3.5 rounded-xl text-sm font-medium ${
                                   resp.sender?.role === 'ADMIN' 
                                     ? 'bg-primary text-white rounded-tr-none shadow-sm' 
                                     : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                                 }`}>
                                    <p>{resp.message}</p>
                                    <p className={`text-[10px] mt-1.5 opacity-60 ${resp.sender?.role === 'ADMIN' ? 'text-right' : 'text-left'}`}>
                                       {new Date(resp.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                 </div>
                              </div>
                            ))
                          )}
                       </div>

                       <div className="flex gap-3">
                          <Input 
                            placeholder="Type a message..." 
                            className="bg-white border-slate-200 h-11 rounded-lg text-sm text-slate-900 focus:border-slate-300 shadow-sm"
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendResponse()}
                          />
                          <Button 
                            onClick={sendResponse}
                            disabled={isSending || !reply.trim()}
                            className="bg-primary hover:bg-primary/90 text-white h-11 px-5 rounded-lg shadow-sm"
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
