'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  MessageCircle, 
  Package, 
  AlertCircle, 
  Loader2,
  ShieldCheck,
  Send
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';

interface OrderActionsProps {
  order: any;
  onUpdate: () => void;
}

export function OrderActions({ order, onUpdate }: OrderActionsProps) {
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVerify = async () => {
    if (!verificationCode.trim()) {
      toast({ title: "Verification code required", variant: "destructive" });
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch('/api/orders/confirm-delivery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId: order.id, 
          deliveryCode: verificationCode.trim() 
        })
      });

      const data = await res.json();
      if (data.success) {
        toast({ 
          title: "Order Completed!", 
          description: "Payment has been released to your M-PESA account." 
        });
        setIsModalOpen(false);
        onUpdate();
      } else {
        throw new Error(data.error || "Invalid verification code");
      }
    } catch (error: any) {
      toast({ 
        title: "Verification Failed", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      const res = await fetch('/api/orders/update-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id, status: newStatus })
      });
      
      if (res.ok) {
        toast({ 
          title: "Status Updated", 
          description: `Order marked as ${newStatus.replace('_', ' ')}. Buyer has been notified via email.` 
        });
        onUpdate();
      }
    } catch (error) {
      toast({ title: "Failed to update status", variant: "destructive" });
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" className="gap-2 font-bold h-9">
        <MessageCircle className="h-4 w-4" />
        Chat with Buyer
      </Button>

      {order.status === 'PAYMENT_SUCCESS' && (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-2 font-bold h-9 border-blue-100 text-blue-600 hover:bg-blue-50" onClick={() => updateStatus('PRODUCT_LOCKED')}>
            <ShieldCheck className="h-4 w-4" />
            Reserve Item
          </Button>
          <Button size="sm" className="gap-2 font-bold h-9 bg-blue-600 hover:bg-blue-700" onClick={() => updateStatus('OUT_FOR_DELIVERY')}>
            <Package className="h-4 w-4" />
            Mark Out for Delivery
          </Button>
        </div>
      )}

      {(order.status === 'PAYMENT_SUCCESS' || order.status === 'DELIVERED') && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 font-bold h-9 bg-green-600 hover:bg-green-700 shadow-md">
              <ShieldCheck className="h-4 w-4" />
              Verify & Complete
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-green-600" />
                Complete Transaction
              </DialogTitle>
              <DialogDescription>
                Ask the buyer for the unique 6-digit verification code they received after payment. Entering this code releases the escrow funds.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Delivery Verification Code
                </Label>
                <Input
                  id="code"
                  placeholder="e.g. BGX-123456"
                  className="h-12 text-lg font-mono font-bold tracking-widest"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleVerify} 
                disabled={isVerifying} 
                className="w-full h-12 font-bold text-base"
              >
                {isVerifying ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Validating...</>
                ) : (
                  "Confirm & Receive Payment"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {order.status === 'COMPLETED' && (
        <Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1.5 font-bold h-9 flex items-center gap-1.5">
          <CheckCircle className="h-4 w-4" />
          Transaction Finalized
        </Badge>
      )}

      {order.status === 'DISPUTED' && (
        <Button variant="destructive" size="sm" className="gap-2 font-bold h-9">
          <AlertCircle className="h-4 w-4" />
          Resolve Dispute
        </Button>
      )}
    </div>
  );
}
