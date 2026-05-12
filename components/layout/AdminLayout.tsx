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
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentUser, getUserProfile } from '@/services/auth/authService';

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
        router.push('/');
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
    { name: 'Product Moderation', href: '/admin/products', icon: ShoppingBag },
    { name: 'Dispute Center', href: '/admin/disputes', icon: ShieldAlert },
    { name: 'Financials & Escrow', href: '/admin/financials', icon: CreditCard },
    { name: 'System Settings', href: '/admin/settings', icon: Settings },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white selection:bg-primary selection:text-white">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#1E293B] border-r border-white/5 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-8">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <ShieldCheck className="text-white h-6 w-6" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase">Bagcom <span className="text-primary">Admin</span></span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 group ${
                    isActive 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary'}`} />
                  {item.name}
                  {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-6 border-t border-white/5 bg-[#1e293b]/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-gray-700 rounded-full flex items-center justify-center font-bold text-primary">
                {admin?.first_name?.[0]}{admin?.last_name?.[0]}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold truncate">{admin?.first_name} {admin?.last_name}</p>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest">{admin?.role}</p>
              </div>
            </div>
            <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10 font-bold gap-2">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:pl-72' : 'lg:pl-0'}`}>
        {/* Topbar */}
        <header className="sticky top-0 z-40 bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/5 h-20 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-gray-400"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/5 px-4 py-2 rounded-xl w-96 group focus-within:border-primary/50 transition-all">
              <Search className="h-4 w-4 text-gray-500 group-focus-within:text-primary" />
              <input 
                type="text" 
                placeholder="Search everything..." 
                className="bg-transparent border-none text-sm outline-none w-full placeholder:text-gray-500 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-gray-400 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full" />
            </Button>
            <div className="h-8 w-px bg-white/5 mx-2" />
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">System Live</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
