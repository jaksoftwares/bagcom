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
  X, 
  LogOut,
  ChevronRight,
  User,
  Search,
  Loader2,
  Plus,
  Bell,
  Store,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentUser, getUserProfile } from '@/services/auth/authService';
import Logo from '@/components/shared/Logo';

interface SellerLayoutProps {
  children: ReactNode;
}

export default function SellerLayout({ children }: SellerLayoutProps) {
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user?.role === 'SELLER' && user?.seller_status !== 'APPROVED') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-md w-full space-y-8">
          <div className="flex justify-center">
             <div className="h-24 w-24 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 animate-pulse">
                <ShieldCheck className="h-12 w-12" />
             </div>
          </div>
          <div className="space-y-4">
             <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
               Your Seller Account is <br /> <span className="text-indigo-600">Under Review</span>
             </h1>
             <p className="text-gray-500 font-medium leading-relaxed">
               Welcome to Bagcom! We take quality seriously. Our administrative team is currently reviewing your KYC details. 
             </p>
          </div>
          
          <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4 shadow-sm">
             <div className="flex items-center gap-4 text-left">
                <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                   <Bell className="h-5 w-5" />
                </div>
                <div>
                   <p className="text-sm font-bold text-gray-900">What's Next?</p>
                   <p className="text-xs text-gray-500 font-medium">You will receive an email as soon as your account is activated.</p>
                </div>
             </div>
             <div className="h-px bg-gray-50" />
             <div className="flex items-center gap-4 text-left">
                <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
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
          
          <button onClick={() => router.push('/login')} className="text-xs font-bold text-gray-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">
             Switch Account
          </button>
        </div>
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
          <div className="p-8 border-b border-gray-50 flex justify-center">
            <Logo variant="primary" className="h-10 w-auto" />
          </div>

          {/* Create Listing Button */}
          <div className="px-6 py-6">
             <Link href="/seller?tab=add-product">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 rounded-xl py-6 font-bold gap-2">
                   <Plus className="h-5 w-5" /> Create Listing
                </Button>
             </Link>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 group ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-600'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600'}`} />
                  {item.name}
                  {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                </Link>
              );
            })}
          </nav>

          {/* Profile Section */}
          <div className="p-6 border-t border-gray-50 bg-gray-50/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-white border-2 border-indigo-100 p-0.5 overflow-hidden">
                {user?.profile_photo_url ? (
                  <img src={user.profile_photo_url} alt="Profile" className="h-full w-full rounded-full object-cover" />
                ) : (
                  <div className="h-full w-full rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-black uppercase">
                    {user?.first_name?.[0]}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{user?.first_name} {user?.last_name}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Verified Seller</p>
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
            <div className="hidden md:flex items-center gap-3 bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl w-96 group focus-within:bg-white focus-within:border-indigo-200 transition-all">
              <Search className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-600" />
              <input 
                type="text" 
                placeholder="Search orders, inventory or help..." 
                className="bg-transparent border-none text-sm outline-none w-full placeholder:text-gray-400 font-bold"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
             <Link href="/seller/notifications" className="relative group">
                <div className="p-2.5 rounded-xl bg-gray-50 text-gray-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                   <Bell className="h-5 w-5" />
                </div>
                <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 border-2 border-white rounded-full" />
             </Link>
             <Link href="/seller/settings" className="flex items-center gap-3 group">
                <div className="hidden md:block text-right">
                   <p className="text-xs font-bold text-gray-900 leading-none">Seller Settings</p>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Manage Store</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
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
