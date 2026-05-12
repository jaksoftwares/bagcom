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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    async function checkAdmin() {
      const user = await getCurrentUser();
      if (!user) {
        router.push('/login');
        return;
      }
      const profile = await getUserProfile(user.id);
      if (profile?.role !== 'ADMIN' && profile?.role !== 'SUPER_ADMIN') {
        router.push('/unauthorized');
        return;
      }
      setAdmin(profile);
      setIsLoading(false);
    }
    checkAdmin();
  }, [router]);

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Seller Verifications', href: '/admin/verifications', icon: ShieldCheck },
    { name: 'Product Moderation', href: '/admin/products', icon: ShoppingBag },
    { name: 'Dispute Center', href: '/admin/disputes', icon: ShieldAlert },
    { name: 'Support Desk', href: '/admin/tickets', icon: MessageCircle },
    { name: 'Financials & Escrow', href: '/admin/financials', icon: CreditCard },
    { name: 'Audit Logs', href: '/admin/logs', icon: History },
    { name: 'System Settings', href: '/admin/settings', icon: Settings },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 selection:bg-primary selection:text-white font-sans">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#1E293B] border-r border-white/5 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="p-8 flex items-center justify-center border-b border-white/5">
            <Logo variant="dark" className="h-8 w-auto" />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto custom-scrollbar">
            <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Core Management</p>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold transition-all duration-200 group ${
                    isActive 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`} />
                  {item.name}
                  {isActive && <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-50" />}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Footer */}
          <div className="p-6 border-t border-white/5 bg-slate-900/50">
            <div className="flex items-center gap-3 mb-6 p-2 rounded-2xl bg-white/5 border border-white/5">
              <div className="h-10 w-10 bg-slate-800 rounded-xl border border-white/10 flex items-center justify-center font-bold text-primary text-xs shadow-inner">
                {admin?.first_name?.[0]}{admin?.last_name?.[0]}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate leading-tight">{admin?.first_name} {admin?.last_name}</p>
                <p className="text-[9px] font-black text-primary uppercase tracking-[0.15em] mt-1">{admin?.role}</p>
              </div>
            </div>
            <Button variant="ghost" className="w-full justify-start text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 font-bold text-xs gap-3 rounded-xl transition-all">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:pl-72' : 'lg:pl-0'}`}>
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-[#0F172A]/80 backdrop-blur-md border-b border-white/5 h-20 flex items-center justify-between px-8">
          <div className="flex items-center gap-6">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-slate-400"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/5 px-4 py-2.5 rounded-2xl w-80 group focus-within:w-96 focus-within:border-primary/50 transition-all duration-300">
              <Search className="h-4 w-4 text-slate-500 group-focus-within:text-primary" />
              <input 
                type="text" 
                placeholder="Search command..." 
                className="bg-transparent border-none text-[13px] outline-none w-full placeholder:text-slate-500 font-medium text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 mr-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              Live Monitor
            </div>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl h-10 w-10">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
          {children}
        </main>
      </div>
    </div>
  );
}
