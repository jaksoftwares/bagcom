'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/services/auth/authService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  MessageSquare, 
  ShoppingBag, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Trash2,
  Loader2,
  AlertCircle,
  MoreHorizontal
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function NotificationsPage() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return;
        setUser(currentUser);

        const res = await fetch(`/api/notifications?userId=${currentUser.id}`);
        const data = await res.json();
        setNotifications(data.notifications || []);
      } catch (error) {
        toast({ title: "Failed to load notifications", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    loadNotifications();
  }, []);

  const markAsRead = async (id?: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          notificationId: id, 
          userId: user.id, 
          markAll: !id 
        })
      });
      
      if (id) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_sent: true } : n));
      } else {
        setNotifications(prev => prev.map(n => ({ ...n, is_sent: true })));
        toast({ title: "All caught up!" });
      }
    } catch (error) {
      toast({ title: "Action failed", variant: "destructive" });
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'ORDER': return <ShoppingBag className="h-5 w-5 text-primary" />;
      case 'CHAT': return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'SECURITY': return <ShieldCheck className="h-5 w-5 text-emerald-500" />;
      default: return <Bell className="h-5 w-5 text-amber-500" />;
    }
  };

  return (
    <div className="max-w-4xl space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight text-gray-900">Activity Feed</h1>
            <p className="text-gray-500 font-medium">Stay updated with your orders, messages, and security alerts.</p>
          </div>
          <Button 
            onClick={() => markAsRead()}
            variant="outline" 
            className="border-gray-200 hover:bg-gray-50 font-bold text-xs h-11 px-6 rounded-xl gap-2"
          >
            <CheckCircle2 className="h-4 w-4" /> Mark all as read
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-24 text-center space-y-6 max-w-sm mx-auto">
             <div className="h-20 w-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mx-auto">
                <Bell className="h-10 w-10" />
             </div>
             <div>
                <h3 className="text-xl font-bold text-gray-900">All quiet for now</h3>
                <p className="text-sm text-gray-500 mt-2">We'll notify you here when something important happens.</p>
             </div>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <Card 
                key={notif.id} 
                className={`border-none transition-all duration-300 ${notif.is_sent ? 'bg-white' : 'bg-primary/5 ring-1 ring-primary/10 shadow-lg shadow-primary/5'}`}
              >
                <CardContent className="p-6">
                  <div className="flex gap-5">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${notif.is_sent ? 'bg-gray-50' : 'bg-white shadow-sm'}`}>
                      {getIcon(notif.type)}
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <h3 className={`text-sm font-bold ${notif.is_sent ? 'text-gray-900' : 'text-primary'}`}>
                          {notif.title}
                        </h3>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Clock className="h-3 w-3" /> {new Date(notif.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
                        {notif.body}
                      </p>
                      <div className="pt-2 flex items-center gap-4">
                         {!notif.is_sent && (
                           <button 
                             onClick={() => markAsRead(notif.id)}
                             className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                           >
                             Dismiss
                           </button>
                         )}
                         <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">
                           View Details
                         </button>
                      </div>
                    </div>

                    <button className="h-8 w-8 flex items-center justify-center text-gray-300 hover:text-gray-900 transition-colors">
                       <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
  );
}
