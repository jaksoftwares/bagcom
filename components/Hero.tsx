'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, ShoppingBag, Users, Shield, TrendingUp, MapPin } from 'lucide-react';
import HeroCarousel from './HeroCarousel';

export default function Hero() {
  return (
    <div className="bg-gray-50">
      {/* Hero Carousel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <HeroCarousel />
      </div>

      {/* Search Section */}
      <div className="bg-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Find What You Need
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Search through thousands of products from trusted sellers in your area
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-2xl p-6 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">What are you looking for?</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Search products..."
                      className="pl-10 py-3 border-2 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Enter location..."
                      className="pl-10 py-3 border-2 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex items-end">
                  <Button className="w-full py-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                    Search
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Popular searches:</span>
                <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">Furniture</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">Electronics</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">Kitchen</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">Books</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <ShoppingBag className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white">50K+</h3>
              <p className="text-blue-100 font-medium">Products Listed</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white">25K+</h3>
              <p className="text-blue-100 font-medium">Active Users</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white">100%</h3>
              <p className="text-blue-100 font-medium">Secure Transactions</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white">4.8</h3>
              <p className="text-blue-100 font-medium">Average Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}