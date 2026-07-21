'use client';

import { useState, useEffect } from 'react';
import SellerLayout from '@/components/layout/SellerLayout';
import { SellerAnalytics } from '@/components/dashboard/seller/SellerAnalytics';
import { getCurrentUser } from '@/services/auth/authService';
import { Loader2, BarChart3, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function SellerAnalyticsPage() {
  const { toast } = useToast();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return;

        const response = await fetch(`/api/seller/stats?sellerId=${currentUser.id}`);
        const data = await response.json();

        if (response.ok) {
          setStats(data);
        } else {
          throw new Error(data.error || 'Failed to load analytics');
        }
      } catch (error: any) {
        console.error('Analytics load error:', error);
        toast({ title: 'Error Loading Analytics', description: error.message, variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    }

    loadAnalytics();
  }, [toast]);

  if (isLoading) {
    return (
      <SellerLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-gray-500 tracking-wider uppercase animate-pulse">Gathering Analytics</p>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className="max-w-[1600px] w-full mx-auto space-y-6 pb-8">
        
        {/* Premium Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute -top-24 -right-24 h-96 w-96 bg-primary/20 blur-3xl rounded-full opacity-50 mix-blend-overlay"></div>
          
          <div className="relative z-10">
            <Badge className="bg-primary/20 text-primary-foreground hover:bg-primary/20 mb-3 border-none backdrop-blur-md px-3 py-1 text-xs font-medium uppercase tracking-wider gap-2">
              <BarChart3 className="h-3.5 w-3.5" /> Performance
            </Badge>
            <h1 className="text-3xl font-semibold text-white tracking-tight">
              Analytics
            </h1>
            <p className="text-gray-400 font-medium mt-2 max-w-xl text-sm leading-relaxed">
              View your revenue and orders over the last 30 days.
            </p>
          </div>
          
          <div className="flex gap-3 relative z-10 w-full md:w-auto">
             <div className="w-full md:w-auto flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 h-12 px-6 rounded-xl text-white font-medium text-sm shadow-inner">
               <TrendingUp className="h-4 w-4 text-emerald-400" />
               Last 30 Days
             </div>
          </div>
        </div>

        {/* Analytics Charts Component */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <SellerAnalytics stats={stats} />
        </div>

      </div>
    </SellerLayout>
  );
}
