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
      <div className="w-full mx-auto space-y-4 sm:space-y-6 pb-8 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl overflow-x-hidden">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
              Analytics
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Your revenue and orders over the last 30 days.
            </p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
             <div className="w-full md:w-auto flex items-center justify-center gap-2 bg-gray-50 border border-gray-200 h-11 px-5 rounded-xl text-gray-700 font-medium text-sm">
               <TrendingUp className="h-4 w-4 text-emerald-500" />
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
