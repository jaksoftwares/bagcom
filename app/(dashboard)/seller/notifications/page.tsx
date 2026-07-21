'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/services/auth/authService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  MessageSquare, 
  ShoppingBag, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Loader2
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
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Notifications</h1>
        {notifications.length > 0 && notifications.some(n => !n.is_sent) && (
          <Button 
            onClick={() => markAsRead()}
            variant="ghost" 
            className="text-primary hover:text-primary hover:bg-primary/5 font-bold text-xs h-9 px-4 rounded-lg gap-2"
          >
            <CheckCircle2 className="h-4 w-4" /> Mark all read
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="py-32 flex flex-col items-center justify-center text-center space-y-4">
          <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
            <Bell className="h-8 w-8" />
          </div>
          <p className="text-gray-500 font-medium text-sm">No notifications</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <Card 
              key={notif.id} 
              className={`border-none transition-all duration-200 overflow-hidden ${
                notif.is_sent 
                  ? 'bg-white shadow-sm hover:shadow-md' 
                  : 'bg-primary/[0.02] ring-1 ring-primary/20 shadow-md shadow-primary/5 hover:bg-primary/[0.04]'
              }`}
            >
              <CardContent className="p-4 sm:p-5 flex gap-4">
                <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center shrink-0 ${
                  notif.is_sent ? 'bg-gray-50' : 'bg-white shadow-sm'
                }`}>
                  {getIcon(notif.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className={`text-sm font-bold truncate ${
                      notif.is_sent ? 'text-gray-900' : 'text-primary'
                    }`}>
                      {notif.title}
                    </h3>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest shrink-0 flex items-center gap-1">
                      <Clock className="h-3 w-3 hidden sm:block" /> 
                      {new Date(notif.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed line-clamp-2">
                    {notif.body}
                  </p>
                  
                  {!notif.is_sent && (
                    <div className="mt-3">
                      <button 
                        onClick={() => markAsRead(notif.id)}
                        className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                      >
                        Mark Read
                      </button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
