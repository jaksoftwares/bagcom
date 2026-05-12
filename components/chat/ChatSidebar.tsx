'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, MessageSquare, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ChatSidebarProps {
  conversations: any[];
  activeId: string | null;
  onSelect: (id: string) => void;
  currentUserId: string;
}

export function ChatSidebar({ conversations, activeId, onSelect, currentUserId }: ChatSidebarProps) {
  const [search, setSearch] = useState('');

  const filtered = conversations.filter(c => {
    const partner = c.buyer_id === currentUserId ? c.seller : c.buyer;
    const name = `${partner?.first_name} ${partner?.last_name}`.toLowerCase();
    return name.includes(search.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB] border-r border-gray-200 w-full max-w-xs">
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-black text-gray-900 tracking-tight">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search conversations..." 
            className="pl-10 h-11 bg-white border-gray-200 rounded-xl focus:ring-primary/20 text-sm font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-1 pb-6">
        {filtered.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <MessageSquare className="h-10 w-10 text-gray-200 mx-auto" />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No chats found</p>
          </div>
        ) : (
          filtered.map((conv) => {
            const partner = conv.buyer_id === currentUserId ? conv.seller : conv.buyer;
            const isActive = activeId === conv.id;
            const hasUnread = conv.last_message && !conv.last_message.is_read && conv.last_message.sender_id !== currentUserId;

            return (
              <button
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={`w-full text-left p-4 rounded-2xl transition-all duration-200 group flex gap-3 items-center ${
                  isActive 
                    ? 'bg-white shadow-md ring-1 ring-black/5' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-400 overflow-hidden border-2 border-white shadow-sm">
                    {partner?.profile_photo_url ? (
                      <img src={partner.profile_photo_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span>{partner?.first_name?.[0]}{partner?.last_name?.[0]}</span>
                    )}
                  </div>
                  {hasUnread && (
                    <span className="absolute top-0 right-0 h-3.5 w-3.5 bg-primary border-2 border-white rounded-full animate-pulse shadow-sm" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h3 className={`text-sm font-bold truncate ${isActive ? 'text-primary' : 'text-gray-900'}`}>
                      {partner?.first_name} {partner?.last_name}
                    </h3>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      {conv.last_message ? new Date(conv.last_message.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <p className={`text-xs truncate ${hasUnread ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                    {conv.last_message?.message || 'Started a conversation'}
                  </p>
                  {conv.product && (
                    <div className="mt-1 flex items-center gap-1 opacity-60">
                      <Clock className="h-3 w-3" />
                      <span className="text-[9px] font-bold uppercase tracking-widest">{conv.product.title}</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
