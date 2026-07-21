'use client';

import { useState, useEffect } from 'react';
import BuyerLayout from '@/components/layout/BuyerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  LifeBuoy, 
  MessageCircle, 
  Send, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  Search,
  ShieldCheck
} from 'lucide-react';
import { getCurrentUser } from '@/services/auth/authService';

export default function BuyerSupport() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [searchQuery, setSearchQuery] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  
  // New Ticket State
  const [newSubject, setNewSubject] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Chat State
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [responses, setResponses] = useState<any[]>([]);
  const [reply, setReply] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    async function init() {
      const user = await getCurrentUser();
      if (user) {
        setUserId(user.id);
        fetchTickets(user.id);
      }
    }
    init();
  }, []);

  async function fetchTickets(uid: string) {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/user/tickets?userId=${uid}`);
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (e) {
      toast({ title: "Failed to load tickets", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  const createTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newDescription.trim() || !userId) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/user/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, subject: newSubject, description: newDescription })
      });
      
      if (res.ok) {
        toast({ title: "Ticket Created", description: "Our support team will get back to you shortly." });
        setNewSubject('');
        setNewDescription('');
        setActiveTab('ACTIVE');
        fetchTickets(userId);
      } else {
        throw new Error('Failed to create ticket');
      }
    } catch (e) {
      toast({ title: "Error creating ticket", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchResponses = async (ticketId: string) => {
    try {
      const res = await fetch(`/api/user/tickets/${ticketId}/responses?userId=${userId}`);
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
      const res = await fetch(`/api/user/tickets/${ticketId}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, message: reply })
      });
      if (res.ok) {
        setReply('');
        fetchResponses(ticketId);
      }
    } catch (e) {
      toast({ title: "Failed to send message", variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  };

  const activeTickets = tickets.filter(t => t.status !== 'RESOLVED' && t.status !== 'CLOSED');
  const resolvedTickets = tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED');

  const getFilteredTickets = (ticketList: any[]) => {
    return ticketList.filter(t => 
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <BuyerLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Help & Support</h1>
            <p className="text-gray-500 font-medium mt-1">We're here to help! Manage your support tickets below.</p>
          </div>
          <Button 
            onClick={() => setActiveTab('NEW')} 
            className="h-12 px-6 font-bold text-sm rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 transition-all gap-2"
          >
            <Plus className="h-4 w-4" /> Open New Ticket
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-12 gap-8">
           <div className="lg:col-span-4 space-y-6">
              <Card className="border-none shadow-soft rounded-3xl overflow-hidden bg-white">
                 <CardContent className="p-2">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                       <TabsList className="w-full grid grid-cols-3 bg-gray-50/50 p-1 rounded-2xl h-14">
                          <TabsTrigger value="ACTIVE" className="rounded-xl font-bold text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary">Active ({activeTickets.length})</TabsTrigger>
                          <TabsTrigger value="RESOLVED" className="rounded-xl font-bold text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary">Resolved</TabsTrigger>
                          <TabsTrigger value="NEW" className="rounded-xl font-bold text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary">New</TabsTrigger>
                       </TabsList>
                    </Tabs>
                 </CardContent>
              </Card>

              {activeTab !== 'NEW' && (
                 <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search tickets..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-11 h-12 rounded-2xl border-gray-100 bg-white shadow-sm font-bold focus-visible:ring-primary/20"
                    />
                 </div>
              )}

              {activeTab === 'ACTIVE' && (
                 <div className="space-y-4">
                    {isLoading ? (
                       <div className="py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-gray-300" /></div>
                    ) : getFilteredTickets(activeTickets).length === 0 ? (
                       <div className="py-12 text-center text-gray-400 font-bold text-sm">No active tickets found.</div>
                    ) : (
                       getFilteredTickets(activeTickets).map(ticket => (
                          <div 
                            key={ticket.id}
                            onClick={() => {
                               setSelectedTicketId(ticket.id);
                               fetchResponses(ticket.id);
                            }}
                            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all hover:scale-[1.02] ${
                               selectedTicketId === ticket.id ? 'bg-primary/5 border-primary/30' : 'bg-white border-gray-100 hover:border-primary/20 shadow-soft'
                            }`}
                          >
                             <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{ticket.subject}</h3>
                                <Badge className="bg-amber-100 text-amber-700 border-none font-black text-[10px] shrink-0 uppercase tracking-widest">Open</Badge>
                             </div>
                             <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed mb-3">{ticket.description}</p>
                             <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest gap-1">
                                <Clock className="h-3 w-3" /> {new Date(ticket.created_at).toLocaleDateString()}
                             </div>
                          </div>
                       ))
                    )}
                 </div>
              )}

              {activeTab === 'RESOLVED' && (
                 <div className="space-y-4">
                    {isLoading ? (
                       <div className="py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-gray-300" /></div>
                    ) : getFilteredTickets(resolvedTickets).length === 0 ? (
                       <div className="py-12 text-center text-gray-400 font-bold text-sm">No resolved tickets found.</div>
                    ) : (
                       getFilteredTickets(resolvedTickets).map(ticket => (
                          <div 
                            key={ticket.id}
                            onClick={() => {
                               setSelectedTicketId(ticket.id);
                               fetchResponses(ticket.id);
                            }}
                            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all hover:scale-[1.02] ${
                               selectedTicketId === ticket.id ? 'bg-primary/5 border-primary/30' : 'bg-white border-gray-100 hover:border-primary/20 shadow-soft'
                            }`}
                          >
                             <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{ticket.subject}</h3>
                                <Badge className="bg-emerald-100 text-emerald-700 border-none font-black text-[10px] shrink-0 uppercase tracking-widest">Resolved</Badge>
                             </div>
                             <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed mb-3">{ticket.description}</p>
                             <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest gap-1">
                                <CheckCircle2 className="h-3 w-3" /> {new Date(ticket.updated_at).toLocaleDateString()}
                             </div>
                          </div>
                       ))
                    )}
                 </div>
              )}
           </div>

           <div className="lg:col-span-8">
              {activeTab === 'NEW' ? (
                 <Card className="border-none shadow-soft rounded-3xl overflow-hidden bg-white">
                    <CardHeader className="px-8 pt-8 pb-4 border-b border-gray-50">
                       <CardTitle className="text-xl font-bold flex items-center gap-2">
                         <ShieldCheck className="h-6 w-6 text-primary" /> Create a Support Ticket
                       </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                       <form onSubmit={createTicket} className="space-y-6">
                          <div className="space-y-2">
                             <label className="text-xs font-black uppercase tracking-widest text-gray-500">Subject</label>
                             <Input 
                               value={newSubject}
                               onChange={(e) => setNewSubject(e.target.value)}
                               placeholder="Briefly describe your issue..." 
                               className="h-14 border-gray-200 focus-visible:ring-primary/20 font-bold rounded-2xl"
                               required
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-xs font-black uppercase tracking-widest text-gray-500">Details</label>
                             <Textarea 
                               value={newDescription}
                               onChange={(e) => setNewDescription(e.target.value)}
                               placeholder="Provide as much detail as possible..." 
                               className="min-h-[200px] border-gray-200 focus-visible:ring-primary/20 font-medium p-5 rounded-3xl resize-none"
                               required
                             />
                          </div>
                          <div className="flex justify-end">
                             <Button 
                               type="submit"
                               disabled={isSubmitting}
                               className="h-14 px-8 font-bold text-sm rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 transition-all gap-2"
                             >
                               {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />} Submit Ticket
                             </Button>
                          </div>
                       </form>
                    </CardContent>
                 </Card>
              ) : selectedTicketId ? (
                 <Card className="border-none shadow-soft rounded-3xl overflow-hidden bg-white flex flex-col h-[700px]">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/50">
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                             <MessageCircle className="h-6 w-6" />
                          </div>
                          <div>
                             <h3 className="font-bold text-gray-900 text-sm">Ticket Support Chat</h3>
                             <p className="text-xs text-gray-500 font-medium">We're reviewing your ticket.</p>
                          </div>
                       </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gray-50/30">
                       {/* Initial Ticket Message */}
                       {(() => {
                          const ticket = tickets.find(t => t.id === selectedTicketId);
                          if (!ticket) return null;
                          return (
                             <div className="flex gap-4">
                                <div className="h-10 w-10 bg-white border border-gray-200 shadow-sm rounded-xl flex items-center justify-center font-black text-gray-400 text-[10px] shrink-0">ME</div>
                                <div className="space-y-1 max-w-[80%]">
                                   <div className="flex items-center gap-2">
                                      <span className="text-sm font-bold text-gray-900">You</span>
                                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(ticket.created_at).toLocaleTimeString()}</span>
                                   </div>
                                   <div className="bg-white border border-gray-100 p-5 rounded-3xl rounded-tl-none shadow-sm">
                                      <p className="text-sm font-bold text-gray-900 mb-2">{ticket.subject}</p>
                                      <p className="text-sm text-gray-600 font-medium leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
                                   </div>
                                </div>
                             </div>
                          );
                       })()}

                       {/* Responses */}
                       {responses.map((resp) => {
                          const isAdmin = resp.sender?.role === 'ADMIN' || resp.sender?.role === 'SUPER_ADMIN';
                          return (
                             <div key={resp.id} className={`flex gap-4 ${!isAdmin ? 'flex-row' : 'flex-row-reverse'}`}>
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black text-[10px] shadow-sm shrink-0 ${isAdmin ? 'bg-primary text-white shadow-primary/20' : 'bg-white border border-gray-200 text-gray-400'}`}>
                                   {isAdmin ? 'AD' : 'ME'}
                                </div>
                                <div className={`space-y-1 max-w-[80%] ${!isAdmin ? 'text-left' : 'text-right'}`}>
                                   <div className={`flex items-center gap-2 ${!isAdmin ? 'justify-start' : 'justify-end'}`}>
                                      <span className="text-sm font-bold text-gray-900">{isAdmin ? 'Support Team' : 'You'}</span>
                                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(resp.created_at).toLocaleTimeString()}</span>
                                   </div>
                                   <div className={`p-5 rounded-3xl shadow-sm ${
                                      isAdmin 
                                        ? 'bg-primary/5 border border-primary/10 rounded-tr-none text-left' 
                                        : 'bg-white border border-gray-100 rounded-tl-none text-left'
                                   }`}>
                                      <p className="text-sm text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">{resp.message}</p>
                                   </div>
                                </div>
                             </div>
                          );
                       })}
                    </div>

                    {tickets.find(t => t.id === selectedTicketId)?.status === 'RESOLVED' || tickets.find(t => t.id === selectedTicketId)?.status === 'CLOSED' ? (
                       <div className="p-6 border-t border-gray-100 bg-gray-50 text-center">
                          <p className="text-sm font-bold text-gray-500">This ticket has been settled. If you have a new issue, please open a new ticket.</p>
                       </div>
                    ) : (
                       <div className="p-6 border-t border-gray-100 bg-white shrink-0">
                          <div className="flex gap-4">
                             <Input 
                               placeholder="Type your reply here..." 
                               value={reply}
                               onChange={(e) => setReply(e.target.value)}
                               className="h-14 bg-gray-50 border-transparent rounded-2xl text-sm font-bold focus-visible:ring-primary/20 focus-visible:bg-white focus-visible:border-primary/30"
                               onKeyDown={(e) => e.key === 'Enter' && sendResponse(selectedTicketId)}
                             />
                             <Button 
                               onClick={() => sendResponse(selectedTicketId)}
                               disabled={isSending || !reply.trim()}
                               className="h-14 px-8 font-bold text-sm rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 transition-all gap-2"
                             >
                               {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />} Send
                             </Button>
                          </div>
                       </div>
                    )}
                 </Card>
              ) : (
                 <div className="h-[700px] bg-white border border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center text-center p-8">
                    <div className="h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                      <LifeBuoy className="h-10 w-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">How can we help?</h3>
                    <p className="text-sm text-gray-500 font-medium max-w-sm">Select an existing ticket from the sidebar to view updates, or create a new ticket to get in touch with our support team.</p>
                 </div>
              )}
           </div>
        </div>
      </div>
    </BuyerLayout>
  );
}
