'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Send, 
  MoreVertical, 
  ShoppingCart, 
  ShieldCheck, 
  Image as ImageIcon,
  Loader2,
  ChevronLeft
} from 'lucide-react';
import { useChat } from '@/lib/hooks/useChat';

interface ChatWindowProps {
  conversation: any;
  currentUserId: string;
  onBack?: () => void;
}

export function ChatWindow({ conversation, currentUserId, onBack }: ChatWindowProps) {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, sendMessage } = useChat(conversation?.id, currentUserId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    const text = inputText;
    setInputText('');
    await sendMessage(text);
  };

  const partner = conversation.buyer_id === currentUserId ? conversation.seller : conversation.buyer;

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <header className="px-6 h-20 flex items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="lg:hidden h-10 w-10">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}
          <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-primary overflow-hidden shadow-sm">
            {partner?.profile_photo_url ? (
              <img src={partner.profile_photo_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <span>{partner?.first_name?.[0]}{partner?.last_name?.[0]}</span>
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 leading-tight">{partner?.first_name} {partner?.last_name}</h3>
            <div className="flex items-center gap-1.5">
               <span className="h-2 w-2 bg-green-500 rounded-full" />
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Online</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
           {conversation.product && (
             <Badge className="bg-primary/5 text-primary border-primary/10 hover:bg-primary/10 transition-colors hidden sm:flex items-center gap-2 px-3 py-1.5 h-auto rounded-xl">
                <ShoppingCart className="h-3 w-3" />
                <span className="text-[10px] font-black uppercase tracking-tight truncate max-w-[120px]">{conversation.product.title}</span>
             </Badge>
           )}
           <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-400">
             <MoreVertical className="h-5 w-5" />
           </Button>
        </div>
      </header>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-primary/40" />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 max-w-xs mx-auto">
             <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary/20">
                <ShieldCheck className="h-8 w-8" />
             </div>
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-loose">
               Start your safe conversation. Remember never to share personal M-PESA details in chat.
             </p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.sender_id === currentUserId;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] space-y-1`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm font-medium shadow-sm transition-all hover:shadow-md ${
                    isMe 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-white text-gray-900 rounded-tl-none border border-gray-100'
                  }`}>
                    {msg.message}
                  </div>
                  <p className={`text-[9px] font-bold uppercase tracking-widest text-gray-400 ${isMe ? 'text-right' : 'text-left'}`}>
                    {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-white border-t border-gray-100 sticky bottom-0">
        <form onSubmit={handleSend} className="flex gap-3 items-center">
          <Button type="button" variant="ghost" size="icon" className="h-12 w-12 text-gray-400 hover:text-primary hover:bg-primary/5 shrink-0 rounded-xl">
             <ImageIcon className="h-5 w-5" />
          </Button>
          <div className="relative flex-1">
            <Input 
              placeholder="Type your message..." 
              className="h-12 border-gray-200 bg-gray-50 focus:bg-white rounded-xl pr-12 text-sm font-medium transition-all"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <Button 
              type="submit" 
              className="absolute right-1 top-1 h-10 w-10 p-0 rounded-lg shadow-lg hover:shadow-primary/20 transition-all"
              disabled={!inputText.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
