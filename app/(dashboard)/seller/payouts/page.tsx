'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Wallet, ArrowUpRight, ArrowDownRight, CheckCircle2, Loader2, Clock, AlertCircle } from 'lucide-react';
import SellerLayout from '@/components/layout/SellerLayout';
import { getCurrentUser } from '@/services/auth/authService';

export default function SellerPayoutsPage() {
  const { toast } = useToast();
  const [payouts, setPayouts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [stats, setStats] = useState({
    availableBalance: 0,
    totalEarned: 0,
    pendingEscrow: 0
  });

  const fetchData = async (userId: string) => {
    try {
      const [payoutsRes, ordersRes] = await Promise.all([
        fetch(`/api/payouts?sellerId=${userId}`),
        fetch(`/api/orders?userId=${userId}&role=seller`)
      ]);
      
      const pData = await payoutsRes.json();
      const oData = await ordersRes.json();
      
      const livePayouts = pData.payouts || [];
      const liveOrders = oData.orders || [];

      setPayouts(livePayouts);
      setOrders(liveOrders);

      // Calculate totals
      const completedOrders = liveOrders.filter((o: any) => o.status === 'COMPLETED' || o.status === 'DELIVERED');
      const totalEarned = completedOrders.reduce((sum: number, o: any) => sum + Number(o.seller_receivable || 0), 0);
      
      const escrowOrders = liveOrders.filter((o: any) => ['PAYMENT_SUCCESS', 'HELD_IN_ESCROW'].includes(o.status));
      const pendingEscrow = escrowOrders.reduce((sum: number, o: any) => sum + Number(o.seller_receivable || 0), 0);

      // Available balance is Total Earned minus All Historical Payouts
      const totalPaidOut = livePayouts.reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0);
      const availableBalance = totalEarned - totalPaidOut;

      setStats({
        totalEarned,
        pendingEscrow,
        availableBalance: Math.max(0, availableBalance) // prevent negative UI
      });

    } catch (error) {
      toast({ title: "Failed to load payouts data", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      const currentUser = await getCurrentUser();
      if (!currentUser) return;
      setUser(currentUser);
      await fetchData(currentUser.id);
    }
    init();
  }, []);

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
        await fetchData(user.id);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({ title: "Withdrawal Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsWithdrawing(false);
    }
  };

  if (isLoading) {
    return (
      <SellerLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Payments & Withdrawals</h1>
            <p className="text-gray-500 font-medium">Manage your earnings and withdrawals.</p>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-primary text-white border-none shadow-md overflow-hidden relative">
            <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
              <Wallet className="h-32 w-32" />
            </div>
            <CardContent className="p-6 relative z-10 space-y-4">
              <p className="text-primary-foreground/80 font-bold uppercase tracking-widest text-xs">Available Balance</p>
              <h2 className="text-4xl font-black tracking-tight">KSh {stats.availableBalance.toLocaleString()}</h2>
              <Button 
                onClick={handleWithdraw} 
                disabled={stats.availableBalance <= 0 || isWithdrawing} 
                className="w-full bg-white text-primary hover:bg-gray-100 font-bold"
              >
                {isWithdrawing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Withdraw to M-PESA
              </Button>
            </CardContent>
          </Card>

          <Card className="border-gray-200/60 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center text-gray-400">
                <p className="font-bold uppercase tracking-widest text-xs">Pending Funds</p>
                <Clock className="h-4 w-4" />
              </div>
              <h2 className="text-3xl font-black text-amber-600 tracking-tight">KSh {stats.pendingEscrow.toLocaleString()}</h2>
              <p className="text-sm font-medium text-gray-500 pt-2 border-t border-gray-100">
                Awaiting buyer delivery confirmation.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200/60 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center text-gray-400">
                <p className="font-bold uppercase tracking-widest text-xs">Total Earnings</p>
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">KSh {stats.totalEarned.toLocaleString()}</h2>
              <p className="text-sm font-medium text-gray-500 pt-2 border-t border-gray-100">
                Lifetime net earnings.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payout History Table */}
        <Card className="border-gray-200/60 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-white">
            <h2 className="text-lg font-bold text-gray-900">Payout History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Amount</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Method</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 bg-white">
                {payouts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <AlertCircle className="h-8 w-8 text-gray-300 mb-2" />
                        <p className="text-gray-500 font-medium">No payouts recorded yet.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  payouts.map((payout) => (
                    <tr key={payout.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-500">
                        {new Date(payout.created_at || new Date()).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-black text-gray-900 flex items-center gap-1">
                          <ArrowDownRight className="h-4 w-4 text-green-500" /> KSh {Number(payout.amount).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-700">M-PESA B2C</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Badge className={`${
                          payout.status === 'SUCCESS' ? 'bg-green-100 text-green-700' :
                          payout.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                          payout.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        } border-none font-bold`}>
                          {payout.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </SellerLayout>
  );
}
