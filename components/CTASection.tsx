'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  Shield, 
  Star,
  ArrowRight,
  CheckCircle,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-yellow-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-green-300 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="bg-white/20 text-white border-white/30 mb-6 text-sm px-4 py-2">
            🚀 Join Thousands of Happy Users
          </Badge>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Start Your
            <span className="block text-yellow-300 mt-2">Marketplace Journey?</span>
          </h2>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join BagCom today and discover amazing deals, sell your items quickly, 
            and connect with buyers and sellers in your area.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Easy Shopping</h3>
            <p className="text-blue-100 text-sm">Browse thousands of products with advanced filters</p>
          </div>
          
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Quick Selling</h3>
            <p className="text-blue-100 text-sm">List your items and reach buyers instantly</p>
          </div>
          
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Secure Payments</h3>
            <p className="text-blue-100 text-sm">Protected transactions with buyer guarantee</p>
          </div>
          
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Local Community</h3>
            <p className="text-blue-100 text-sm">Connect with trusted sellers in your area</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-12">
          <Link href="/products">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all w-full sm:w-auto"
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Start Shopping Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
          
          <Link href="/dashboard">
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm px-8 py-4 text-lg font-semibold shadow-xl w-full sm:w-auto"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Start Selling Today
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="text-center">
          <p className="text-blue-200 text-sm mb-4">Trusted by thousands of users across Kenya</p>
          <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-8">
            <div className="flex items-center gap-2 text-white/90">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">50K+ Products Listed</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-medium">4.8 Average Rating</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">100% Secure</span>
            </div>
          </div>
        </div>

        {/* Special Offer */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-yellow-400 text-gray-900 px-6 py-3 rounded-full font-semibold text-lg shadow-lg">
            🎉 Limited Time: Zero Commission for First 30 Days!
          </div>
        </div>
      </div>
    </section>
  );
}