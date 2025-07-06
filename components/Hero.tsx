'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, ShoppingBag, Users, Shield, TrendingUp } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-20 sm:w-32 h-20 sm:h-32 bg-white rounded-full blur-2xl sm:blur-3xl"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-24 sm:w-40 h-24 sm:h-40 bg-yellow-300 rounded-full blur-2xl sm:blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 sm:left-1/3 w-16 sm:w-24 h-16 sm:h-24 bg-green-300 rounded-full blur-xl sm:blur-2xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 xl:py-24">
        <div className="text-center">
          <div className="mb-4 sm:mb-6">
            <Badge className="bg-white/20 text-white border-white/30 mb-3 sm:mb-4 text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2">
              🎓 Official JKUAT Student Marketplace
            </Badge>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            JKUAT Student
            <span className="block text-yellow-300 mt-1 sm:mt-2">Marketplace</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 mb-6 sm:mb-8 max-w-xs sm:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
            Buy and sell second-hand items with fellow JKUAT students. 
            From furniture to electronics, find everything you need at great prices.
          </p>

          {/* Search Bar */}
          <div className="max-w-sm sm:max-w-xl lg:max-w-2xl mx-auto mb-6 sm:mb-8 lg:mb-12 px-4 sm:px-0">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
              <Input
                placeholder="Search for items, categories, sellers..."
                className="pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base lg:text-lg rounded-full border-0 shadow-lg bg-white/95 backdrop-blur-sm"
              />
              <Button 
                size="sm" 
                className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 rounded-full px-3 sm:px-4 lg:px-6 xl:px-8 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Search</span>
                <Search className="h-3 w-3 sm:hidden" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 lg:mb-16 px-4 sm:px-0">
            <Button 
              size="lg" 
              variant="secondary" 
              className="px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg font-semibold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
            >
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Start Buying
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg font-semibold bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm shadow-lg w-full sm:w-auto"
            >
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Start Selling
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-xs sm:max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-0">
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full mb-3 sm:mb-4">
                <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">1,200+</h3>
              <p className="text-blue-100 font-medium text-sm sm:text-base">Items Listed</p>
            </div>
            
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full mb-3 sm:mb-4">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">3,500+</h3>
              <p className="text-blue-100 font-medium text-sm sm:text-base">Active Students</p>
            </div>
            
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 sm:col-span-1 col-span-1">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full mb-3 sm:mb-4">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">100%</h3>
              <p className="text-blue-100 font-medium text-sm sm:text-base">Secure Transactions</p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 sm:mt-12 lg:mt-16">
            <p className="text-blue-200 text-xs sm:text-sm lg:text-base mb-3 sm:mb-4">Trusted by JKUAT students since 2024</p>
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 lg:gap-8 opacity-70 px-4 sm:px-0">
              <div className="text-white/80 text-xs sm:text-sm font-medium">✓ Verified Students Only</div>
              <div className="text-white/80 text-xs sm:text-sm font-medium">✓ Secure Payments</div>
              <div className="text-white/80 text-xs sm:text-sm font-medium">✓ Campus Delivery</div>
              <div className="text-white/80 text-xs sm:text-sm font-medium">✓ 24/7 Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}