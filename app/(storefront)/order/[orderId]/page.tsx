'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  CheckCircle,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Copy,
  ArrowRight,
  Loader2,
  Package,
  Phone,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import StorefrontLayout from '@/components/layout/StorefrontLayout';
import { useToast } from '@/hooks/use-toast';

const ORDER_STATUS_STEPS = [
  { key: 'PAYMENT_SUCCESS', label: 'Payment Confirmed' },
  { key: 'PRODUCT_LOCKED', label: 'Item Reserved' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { key: 'AWAITING_VERIFICATION', label: 'Awaiting Your Code' },
  { key: 'COMPLETED', label: 'Completed' },
];

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (data.order) {
          setOrder(data.order);
        } else {
          router.push('/products');
        }
      } catch {
        router.push('/products');
      } finally {
        setIsLoading(false);
      }
    }
    if (orderId) fetchOrder();
  }, [orderId]);

  const copyCode = () => {
    if (order?.delivery_code) {
      navigator.clipboard.writeText(order.delivery_code);
      toast({ title: "Code copied!", description: "Share this code with the seller only after receiving your item." });
    }
  };

  if (isLoading) {
    return (
      <StorefrontLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </StorefrontLayout>
    );
  }

  if (!order) return null;

  const currentStepIndex = ORDER_STATUS_STEPS.findIndex(s => s.key === order.status);
  const sellerName = order.seller?.first_name
    ? `${order.seller.first_name} ${order.seller.last_name || ''}`.trim()
    : 'Your Seller';

  return (
    <StorefrontLayout>
      <div className="bg-[#F9FAFB] min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-2xl space-y-6">

          {/* Success Header */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center space-y-4 shadow-sm">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-9 w-9 text-green-600" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Order Placed!</h1>
              <p className="text-gray-500 text-sm font-medium">Your payment was successful and the item has been reserved for you.</p>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Order</span>
              <span className="text-sm font-bold text-gray-900">{order.order_number}</span>
            </div>
          </div>

          {/* === VERIFICATION CODE — Critical UI === */}
          <div className="bg-white border-2 border-primary/20 rounded-2xl p-8 space-y-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Your Delivery Verification Code</h2>
                <p className="text-xs text-gray-500 font-medium">Share this ONLY after inspecting and accepting your item</p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">One-time code</p>
                <p className="text-3xl font-black text-gray-900 tracking-widest font-mono">
                  {order.delivery_code || 'BGX-000000'}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={copyCode} className="gap-2 shrink-0 rounded-lg font-bold border-gray-200">
                <Copy className="h-4 w-4" /> Copy
              </Button>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-amber-800">Important — Read before sharing</p>
                <ul className="text-xs text-amber-700 space-y-0.5 leading-relaxed list-disc list-inside">
                  <li>Receive and physically inspect the item first</li>
                  <li>Only share this code when you are satisfied</li>
                  <li>Once the seller enters this code, your payment is released</li>
                  <li>The code is single-use and cannot be reversed</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Order Details</h3>
            <div className="divide-y divide-gray-100">
              <div className="py-3 flex justify-between">
                <span className="text-sm text-gray-500 font-medium">Item</span>
                <span className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{order.product?.title}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-sm text-gray-500 font-medium">Amount Paid</span>
                <span className="text-sm font-bold text-gray-900">KSh {(order.total_amount || 0).toLocaleString()}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-sm text-gray-500 font-medium">Seller</span>
                <span className="text-sm font-bold text-gray-900">{sellerName}</span>
              </div>
              {order.seller?.phone_number && (
                <div className="py-3 flex justify-between">
                  <span className="text-sm text-gray-500 font-medium flex items-center gap-1"><Phone className="h-3 w-3" /> Seller Contact</span>
                  <span className="text-sm font-bold text-green-700">{order.seller.phone_number}</span>
                </div>
              )}
            </div>
          </div>

          {/* Order Status Tracker */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Order Progress</h3>
            <div className="space-y-3">
              {ORDER_STATUS_STEPS.map((step, index) => {
                const isDone = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                return (
                  <div key={step.key} className="flex items-center gap-4">
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-black ${
                      isDone ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isDone ? <CheckCircle className="h-4 w-4" /> : index + 1}
                    </div>
                    <span className={`text-sm font-bold ${isCurrent ? 'text-primary' : isDone ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.label}
                    </span>
                    {isCurrent && (
                      <span className="ml-auto text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1 h-11 rounded-lg font-bold gap-2">
              <Link href="/buyer/orders">
                <Package className="h-4 w-4" /> View My Orders
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1 h-11 rounded-lg font-bold gap-2 border-gray-200">
              <Link href="/products">
                Continue Shopping <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Dispute Link */}
          <p className="text-center text-xs text-gray-400">
            Problem with your order?{' '}
            <Link href={`/buyer/disputes/new/${orderId}`} className="text-primary font-bold hover:underline">Raise a dispute</Link>

          </p>

        </div>
      </div>
    </StorefrontLayout>
  );
}
