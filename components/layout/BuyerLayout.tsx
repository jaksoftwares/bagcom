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
  ShieldCheck,
  LifeBuoy,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentUser, getUserProfile, signOut } from '@/services/auth/authService';
import Logo from '@/components/shared/Logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BuyerLayoutProps {
  children: ReactNode;
}

export default function BuyerLayout({ children }: BuyerLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    async function checkAuth() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          if (mounted) router.push('/login');
          return;
        }
        const profile = await getUserProfile(currentUser.id);

        if (profile?.is_active === false) {
          if (mounted) router.push('/suspended');
          return;
        }

        if (mounted) {
          setUser(profile);
          setIsLoading(false);
        }
      } catch (error) {
        if (mounted) router.push('/login');
      }
    }
    
    const timer = setTimeout(() => {
      checkAuth();
    }, 100);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navGroups = [
    {
      title: 'Control Panel',
      items: [
        { name: 'Overview', href: '/buyer', icon: LayoutDashboard },
        { name: 'My Orders', href: '/buyer/orders', icon: ShoppingBag },
        { name: 'Saved Items', href: '/buyer/wishlist', icon: Heart },
        { name: 'Recently Viewed', href: '/buyer/recently-viewed', icon: History }
      ]
    },
    {
      title: 'Buyer Account',
      items: [
        { name: 'Notifications', href: '/buyer/notifications', icon: Bell },
        { name: 'Settings', href: '/buyer/settings', icon: Settings }
      ]
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Sidebar Overlay for Mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200/60 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${
          isDesktopCollapsed ? 'lg:w-20' : 'lg:w-[280px]'
        } ${
          isMobileOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Floating Desktop Toggle */}
        <button 
          onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
          className="hidden lg:flex absolute -right-3 top-8 h-6 w-6 bg-white border border-gray-200 rounded-full items-center justify-center text-gray-400 hover:text-gray-900 hover:shadow-sm transition-all z-50"
        >
          {isDesktopCollapsed ? <ChevronRight className="h-3.5 w-3.5 ml-0.5" /> : <PanelLeftClose className="h-3.5 w-3.5" />}
        </button>

        <div className="h-full flex flex-col overflow-hidden">
          
          {/* Logo Section */}
          <div className="h-20 border-b border-transparent flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-3">
              <Logo variant={isDesktopCollapsed ? 'icon' : 'primary'} className={isDesktopCollapsed ? 'h-8 w-auto -ml-1.5' : 'h-8 w-auto'} />
              {!isDesktopCollapsed && <span className="font-bold text-sm tracking-widest uppercase text-gray-300 ml-1">Buyer</span>}
            </div>
            
            {/* Mobile Close Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-full h-8 w-8"
              onClick={() => setIsMobileOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation Groups */}
          <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto custom-scrollbar">
            {navGroups.map((group) => (
              <div key={group.title} className="space-y-2">
                {!isDesktopCollapsed && (
                  <h3 className="px-3 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                    {group.title}
                  </h3>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/buyer' && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        title={isDesktopCollapsed ? item.name : undefined}
                        onClick={() => {
                          if (window.innerWidth < 1024) setIsMobileOpen(false);
                        }}
                        className={`flex items-center ${isDesktopCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3 py-2.5'} rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                          isActive 
                            ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10' 
                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <item.icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-900'}`} strokeWidth={isActive ? 2.5 : 2} />
                        {!isDesktopCollapsed && (
                          <>
                            <span className="truncate">{item.name}</span>
                          </>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Help & Support Section */}
          <div className="p-4 mt-auto border-t border-gray-100">
             <Link href="/buyer/support" className={`flex items-center ${isDesktopCollapsed ? 'justify-center w-full' : 'w-full px-3 gap-3'} py-2.5 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors`}>
                <LifeBuoy className={`h-5 w-5 shrink-0 ${pathname.startsWith('/buyer/support') ? 'text-gray-900' : 'text-gray-400'}`} />
                {!isDesktopCollapsed && <span className={pathname.startsWith('/buyer/support') ? 'text-gray-900 font-semibold' : ''}>Help & Support</span>}
             </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area Wrapper */}
      <div className={`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] min-h-screen flex flex-col ${isDesktopCollapsed ? 'lg:pl-20' : 'lg:pl-[280px]'}`}>
        
        {/* Topbar / Header */}
        <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-gray-200/60 h-20 flex items-center justify-between px-4 sm:px-8 shrink-0">
          
          <div className="flex items-center gap-4 flex-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-gray-500 hover:bg-gray-100 rounded-full"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              <Menu className="h-5 w-5" strokeWidth={2.5} />
            </Button>
            
            {/* Command Search (Visual) */}
            <div className="hidden md:flex items-center gap-2 bg-gray-100/50 hover:bg-gray-100 border border-transparent hover:border-gray-200 px-3 py-2 rounded-xl w-72 lg:w-96 transition-all group cursor-pointer text-gray-400">
              <Search className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-gray-600 transition-colors" />
              <span className="text-sm font-medium flex-1 text-left select-none group-hover:text-gray-600 transition-colors">Search orders, tickets...</span>
              <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded bg-white px-1.5 font-mono text-[10px] font-bold text-gray-400 border border-gray-200 shadow-sm">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
             
             {/* Notification Bell */}
             <Link href="/buyer/notifications" className="relative p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors outline-none focus:ring-2 focus:ring-slate-900/10 block">
                <Bell className="h-5 w-5" strokeWidth={2} />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
             </Link>

             {/* Profile Dropdown Menu */}
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <button className="flex items-center gap-2 hover:bg-gray-50 p-1 pr-3 rounded-full border border-gray-200/60 transition-all outline-none focus:ring-2 focus:ring-slate-900/20 shadow-sm ml-2">
                   <div className="h-8 w-8 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-black/5">
                      {user?.profile_photo_url ? (
                        <img src={user.profile_photo_url} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-slate-900 text-white font-bold text-xs uppercase">
                          {user?.first_name?.[0]}
                        </div>
                      )}
                   </div>
                   <div className="hidden md:block text-left">
                     <p className="text-sm font-semibold text-gray-900 leading-none">{user?.first_name}</p>
                   </div>
                 </button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="w-56 rounded-xl p-2 border-gray-100 shadow-xl bg-white">
                 <DropdownMenuLabel className="font-bold px-2 py-1.5 text-[10px] text-gray-400 uppercase tracking-widest">
                   Signed in as <br /> <span className="text-gray-900 text-xs lowercase tracking-normal font-medium">{user?.email}</span>
                 </DropdownMenuLabel>
                 <DropdownMenuSeparator className="bg-gray-100 my-1" />
                 <DropdownMenuItem asChild className="rounded-lg cursor-pointer py-2.5 focus:bg-gray-50 font-medium text-sm">
                   <Link href="/buyer/settings" className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-gray-500" /> Account Settings
                   </Link>
                 </DropdownMenuItem>
                 <DropdownMenuItem asChild className="rounded-lg cursor-pointer py-2.5 focus:bg-gray-50 font-medium text-sm">
                   <Link href="/buyer/support" className="flex items-center gap-2">
                      <LifeBuoy className="h-4 w-4 text-gray-500" /> Help & Support
                   </Link>
                 </DropdownMenuItem>
                 <DropdownMenuSeparator className="bg-gray-100 my-1" />
                 <DropdownMenuItem onClick={handleSignOut} className="rounded-lg cursor-pointer py-2.5 text-red-600 focus:bg-red-50 focus:text-red-700 font-medium text-sm">
                   <LogOut className="h-4 w-4 mr-2" /> Sign Out
                 </DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>

          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
