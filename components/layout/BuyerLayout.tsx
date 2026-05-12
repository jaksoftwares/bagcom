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
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentUser, getUserProfile } from '@/services/auth/authService';
import Header from '@/components/navigation/Header';

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

  const navItems = [
    { name: 'Dashboard', href: '/buyer', icon: LayoutDashboard },
    { name: 'My Orders', href: '/buyer/orders', icon: ShoppingBag },
    { name: 'Wishlist', href: '/buyer/wishlist', icon: Heart },
    { name: 'Recently Viewed', href: '/buyer/recently-viewed', icon: History },
    { name: 'Notifications', href: '/buyer/notifications', icon: Bell },
    { name: 'Settings', href: '/buyer/settings', icon: Settings },
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
      {/* Sidebar for Desktop */}
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
                <ShoppingBag className="text-white h-5 w-5" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase text-gray-900">Bagcom <span className="text-primary text-xs ml-1">Buyer</span></span>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 group ${
                    isActive 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary'}`} />
                  {item.name}
                  {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                </Link>
              );
            })}
          </nav>

          {/* Profile Section */}
          <div className="p-6 border-t border-gray-50 bg-gray-50/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-white border-2 border-primary/20 p-0.5 overflow-hidden">
                {user?.profile_photo_url ? (
                  <img src={user.profile_photo_url} alt="Profile" className="h-full w-full rounded-full object-cover" />
                ) : (
                  <div className="h-full w-full rounded-full bg-primary/10 flex items-center justify-center text-primary font-black uppercase">
                    {user?.first_name?.[0]}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{user?.first_name} {user?.last_name}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Verified Buyer</p>
              </div>
            </div>
            <Button variant="outline" className="w-full justify-start text-red-500 border-red-100 hover:bg-red-50 font-bold gap-2 rounded-xl">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Content Area */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:pl-72' : 'lg:pl-0'}`}>
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 h-20 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-gray-500"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="hidden md:flex items-center gap-3 bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl w-96 group focus-within:bg-white focus-within:border-primary/30 transition-all">
              <Search className="h-4 w-4 text-gray-400 group-focus-within:text-primary" />
              <input 
                type="text" 
                placeholder="Find orders or items..." 
                className="bg-transparent border-none text-sm outline-none w-full placeholder:text-gray-400 font-bold"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
             <Link href="/buyer/notifications" className="relative group">
                <div className="p-2.5 rounded-xl bg-gray-50 text-gray-400 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                  <Bell className="h-5 w-5" />
                </div>
                <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 border-2 border-white rounded-full" />
             </Link>
             <Link href="/buyer/settings" className="flex items-center gap-3 group">
                <div className="hidden md:block text-right">
                   <p className="text-xs font-bold text-gray-900 leading-none">Account Settings</p>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Manage Profile</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all">
                   <User className="h-5 w-5" />
                </div>
             </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8 lg:p-12">
          {children}
        </main>
      </div>
    </div>
  );
}
