'use client';

import { useState } from 'react';
import { ShoppingCart, User, Search, Menu, X, Bell, Heart, MessageCircle } from 'lucide-react';
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
import AuthModal from './AuthModal';

interface HeaderProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  userRole: 'admin' | 'seller' | 'buyer';
}

export default function Header({ isLoggedIn, setIsLoggedIn, userRole }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <>
      <header className="bg-white shadow-lg border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center min-w-0">
              <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-white font-bold text-sm sm:text-lg">BC</span>
                </div>
                <div className="hidden xs:block min-w-0">
                  <span className="text-base sm:text-xl font-bold text-gray-900 truncate">BagCom</span>
                  <p className="text-xs text-gray-500 -mt-1 hidden sm:block">Marketplace</p>
                </div>
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-xl xl:max-w-2xl mx-6 xl:mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search products, categories, sellers..."
                  className="pl-12 pr-4 py-3 w-full rounded-full border-2 border-gray-200 focus:border-blue-500 transition-colors"
                />
                <Button 
                  size="sm" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-4 xl:px-6"
                >
                  <span className="hidden xl:inline">Search</span>
                  <Search className="h-4 w-4 xl:hidden" />
                </Button>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              <Link href="/products" className="px-2 xl:px-3 py-2 text-sm xl:text-base text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                Second-Hand
              </Link>
              <Link href="/new-products" className="px-2 xl:px-3 py-2 text-sm xl:text-base text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                New Products
              </Link>
              <Link href="/categories" className="px-2 xl:px-3 py-2 text-sm xl:text-base text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                Categories
              </Link>
              
              {isLoggedIn ? (
                <div className="flex items-center space-x-1 xl:space-x-2 ml-2 xl:ml-4">
                  {/* Notifications */}
                  <Button variant="ghost" size="sm" className="relative p-2">
                    <Bell className="h-4 w-4 xl:h-5 xl:w-5" />
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 xl:h-5 xl:w-5 flex items-center justify-center p-0 text-xs">
                      3
                    </Badge>
                  </Button>

                  {/* Messages */}
                  <Button variant="ghost" size="sm" className="relative p-2">
                    <MessageCircle className="h-4 w-4 xl:h-5 xl:w-5" />
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 xl:h-5 xl:w-5 flex items-center justify-center p-0 text-xs">
                      2
                    </Badge>
                  </Button>

                  {/* Wishlist */}
                  <Button variant="ghost" size="sm" className="relative p-2">
                    <Heart className="h-4 w-4 xl:h-5 xl:w-5" />
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 xl:h-5 xl:w-5 flex items-center justify-center p-0 text-xs">
                      5
                    </Badge>
                  </Button>

                  {/* Cart */}
                  <Link href="/cart">
                    <Button variant="ghost" size="sm" className="relative p-2">
                      <ShoppingCart className="h-4 w-4 xl:h-5 xl:w-5" />
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 xl:h-5 xl:w-5 flex items-center justify-center p-0 text-xs bg-green-500">
                        3
                      </Badge>
                    </Button>
                  </Link>

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center space-x-2 p-2">
                        <div className="w-7 h-7 xl:w-8 xl:h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                          <User className="h-3 w-3 xl:h-4 xl:w-4 text-white" />
                        </div>
                        <span className="hidden 2xl:block text-sm font-medium">John Doe</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile">Profile Settings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/orders">My Orders</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/wishlist">Wishlist</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center space-x-2 ml-2 xl:ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAuthClick('login')}
                    className="px-3 xl:px-6 text-sm"
                  >
                    Login
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAuthClick('signup')}
                    className="px-3 xl:px-6 text-sm bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </nav>

            {/* Mobile Icons and Menu Button */}
            <div className="flex items-center space-x-2 lg:hidden">
              {isLoggedIn && (
                <>
                  <Link href="/cart">
                    <Button variant="ghost" size="sm" className="relative p-2">
                      <ShoppingCart className="h-5 w-5" />
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs bg-green-500">
                        3
                      </Badge>
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="relative p-2">
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs">
                      3
                    </Badge>
                  </Button>
                </>
              )}
              
              <button
                className="p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="lg:hidden pb-3 sm:pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                className="pl-10 pr-4 py-2.5 sm:py-3 w-full rounded-lg border-2 border-gray-200 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t shadow-lg">
            <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-2 sm:space-y-3 max-h-[calc(100vh-120px)] overflow-y-auto">
              <Link 
                href="/products" 
                className="flex items-center py-2.5 sm:py-3 px-3 sm:px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Second-Hand Products
              </Link>
              <Link 
                href="/new-products" 
                className="flex items-center py-2.5 sm:py-3 px-3 sm:px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                New Products
              </Link>
              <Link 
                href="/categories" 
                className="flex items-center py-2.5 sm:py-3 px-3 sm:px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              
              {isLoggedIn ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className="flex items-center py-2.5 sm:py-3 px-3 sm:px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/cart" 
                    className="flex items-center justify-between py-2.5 sm:py-3 px-3 sm:px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>Cart</span>
                    <Badge className="bg-green-500">3</Badge>
                  </Link>
                  <Link 
                    href="/wishlist" 
                    className="flex items-center justify-between py-2.5 sm:py-3 px-3 sm:px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>Wishlist</span>
                    <Badge>5</Badge>
                  </Link>
                  <Link 
                    href="/messages" 
                    className="flex items-center justify-between py-2.5 sm:py-3 px-3 sm:px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>Messages</span>
                    <Badge>2</Badge>
                  </Link>
                  <Link 
                    href="/profile" 
                    className="flex items-center py-2.5 sm:py-3 px-3 sm:px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  <div className="border-t pt-3 sm:pt-4">
                    <Button
                      variant="outline"
                      className="w-full text-base py-2.5"
                      onClick={() => {
                        setIsLoggedIn(false);
                        setIsMenuOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t">
                  <Button
                    variant="outline"
                    className="w-full text-base py-2.5"
                    onClick={() => {
                      handleAuthClick('login');
                      setIsMenuOpen(false);
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    className="w-full text-base py-2.5 bg-gradient-to-r from-blue-600 to-green-600"
                    onClick={() => {
                      handleAuthClick('signup');
                      setIsMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onAuth={(role) => {
          setIsLoggedIn(true);
          setShowAuthModal(false);
        }}
      />
    </>
  );
}