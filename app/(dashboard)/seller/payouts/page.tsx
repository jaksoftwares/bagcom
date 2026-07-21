'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  Loader2, 
  Clock, 
  AlertCircle,
  Building2,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import SellerLayout from '@/components/layout/SellerLayout';
import { getCurrentUser } from '@/services/auth/authService';
import { cn } from '@/lib/utils';

export default function SellerPayoutsPage() {
  const { toast } = useToast();
  
  const [payouts, setPayouts] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingPayouts, setIsFetchingPayouts] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [stats, setStats] = useState({
    availableBalance: 0,
    totalEarned: 0,
    pendingEscrow: 0
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchStats = useCallback(async (userId: string) => {
    try {
      const res = await fetch(`/api/seller/dashboard?userId=${userId}`);
      const data = await res.json();
      if (res.ok && data.stats) {
        setStats({
          availableBalance: Number(data.stats.availableBalance || 0),
          totalEarned: Number(data.stats.totalEarnings || 0),
          pendingEscrow: Number(data.stats.pendingEscrow || 0)
        });
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }, []);

  const fetchPayouts = useCallback(async (userId: string, page: number) => {
    setIsFetchingPayouts(true);
    try {
      const res = await fetch(`/api/payouts?sellerId=${userId}&page=${page}&limit=${itemsPerPage}`);
      const data = await res.json();
      if (res.ok) {
        setPayouts(data.payouts || []);
        setTotalCount(data.count || 0);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({ title: "Failed to load payout history", variant: "destructive" });
    } finally {
      setIsFetchingPayouts(false);
      setIsLoading(false);
    }
  }, [itemsPerPage, toast]);

  useEffect(() => {
    let active = true;
    async function init() {
      const currentUser = await getCurrentUser();
      if (!currentUser || !active) return;
      if (!user) setUser(currentUser);
      
      await Promise.all([
        fetchStats(currentUser.id),
        fetchPayouts(currentUser.id, currentPage)
      ]);
    }
    init();
    return () => { active = false; };
  }, [currentPage, fetchStats, fetchPayouts, user]);

  const handleWithdraw = async () => {
    if (stats.availableBalance <= 0) return;
    setIsWithdrawing(true);
    try {
      const res = await fetch('/api/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellerId: user.id, amount: stats.availableBalance })
      });
      const data = await res.json();
      
      if (res.ok) {
        toast({ title: "Withdrawal Initiated", description: "Your funds will be sent to your M-PESA shortly." });
        // Refresh everything
        await Promise.all([
          fetchStats(user.id),
          fetchPayouts(user.id, 1) // Reset to first page
        ]);
        setCurrentPage(1);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({ title: "Withdrawal Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsWithdrawing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'SUCCESS': return <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none font-medium">Successful</Badge>;
      case 'PENDING': return <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-none font-medium">Pending</Badge>;
      case 'PROCESSING': return <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none font-medium">Processing</Badge>;
      case 'FAILED': return <Badge className="bg-red-50 text-red-700 hover:bg-red-100 border-none font-medium">Failed</Badge>;
      default: return <Badge className="bg-gray-50 text-gray-700 border-none font-medium">{status}</Badge>;
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  if (isLoading) {
    return (
      <SellerLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-gray-500 tracking-wider uppercase animate-pulse">Loading Wallet</p>
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
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">Wallet</h1>
            <p className="text-gray-500 font-medium mt-1 text-sm">Manage and withdraw your earnings.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          
          {/* Main Wallet Card */}
          <Card className="lg:col-span-2 bg-slate-900 text-white border-none shadow-sm overflow-hidden rounded-2xl">
            <CardContent className="p-6 md:p-8 flex flex-col h-full justify-between gap-8">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-slate-400 font-medium uppercase tracking-widest text-xs flex items-center gap-2">
                    <Building2 className="h-4 w-4" /> Available Balance
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-300">KSh</span>
                    <h2 className="text-5xl md:text-6xl font-semibold tracking-tight text-white">
                      {stats.availableBalance.toLocaleString()}
                    </h2>
                  </div>
                </div>
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 backdrop-blur-sm px-3 py-1 text-xs">
                  Ready to withdraw
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Button 
                  onClick={handleWithdraw} 
                  disabled={stats.availableBalance <= 0 || isWithdrawing} 
                  className={cn(
                    "w-full sm:w-auto h-14 px-8 text-lg font-semibold rounded-xl shadow-lg transition-all",
                    stats.availableBalance > 0 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 shadow-primary/30" 
                      : "bg-slate-700 text-slate-400"
                  )}
                >
                  {isWithdrawing ? (
                    <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Processing...</>
                  ) : (
                    <>Withdraw to M-PESA <ArrowUpRight className="h-5 w-5 ml-2" /></>
                  )}
                </Button>
                
                <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                  <Info className="h-4 w-4" /> Processed instantly via B2C.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Secondary Stats */}
          <div className="space-y-4 sm:space-y-6 flex flex-col justify-between">
            <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white overflow-hidden transition-shadow hover:shadow-md">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center text-amber-600/80">
                  <p className="font-medium uppercase tracking-widest text-xs">Pending Funds</p>
                  <Clock className="h-5 w-5" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
                  <span className="text-lg font-medium text-gray-400 mr-1">KSh</span>
                  {stats.pendingEscrow.toLocaleString()}
                </h2>
                <div className="pt-4 border-t border-gray-50 flex items-start gap-2 text-xs font-medium text-gray-500 leading-relaxed">
                  <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  Held in Escrow until delivery is confirmed.
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white overflow-hidden transition-shadow hover:shadow-md">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center text-emerald-600/80">
                  <p className="font-medium uppercase tracking-widest text-xs">Total Earnings</p>
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
                  <span className="text-lg font-medium text-gray-400 mr-1">KSh</span>
                  {stats.totalEarned.toLocaleString()}
                </h2>
                <div className="pt-4 border-t border-gray-50 text-xs font-medium text-gray-500 leading-relaxed">
                  Total earned from all completed orders.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Payout History Table */}
        <Card className="border-gray-100 shadow-sm overflow-hidden rounded-2xl bg-white">
          <div className="p-5 sm:p-6 md:p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
            <h2 className="text-lg font-semibold text-gray-900">Withdrawal History</h2>
            <Badge variant="outline" className="bg-white border-gray-200 text-gray-500">
              {totalCount} total
            </Badge>
          </div>
          
          <div className={cn("overflow-x-auto transition-opacity duration-300", isFetchingPayouts ? "opacity-50 pointer-events-none" : "opacity-100")}>
            <table className="w-full text-left">
              <thead className="bg-white border-b border-gray-50">
                <tr>
                  <th className="px-8 py-5 text-xs font-medium uppercase tracking-wider text-gray-500">Date Initiated</th>
                  <th className="px-8 py-5 text-xs font-medium uppercase tracking-wider text-gray-500">Destination</th>
                  <th className="px-8 py-5 text-xs font-medium uppercase tracking-wider text-gray-500 text-right">Amount</th>
                  <th className="px-8 py-5 text-xs font-medium uppercase tracking-wider text-gray-500 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 bg-white">
                {payouts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center">
                          <ArrowDownRight className="h-8 w-8 text-gray-300" />
                        </div>
                        <p className="text-gray-900 font-semibold text-lg">No withdrawals yet.</p>
                        <p className="text-sm text-gray-500 font-medium">Your payout history will appear here once you initiate a withdrawal.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  payouts.map((payout) => (
                    <tr key={payout.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(payout.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                          <span className="text-xs font-medium text-gray-400">
                            {new Date(payout.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                            <span className="text-green-600 font-semibold text-[10px]">M-PESA</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-700">M-PESA Transfer</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span className="text-base font-semibold text-gray-900">
                          KSh {Number(payout.amount).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        {getStatusBadge(payout.status)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 sm:px-6 sm:py-4 border-t border-gray-50 gap-4">
              <p className="text-sm text-gray-500 font-medium">
                Showing <span className="font-semibold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(currentPage * itemsPerPage, totalCount)}</span>
              </p>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <Button
                  variant="outline"
                  className="font-medium rounded-xl h-10 px-4 border-gray-200 hover:bg-gray-50"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" /> Prev
                </Button>
                <span className="text-sm font-medium text-gray-900 px-2 sm:hidden">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  className="font-medium rounded-xl h-10 px-4 border-gray-200 hover:bg-gray-50"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </SellerLayout>
  );
}
