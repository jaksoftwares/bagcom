import { ShoppingCart, User, Search, Menu, X, Bell, Heart, MessageCircle, LogOut, Settings, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import Logo from '../shared/Logo';
import { signOut, getCurrentUser, getUserProfile } from '@/services/auth/authService';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  isLoggedIn?: boolean;
  setIsLoggedIn?: (val: boolean) => void;
  userRole?: 'admin' | 'seller' | 'buyer';
}

export default function Header({ isLoggedIn, setIsLoggedIn, userRole }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const { totalItems } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function loadUser() {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        try {
          const userProfile = await getUserProfile(currentUser.id);
          setProfile(userProfile);

          // Fetch initial unread count
          const res = await fetch(`/api/chat/messages/unread?userId=${currentUser.id}`);
          const data = await res.json();
          setUnreadCount(data.count || 0);

          // Subscribe to new messages for any conversation this user is part of
          const { supabase } = await import('@/lib/supabase/client');
          
          const channel = supabase
            .channel('global-unread')
            .on(
              'postgres_changes',
              { event: 'INSERT', schema: 'public', table: 'messages' },
              async (payload) => {
                if (payload.new.sender_id !== currentUser.id) {
                   // Check if the conversation belongs to the user
                   const { data: conv } = await supabase
                    .from('conversations')
                    .select('id')
                    .or(`buyer_id.eq.${currentUser.id},seller_id.eq.${currentUser.id}`)
                    .eq('id', payload.new.conversation_id)
                    .single();
                  
                   if (conv) {
                      setUnreadCount(prev => prev + 1);
                   }
                }
              }
            )
            .subscribe();

          return () => {
            supabase.removeChannel(channel);
          };

        } catch (e) {
          console.error('Error loading profile', e);
        }
      }
    }
    loadUser();
  }, [pathname]);

  const handleLogout = async () => {
    await signOut();
    setUser(null);
    setProfile(null);
    router.refresh();
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <header className="bg-background/80 backdrop-blur-md border-b sticky top-0 z-50 transition-all">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Logo className="xs:mr-4 sm:mr-8" />
            </div>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 h-4 w-4" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search marketplace..."
                  className="pl-10 pr-4 h-11 w-full rounded-sm border-border/40 bg-muted/20 focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all shadow-none font-medium"
                />
              </div>
            </form>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link href="/products" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Browse
              </Link>
              <Link href="/categories" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Categories
              </Link>
              
              <div className="h-6 w-px bg-border mx-2" />

              {user ? (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" asChild className="relative rounded-full hover:bg-primary/5 hover:text-primary h-10 w-10">
                    <Link href="/chat">
                      <MessageCircle className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-4 min-w-4 flex items-center justify-center p-1 bg-primary text-white border-white border-2 text-[10px]">
                          {unreadCount}
                        </Badge>
                      )}
                    </Link>
                  </Button>


                  <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-primary/5 hover:text-primary h-10 w-10">
                    <Heart className="h-5 w-5" />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="pl-1 pr-2 py-1 rounded-full flex items-center space-x-2 hover:bg-primary/5 border border-transparent">
                        <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center border border-primary/20">
                          <User className="h-4 w-4" />
                        </div>
                        <span className="hidden xl:block text-sm font-semibold text-foreground/90">
                          {profile?.first_name || 'My Account'}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl shadow-soft border-primary/10">
                      <DropdownMenuLabel className="font-heading">Account Overview</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem asChild className="rounded-lg focus:bg-primary/5 focus:text-primary cursor-pointer">
                        <Link href={profile?.role === 'SELLER' ? '/seller' : '/buyer'} className="w-full flex items-center gap-2">
                          <LayoutDashboard className="h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>

                      {(profile?.role === 'ADMIN' || profile?.role === 'SUPER_ADMIN') && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild className="rounded-lg focus:bg-rose-500/5 focus:text-rose-500 cursor-pointer bg-rose-500/5 font-bold">
                            <Link href="/admin" className="w-full flex items-center gap-2">
                              <ShieldCheck className="h-4 w-4 text-rose-500" />
                              <span className="text-rose-600">Admin Panel</span>
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}

                      <DropdownMenuItem asChild className="rounded-lg focus:bg-primary/5 focus:text-primary cursor-pointer">
                        <Link href="/settings" className="w-full flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="rounded-lg focus:bg-destructive/5 focus:text-destructive cursor-pointer">
                        <div className="flex items-center gap-2 w-full">
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center space-x-4 ml-6">
                  <Link
                    href="/login"
                    className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Log in
                  </Link>
                  <Button
                    asChild
                    className="rounded-md bg-primary text-white px-5 h-10 text-sm font-semibold shadow-subtle"
                  >
                    <Link href="/register">Sell items</Link>
                  </Button>
                </div>
              )}
            </nav>

            <div className="flex items-center space-x-2 lg:hidden">
              {user && (
                <Link href="/cart">
                  <Button variant="ghost" size="icon" className="relative rounded-sm">
                    <ShoppingCart className="h-5 w-5 text-foreground/80" />
                    {totalItems > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-4 min-w-4 flex items-center justify-center p-0 text-[10px] bg-primary text-white border-white border-2">
                        {totalItems}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                className="rounded-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="lg:hidden pb-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                className="pl-10 pr-4 py-5 w-full rounded-full border-muted bg-muted/50 focus:bg-white focus:border-primary transition-all shadow-none"
              />
            </div>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMenuOpen && (
          <div className="lg:hidden bg-background border-t shadow-2xl animate-in slide-in-from-top duration-300">
            <div className="px-4 py-6 space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto">
              <div className="grid grid-cols-1 gap-2">
                <Link 
                  href="/products" 
                  className="flex items-center py-3 px-4 text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl transition-all font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Browse Products
                </Link>
                <Link 
                  href="/categories" 
                  className="flex items-center py-3 px-4 text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl transition-all font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Categories
                </Link>
              </div>
              
              <div className="h-px bg-border my-4" />

              {user ? (
                <div className="space-y-2">
                  <Link 
                    href={profile?.role === 'SELLER' ? '/seller' : '/buyer'} 
                    className="flex items-center py-3 px-4 text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl transition-all font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {(profile?.role === 'ADMIN' || profile?.role === 'SUPER_ADMIN') && (
                    <div className="pt-2 mt-2 border-t border-border/40">
                      <Link 
                        href="/admin" 
                        className="flex items-center py-3 px-4 text-rose-500 bg-rose-500/5 rounded-xl transition-all font-bold"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Link>
                    </div>
                  )}
                  <Link 
                    href="/cart" 
                    className="flex items-center justify-between py-3 px-4 text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl transition-all font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>My Cart</span>
                    {totalItems > 0 && <Badge className="bg-primary text-white">{totalItems}</Badge>}
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full rounded-sm py-6 mt-4 border-destructive/20 text-destructive hover:bg-destructive/5 uppercase font-bold text-[11px] tracking-widest"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 pt-2">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full rounded-sm py-6 font-bold border-primary/20 text-primary uppercase tracking-widest text-[11px]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full rounded-sm py-6 font-bold bg-primary text-white uppercase tracking-widest text-[11px]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}