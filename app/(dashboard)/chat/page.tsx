'use client';

import { useState, useEffect } from 'react';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatWindow } from '@/components/chat/ChatWindow';
import Header from '@/components/navigation/Header';
import { getCurrentUser } from '@/services/auth/authService';
import { Loader2, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ChatPage() {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          window.location.href = '/login';
          return;
        }
        setUser(currentUser);

        const res = await fetch(`/api/chat/conversations?userId=${currentUser.id}`);
        const data = await res.json();
        setConversations(data.conversations || []);
      } catch (error) {
        toast({ title: "Failed to load chats", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const activeConversation = conversations.find(c => c.id === activeId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      <Header isLoggedIn={true} setIsLoggedIn={() => {}} />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className={`${activeId ? 'hidden lg:flex' : 'flex'} w-full lg:w-96 flex-shrink-0`}>
          <ChatSidebar 
            conversations={conversations} 
            activeId={activeId} 
            onSelect={setActiveId} 
            currentUserId={user?.id}
          />
        </div>

        {/* Main Chat Area */}
        <div className={`${activeId ? 'flex' : 'hidden lg:flex'} flex-1 flex-col overflow-hidden bg-white relative`}>
          {activeConversation ? (
            <ChatWindow 
              conversation={activeConversation} 
              currentUserId={user?.id} 
              onBack={() => setActiveId(null)}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-gray-50/50">
               <div className="h-20 w-20 bg-white rounded-3xl shadow-sm flex items-center justify-center text-primary mb-6">
                  <MessageSquare className="h-10 w-10" />
               </div>
               <h2 className="text-xl font-black text-gray-900 tracking-tight">Select a conversation</h2>
               <p className="text-sm text-gray-500 max-w-xs mx-auto mt-2 font-medium">Choose a chat from the sidebar to start messaging with buyers and sellers.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
