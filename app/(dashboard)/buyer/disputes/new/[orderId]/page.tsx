'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertTriangle, 
  Loader2, 
  ArrowLeft, 
  ShieldAlert,
  Info,
  Package,
  MessageSquare,
  Camera
} from 'lucide-react';
import Link from 'next/link';
import { getCurrentUser } from '@/services/auth/authService';
import { useToast } from '@/hooks/use-toast';

export default function RaiseDisputePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const orderId = params.orderId as string;

  const [user, setUser] = useState<any>(null);
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');

  useEffect(() => {
    async function loadOrder() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push('/login');
          return;
        }
        setUser(currentUser);

        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        
        if (!data.order) {
          toast({ title: "Order not found", variant: "destructive" });
          router.push('/buyer/orders');
          return;
        }

        // Only allow disputes for orders that are paid but not yet completed (or recently delivered)
        const disputableStatuses = ['PAYMENT_SUCCESS', 'DELIVERED', 'HELD_IN_ESCROW', 'OUT_FOR_DELIVERY'];
        if (!disputableStatuses.includes(data.order.status)) {
          toast({ title: "This order is not eligible for a dispute in its current state", variant: "destructive" });
          router.push(`/buyer/orders/${orderId}`);
          return;
        }

        setOrder(data.order);
      } catch (error) {
        console.error('Error loading order:', error);
        toast({ title: "Failed to load order", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  const handleSubmit = async () => {
    if (!reason) {
      toast({ title: "Please select a reason for the dispute", variant: "destructive" });
      return;
    }
    if (details.length < 20) {
      toast({ title: "Please provide more details (at least 20 characters)", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          user_id: user.id,
          reason,
          description: details
        })
      });

      const data = await res.json();
      if (data.success) {
        toast({ title: "Dispute raised successfully", description: "Our team will review your case within 24-48 hours." });
        router.push(`/buyer/orders/${orderId}`);
      } else {
        throw new Error(data.error || "Failed to raise dispute");
      }
    } catch (error: any) {
      toast({ title: "Error raising dispute", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
        <Link href={`/buyer/orders/${orderId}`}>
          <Button variant="ghost" size="sm" className="mb-6 gap-2 text-gray-500 font-bold hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Raise a Dispute</h1>
              <p className="text-gray-500 font-medium">Tell us what went wrong. Your funds are protected in escrow while we investigate.</p>
            </div>
          </div>

          <Card className="border-t-4 border-t-red-500 overflow-hidden shadow-lg">
            <CardHeader className="bg-gray-50/50 border-b">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-white rounded-lg border flex items-center justify-center shadow-sm">
                  <Package className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order Info</p>
                  <h3 className="font-bold text-gray-900">{order.product?.title} (Order #{order.order_number})</h3>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              {/* Reason Selection */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Why are you raising this dispute?</label>
                <select 
                  className="w-full h-12 px-4 py-2 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 bg-white"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                >
                  <option value="">Select a reason...</option>
                  <option value="ITEM_NOT_RECEIVED">I haven't received the item</option>
                  <option value="WRONG_ITEM">I received the wrong item</option>
                  <option value="DAMAGED_ITEM">The item is damaged or not as described</option>
                  <option value="SELLER_UNRESPONSIVE">Seller is unresponsive or behaving suspiciously</option>
                  <option value="OTHER">Other issue</option>
                </select>
              </div>

              {/* Details Section */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Detailed Description
                </label>
                <Textarea 
                  placeholder="Explain exactly what happened. Be as detailed as possible to help our team resolve the case quickly."
                  className="min-h-[180px] text-base p-4 rounded-xl border-gray-200 focus:ring-red-500/20"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
              </div>

              {/* Evidence Upload Placeholder */}
              <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl text-center space-y-3">
                <Camera className="h-8 w-8 text-gray-300 mx-auto" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-gray-900">Upload Evidence (Optional)</p>
                  <p className="text-xs text-gray-500">Add photos of the item or screenshots of your chat with the seller.</p>
                </div>
                <Button variant="outline" size="sm" type="button">Select Files</Button>
              </div>

              {/* Escrow Notice */}
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-4">
                <Info className="h-6 w-6 text-amber-600 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-amber-800 uppercase tracking-tight">Escrow is Frozen</p>
                  <p className="text-xs text-amber-700 leading-relaxed">By raising this dispute, the escrow release is automatically paused. No funds will be sent to the seller until the issue is resolved.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={handleSubmit} 
                  className="flex-1 h-14 text-lg font-bold shadow-lg bg-red-600 hover:bg-red-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Submitting...</>
                  ) : (
                    "Submit Dispute Case"
                  )}
                </Button>
                <Link href={`/buyer/orders/${orderId}`} className="flex-1">
                  <Button variant="outline" className="w-full h-14 text-lg font-bold border-gray-200">
                    Go Back
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  );
}
