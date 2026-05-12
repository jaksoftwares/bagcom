'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  ShieldAlert, 
  CreditCard, 
  Settings, 
  Menu, 
  X, 
  LogOut,
  ShieldCheck,
  Bell,
  Search,
  ChevronRight,
  Loader2,
  History,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentUser, getUserProfile } from '@/services/auth/authService';
import Logo from '@/components/shared/Logo';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    async function checkAdmin() {
      try {
        const user = await getCurrentUser();
        
        if (!user) {
          console.log('Admin Guard: No user found, redirecting to login');
          if (mounted) router.push('/login');
          return;
        }

        const profile = await getUserProfile(user.id);
        
        if (!profile) {
          console.log('Admin Guard: No profile found for user', user.id);
          if (mounted) router.push('/unauthorized');
          return;
        }

        if (profile.role !== 'ADMIN' && profile.role !== 'SUPER_ADMIN') {
          console.log('Admin Guard: User is not an admin', profile.role);
          if (mounted) router.push('/unauthorized');
          return;
        }

        if (mounted) {
          setAdmin(profile);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Admin Auth Check Failed:', error);
        if (mounted) router.push('/login');
      }
    }
    
    // Add a small delay to allow session to stabilize
    const timer = setTimeout(() => {
      checkAdmin();
    }, 100);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [router]);

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Verifications', href: '/admin/verifications', icon: ShieldCheck },
    { name: 'Products', href: '/admin/products', icon: ShoppingBag },
    { name: 'Disputes', href: '/admin/disputes', icon: ShieldAlert },
    { name: 'Tickets', href: '/admin/tickets', icon: MessageCircle },
    { name: 'Financials', href: '/admin/financials', icon: CreditCard },
    { name: 'Audit Logs', href: '/admin/logs', icon: History },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-primary selection:text-white font-sans">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="p-8 flex items-center justify-center border-b border-slate-100">
            <Logo variant="primary" className="h-8 w-auto" />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto custom-scrollbar">
            <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">Navigation</p>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 group ${
                    isActive 
                      ? 'bg-slate-900 text-white shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <item.icon className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'}`} />
                  {item.name}
                  {isActive && <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-50" />}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Footer */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3 mb-6 p-2 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="h-9 w-9 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-700 text-xs shadow-inner">
                {admin?.first_name?.[0]}{admin?.last_name?.[0]}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate leading-tight">{admin?.first_name} {admin?.last_name}</p>
                <p className="text-[10px] font-bold text-primary uppercase tracking-wide mt-0.5">{admin?.role}</p>
              </div>
            </div>
            <Button variant="ghost" className="w-full justify-start text-slate-500 hover:text-rose-600 hover:bg-rose-50 font-bold text-xs gap-3 rounded-lg transition-all">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-0'}`}>
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-slate-500"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="hidden md:flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg w-80 group focus-within:w-96 focus-within:bg-white focus-within:border-slate-300 transition-all duration-300">
              <Search className="h-4 w-4 text-slate-400 group-focus-within:text-slate-600" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none text-sm outline-none w-full placeholder:text-slate-400 font-medium text-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 mr-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />
              Online
            </div>
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg h-9 w-9">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-4 md:p-6 animate-in fade-in duration-500">
          {children}
        </main>
      </div>
    </div>
  );
}
