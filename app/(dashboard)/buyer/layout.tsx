'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  Heart, 
  Clock, 
  Bell, 
  MessageSquare, 
  Settings, 
  LogOut,
  ShoppingBag,
  LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { signOut } from '@/services/auth/authService';
import { useRouter } from 'next/navigation';

const sidebarLinks = [
  { href: '/buyer', label: 'Overview', icon: LayoutDashboard },
  { href: '/buyer/orders', label: 'My Orders', icon: ShoppingBag },
  { href: '/buyer/wishlist', label: 'Saved Items', icon: Heart },
  { href: '/buyer/recently-viewed', label: 'Recently Viewed', icon: Clock },
  { href: '/buyer/messages', label: 'Messages', icon: MessageSquare },
  { href: '/buyer/notifications', label: 'Notifications', icon: Bell },
  { href: '/buyer/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="max-w-[1440px] mx-auto flex gap-8 p-4 md:p-8">
        
        {/* Sidebar */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-border/40 shadow-soft overflow-hidden sticky top-24">
            <div className="p-6 border-b border-border/40 bg-muted/5">
              <h2 className="text-lg font-bold tracking-tight text-foreground">Buyer Account</h2>
              <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-widest opacity-60">Control Panel</p>
            </div>
            
            <nav className="p-4 space-y-1">
              {sidebarLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group",
                      isActive 
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <link.icon className={cn(
                      "h-4 w-4 transition-transform group-hover:scale-110",
                      isActive ? "text-white" : "text-muted-foreground/60"
                    )} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-border/40 mt-4">
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl font-semibold"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl border border-border/40 shadow-soft p-6 md:p-8 min-h-[calc(100vh-160px)]">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
