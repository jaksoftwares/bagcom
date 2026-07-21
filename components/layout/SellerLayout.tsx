'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Wallet, 
  Settings, 
  Menu, 
  LogOut,
  ChevronRight,
  Search,
  Loader2,
  Bell,
  Store,
  ShieldCheck,
  LifeBuoy,
  PanelLeftClose,
  PanelLeft,
  X
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

interface SellerLayoutProps {
  children: ReactNode;
}

export default function SellerLayout({ children }: SellerLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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

  const navItems = [
    { name: 'Overview', href: '/seller', icon: LayoutDashboard },
    { name: 'Orders', href: '/seller/orders', icon: ShoppingCart },
    { name: 'Inventory', href: '/seller/inventory', icon: Package },
    { name: 'Analytics', href: '/seller/analytics', icon: BarChart3 },
    { name: 'Payments', href: '/seller/payouts', icon: Wallet },
    { name: 'Settings', href: '/seller/settings', icon: Settings },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-900" />
      </div>
    );
  }

  // Under Review State
  if (user?.role === 'SELLER' && user?.seller_status !== 'APPROVED') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-md w-full space-y-8">
          <div className="flex justify-center">
             <div className="h-24 w-24 bg-slate-900 rounded-3xl flex items-center justify-center text-white shadow-xl">
                <ShieldCheck className="h-12 w-12" />
             </div>
          </div>
          <div className="space-y-4">
             <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
               Your Seller Account is <br /> <span className="text-slate-500">Under Review</span>
             </h1>
             <p className="text-gray-500 font-medium leading-relaxed">
               Welcome to Bagcom! We take quality seriously. Our team is currently reviewing your account details.
             </p>
          </div>
          
          <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4 shadow-sm">
             <div className="flex items-center gap-4 text-left">
                <div className="h-10 w-10 rounded-full bg-slate-50 text-slate-900 flex items-center justify-center shrink-0">
                   <Bell className="h-5 w-5" />
                </div>
                <div>
                   <p className="text-sm font-bold text-gray-900">What's Next?</p>
                   <p className="text-xs text-gray-500 font-medium">You will receive an email as soon as your account is activated.</p>
                </div>
             </div>
             <div className="h-px bg-gray-50" />
             <div className="flex items-center gap-4 text-left">
                <div className="h-10 w-10 rounded-full bg-slate-50 text-slate-900 flex items-center justify-center shrink-0">
                   <Store className="h-5 w-5" />
                </div>
                <div>
                   <p className="text-sm font-bold text-gray-900">Account Type</p>
                   <p className="text-xs text-gray-500 font-medium">{user?.business_name || 'Individual Seller'}</p>
                </div>
             </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full h-12 rounded-xl font-bold gap-2 border-gray-200"
            onClick={() => router.push('/')}
          >
            Return to Marketplace
          </Button>
          
          <button onClick={handleSignOut} className="text-xs font-bold text-gray-400 hover:text-slate-900 transition-colors uppercase tracking-widest">
             Switch Account
          </button>
        </div>
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
              {!isDesktopCollapsed && <span className="font-bold text-sm tracking-widest uppercase text-gray-300 ml-1">Seller</span>}
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

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
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
          </nav>

          {/* Help & Support Section */}
          <div className="p-4 mt-auto">
             <Link href="/seller/support" className={`flex items-center ${isDesktopCollapsed ? 'justify-center w-full' : 'w-full px-3 gap-3'} py-2.5 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors`}>
                <LifeBuoy className={`h-5 w-5 shrink-0 ${pathname === '/seller/support' ? 'text-gray-900' : 'text-gray-400'}`} />
                {!isDesktopCollapsed && <span className={pathname === '/seller/support' ? 'text-gray-900 font-semibold' : ''}>Help & Support</span>}
             </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area Wrapper */}
      <div className={`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isDesktopCollapsed ? 'lg:pl-20' : 'lg:pl-[280px]'}`}>
        
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
              <span className="text-sm font-medium flex-1 text-left select-none group-hover:text-gray-600 transition-colors">Search anything...</span>
              <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded bg-white px-1.5 font-mono text-[10px] font-bold text-gray-400 border border-gray-200 shadow-sm">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
             
             {/* Notification Bell */}
             <button className="relative p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors outline-none focus:ring-2 focus:ring-slate-900/10">
                <Bell className="h-5 w-5" strokeWidth={2} />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
             </button>

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
                   <Link href="/seller/settings" className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-gray-500" /> Store Settings
                   </Link>
                 </DropdownMenuItem>
                 <DropdownMenuItem asChild className="rounded-lg cursor-pointer py-2.5 focus:bg-gray-50 font-medium text-sm">
                   <Link href={`/store/${user?.business_name?.toLowerCase().replace(/\s+/g, '-') || 'shop'}`} className="flex items-center gap-2">
                      <Store className="h-4 w-4 text-gray-500" /> View Storefront
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

        {/* Dynamic Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
