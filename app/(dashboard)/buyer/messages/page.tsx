'use client';

import { useState } from 'react';
import { 
  Search, 
  User, 
  MoreVertical, 
  Send, 
  Paperclip, 
  Phone, 
  Video,
  CheckCheck,
  Circle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Mock data for initial UI
const conversations = [
  {
    id: 1,
    user: "Maina Gadgets",
    lastMessage: "Is the MacBook still available for pickup?",
    time: "2m ago",
    unread: 2,
    online: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maina"
  },
  {
    id: 2,
    user: "Sarah Furniture",
    lastMessage: "I can offer KSh 10,000 for the chair.",
    time: "1h ago",
    unread: 0,
    online: false,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
  }
];

export default function MessagesPage() {
  const [selectedConv, setSelectedConv] = useState(conversations[0]);

  return (
    <div className="h-[calc(100vh-210px)] flex gap-6 overflow-hidden">
      
      {/* Contact List */}
      <div className="w-80 flex-shrink-0 flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search messages..." 
            className="pl-10 h-11 rounded-xl bg-muted/5 border-border/40"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConv(conv)}
              className={cn(
                "w-full flex items-center gap-4 p-3 rounded-2xl transition-all border border-transparent text-left",
                selectedConv.id === conv.id 
                  ? "bg-primary/5 border-primary/10" 
                  : "hover:bg-muted/50"
              )}
            >
              <div className="relative">
                <div className="h-12 w-12 rounded-full overflow-hidden border border-border/20">
                  <img src={conv.avatar} alt={conv.user} />
                </div>
                {conv.online && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <span className="font-bold text-sm text-foreground truncate">{conv.user}</span>
                  <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">{conv.time}</span>
                </div>
                <p className={cn(
                  "text-xs truncate",
                  conv.unread > 0 ? "text-foreground font-bold" : "text-muted-foreground"
                )}>
                  {conv.lastMessage}
                </p>
              </div>
              {conv.unread > 0 && (
                <div className="h-5 min-w-[20px] bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center px-1">
                  {conv.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-muted/10 rounded-3xl border border-border/40 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 bg-white border-b border-border/40 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-full overflow-hidden border border-border/20">
                <img src={selectedConv.avatar} alt={selectedConv.user} />
             </div>
             <div>
                <h3 className="font-bold text-sm text-foreground">{selectedConv.user}</h3>
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest flex items-center gap-1">
                   <Circle className="h-1.5 w-1.5 fill-current" /> Online
                </span>
             </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 text-muted-foreground">
               <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 text-muted-foreground">
               <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
          <div className="self-center bg-muted/30 px-3 py-1 rounded-full text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
             Today
          </div>
          
          <div className="self-end max-w-[70%] space-y-1">
             <div className="bg-primary text-white px-4 py-3 rounded-2xl rounded-tr-none text-sm font-medium shadow-sm">
                Hi! Is the MacBook still available for pickup today? I'm near the campus.
             </div>
             <div className="flex items-center justify-end gap-1 text-[10px] font-medium text-muted-foreground">
                10:42 AM <CheckCheck className="h-3 w-3 text-primary" />
             </div>
          </div>

          <div className="self-start max-w-[70%] space-y-1">
             <div className="bg-white border border-border/40 px-4 py-3 rounded-2xl rounded-tl-none text-sm font-medium shadow-sm">
                Yes, it is! I'll be available until 6 PM.
             </div>
             <div className="text-[10px] font-medium text-muted-foreground">
                10:45 AM
             </div>
          </div>
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-border/40">
           <div className="flex items-center gap-2 bg-muted/30 rounded-2xl p-1 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 transition-all">
              <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-muted-foreground">
                 <Paperclip className="h-5 w-5" />
              </Button>
              <Input 
                placeholder="Type your message..." 
                className="border-none bg-transparent shadow-none focus-visible:ring-0 text-sm font-medium py-6"
              />
              <Button className="rounded-xl h-11 px-5 font-bold gap-2 shadow-lg shadow-primary/20">
                 Send <Send className="h-4 w-4" />
              </Button>
           </div>
        </div>

      </div>

    </div>
  );
}
