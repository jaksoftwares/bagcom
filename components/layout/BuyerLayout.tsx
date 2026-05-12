'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Heart, 
  History, 
  Bell, 
  Settings, 
  Menu, 
  X, 
  LogOut,
  ChevronRight,
  User,
  Search,
  Loader2,
  MessageCircle,
  ShieldCheck,
  ShoppingBasket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentUser, getUserProfile, signOut } from '@/services/auth/authService';

interface BuyerLayoutProps {
  children: ReactNode;
}

export default function BuyerLayout({ children }: BuyerLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function checkAuth() {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push('/login');
        return;
      }
      const profile = await getUserProfile(currentUser.id);
      setUser(profile);
      setIsLoading(false);
    }
    checkAuth();
  }, [router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const navGroups = [
    {
      title: 'Control Panel',
      items: [
        { name: 'Overview', href: '/buyer', icon: LayoutDashboard },
        { name: 'My Orders', href: '/buyer/orders', icon: ShoppingBag },
        { name: 'Saved Items', href: '/buyer/wishlist', icon: Heart },
        { name: 'Recently Viewed', href: '/buyer/recently-viewed', icon: History },
        { name: 'Messages', href: '/buyer/messages', icon: MessageCircle },
      ]
    },
    {
      title: 'Buyer Account',
      items: [
        { name: 'Notifications', href: '/buyer/notifications', icon: Bell },
        { name: 'Settings', href: '/buyer/settings', icon: Settings },
      ]
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Mobile Sidebar Overlay */}
      {!isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(true)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="p-8 border-b border-gray-50">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <ShoppingBasket className="text-white h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter uppercase text-gray-900 leading-none">Bagcom</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mt-1">Buyer Hub</span>
              </div>
            </Link>
          </div>

          {/* Navigation Groups */}
          <nav className="flex-1 px-4 py-8 space-y-8 overflow-y-auto scrollbar-none">
            {navGroups.map((group) => (
              <div key={group.title} className="space-y-3">
                <h3 className="px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {group.title}
                </h3>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 group ${
                          isActive 
                            ? 'bg-primary/5 text-primary' 
                            : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
                        }`}
                      >
                        <item.icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`} />
                        {item.name}
                        {isActive && (
                          <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Profile Section */}
          <div className="p-6 border-t border-gray-50 bg-gray-50/50">
            <div className="flex items-center gap-3 mb-6 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black uppercase border border-primary/20">
                {user?.profile_photo_url ? (
                  <img src={user.profile_photo_url} alt="Profile" className="h-full w-full rounded-xl object-cover" />
                ) : (
                  user?.first_name?.[0]
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-gray-900 truncate uppercase tracking-tight">{user?.first_name} {user?.last_name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="h-3 w-3 text-green-500" />
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Verified Account</p>
                </div>
              </div>
            </div>
            <Button 
              onClick={handleSignOut}
              variant="outline" 
              className="w-full justify-start text-red-500 border-red-100 hover:bg-red-50 font-bold gap-2 rounded-xl transition-colors"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Content Area */}
      <div className={`transition-all duration-300 min-h-screen flex flex-col ${isSidebarOpen ? 'lg:pl-72' : 'lg:pl-0'}`}>
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 h-20 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-gray-500 hover:bg-gray-100 rounded-xl"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="hidden md:flex items-center gap-3 bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-2xl w-96 group focus-within:bg-white focus-within:border-primary/30 transition-all shadow-inner">
              <Search className="h-4 w-4 text-gray-400 group-focus-within:text-primary" />
              <input 
                type="text" 
                placeholder="Search orders, tickets or help..." 
                className="bg-transparent border-none text-sm outline-none w-full placeholder:text-gray-400 font-bold"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
             <Link href="/buyer/notifications" className="relative group">
                <div className="p-2.5 rounded-xl bg-gray-50 text-gray-400 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                  <Bell className="h-5 w-5" />
                </div>
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 border-2 border-white rounded-full ring-4 ring-red-500/10" />
             </Link>
             <Link href="/buyer/settings" className="flex items-center gap-3 group bg-gray-50 p-1.5 pr-4 rounded-2xl border border-gray-100 hover:border-primary/20 transition-all">
                <div className="h-9 w-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all">
                   <User className="h-5 w-5" />
                </div>
                <div className="hidden md:block text-left">
                   <p className="text-[10px] font-black text-gray-900 leading-none uppercase tracking-tight">Account</p>
                   <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Manage Settings</p>
                </div>
             </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8 lg:p-12 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
