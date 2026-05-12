'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  MapPin, 
  Lock,
  ArrowRight,
  Info,
  Loader2,
  CheckCircle,
  AlertCircle,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import StorefrontLayout from '@/components/layout/StorefrontLayout';
import { getCurrentUser, getUserProfile } from '@/services/auth/authService';
import { getProducts } from '@/services/products/productService';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { usePaymentStatus } from '@/lib/hooks/usePaymentStatus';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const productId = searchParams.get('productId');

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);
  const [awaitingPayment, setAwaitingPayment] = useState(false);


  // Form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryPoint, setDeliveryPoint] = useState('');

  // Poll for payment status once STK push is sent
  const { status: paymentStatus } = usePaymentStatus(orderId, checkoutRequestId, awaitingPayment);


  // When payment is confirmed, redirect to order confirmation
  useEffect(() => {
    if (paymentStatus === 'SUCCESS') {
      setAwaitingPayment(false);
      router.push(`/order/${orderId}`);
    } else if (paymentStatus === 'CANCELLED') {
      setAwaitingPayment(false);
      setIsProcessing(false);
      toast({ 
        title: "Payment cancelled", 
        description: "You cancelled the payment prompt. Click pay again to retry.",
        variant: "destructive"
      });
    } else if (paymentStatus === 'FAILED' || paymentStatus === 'TIMEOUT') {
      setAwaitingPayment(false);
      setIsProcessing(false);
      toast({ 
        title: "Payment failed", 
        description: "Your payment was not completed. Please check your balance and try again.",
        variant: "destructive"
      });
    }
  }, [paymentStatus, orderId, router]);


  useEffect(() => {
    async function loadData() {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push(`/login?redirect=/checkout${productId ? `?productId=${productId}` : ''}`);
        return;
      }
      setUser(currentUser);

      const [userProfile, allProducts] = await Promise.all([
        getUserProfile(currentUser.id).catch(() => null),
        productId ? getProducts({ limit: 1 }) : Promise.resolve([]) // will fetch by id below
      ]);

      setProfile(userProfile);
      setFullName(`${userProfile?.first_name || ''} ${userProfile?.last_name || ''}`.trim());
      setPhone(userProfile?.phone_number || '');

      // Fetch the specific product
      if (productId) {
        try {
          const res = await fetch(`/api/products/${productId}`);
          const data = await res.json();
          if (data.product) {
            setProduct(data.product);
          } else {
            toast({ title: "Product not found", variant: "destructive" });
            router.push('/products');
          }
        } catch {
          toast({ title: "Failed to load product", variant: "destructive" });
          router.push('/products');
        }
      }

      setIsLoading(false);
    }
    loadData();
  }, [productId]);

  const commission = product ? product.price * 0.10 : 0;
  const total = product ? product.price + commission : 0;

  const handlePlaceOrder = async () => {
    if (!phone.trim()) {
      toast({ title: "Phone number required", description: "Enter your M-PESA number to continue.", variant: "destructive" });
      return;
    }
    if (!deliveryPoint.trim()) {
      toast({ title: "Delivery point required", description: "Let the seller know where to deliver.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    try {
      // Step 1: Create the order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyer_id: user.id, product_id: product.id, quantity: 1 })
      });
      const orderData = await orderRes.json();

      if (!orderData.order) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      const createdOrderId = orderData.order.id;
      setOrderId(createdOrderId);

      // Step 2: Trigger M-PESA STK Push
      const payRes = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: createdOrderId, phoneNumber: phone })
      });
      const payData = await payRes.json();

      if (!payData.success) {
        throw new Error(payData.error || 'Payment initiation failed');
      }

      // Step 3: Start polling for payment confirmation
      setCheckoutRequestId(payData.checkoutRequestId);
      setAwaitingPayment(true);
      toast({ 
        title: "Check your phone!", 
        description: "An M-PESA prompt has been sent. Enter your PIN to complete payment."
      });


    } catch (err: any) {
      setIsProcessing(false);
      toast({ title: "Order failed", description: err.message, variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-gray-300" />
        <p className="text-gray-500 font-medium">No product selected for checkout.</p>
        <Link href="/products"><Button>Browse Items</Button></Link>
      </div>
    );
  }

  const displayImage = product.images?.[0]?.image_url || product.product_images?.[0]?.image_url || null;

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">Secure Checkout</h1>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* === LEFT COLUMN: Form === */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Product Summary */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex gap-5 items-start">
              {displayImage && (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                  <Image src={displayImage} alt={product.title} fill className="object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{product.category?.name}</p>
                <h3 className="font-bold text-gray-900 text-base truncate">{product.title}</h3>
                <p className="text-[11px] text-gray-400 mt-1 font-medium">{product.condition} condition</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xl font-bold text-gray-900">KSh {product.price.toLocaleString()}</p>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">1</div>
                <h2 className="text-base font-bold text-gray-900">Your Details</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</Label>
                  <Input
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="h-11 rounded-lg border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <Phone className="h-3 w-3 inline mr-1" />M-PESA Phone Number
                  </Label>
                  <Input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="0712 345 678"
                    className="h-11 rounded-lg border-gray-200"
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <MapPin className="h-3 w-3 inline mr-1" />Delivery Point / Meeting Location
                  </Label>
                  <Input
                    value={deliveryPoint}
                    onChange={e => setDeliveryPoint(e.target.value)}
                    placeholder="e.g. Hall 9, Room 204 or Gate B, Strathmore University"
                    className="h-11 rounded-lg border-gray-200"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">2</div>
                <h2 className="text-base font-bold text-gray-900">Payment Method</h2>
              </div>

              <div className="border-2 border-primary/20 bg-primary/5 rounded-xl p-5 flex items-center gap-5">
                <img src="https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg" alt="M-Pesa" className="h-10 flex-shrink-0" />
                <div>
                  <p className="font-bold text-gray-900">M-PESA Express (STK Push)</p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">You will receive a prompt on your phone to confirm payment by entering your M-PESA PIN.</p>
                </div>
                <div className="ml-auto h-5 w-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <Info className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  Your payment is protected by <strong>Bagcom Escrow</strong>. Funds are only released to the seller after you confirm receipt using a unique verification code.
                </p>
              </div>
            </div>

          </div>

          {/* === RIGHT COLUMN: Order Summary === */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6">
              <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-4">Order Summary</h3>

              <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-500">Item price</span>
                  <span className="font-bold text-gray-900">KSh {product.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-500 flex items-center gap-1">
                    Platform fee (10%) <ShieldCheck className="h-3 w-3 text-primary" />
                  </span>
                  <span className="font-bold text-gray-900">KSh {commission.toLocaleString()}</span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-primary tracking-tight">
                    KSh {total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Escrow Badge */}
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                <ShieldCheck className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-widest text-green-700 leading-tight">100% Escrow Protected</span>
              </div>

              {/* CTA */}
              {awaitingPayment ? (
                <div className="text-center space-y-3 py-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                  <p className="text-sm font-bold text-gray-900">Waiting for M-PESA confirmation...</p>
                  <p className="text-xs text-gray-500">Check your phone and enter your PIN</p>
                </div>
              ) : (
                <Button
                  onClick={handlePlaceOrder}
                  className="w-full h-13 rounded-lg text-sm font-bold gap-2 shadow-md"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                  ) : (
                    <><Lock className="h-4 w-4" /> Place Order & Pay KSh {total.toLocaleString()} <ArrowRight className="h-4 w-4" /></>
                  )}
                </Button>
              )}

              <p className="text-center text-[10px] text-gray-400">
                By placing this order, you agree to our{' '}
                <Link href="/terms" className="text-primary hover:underline">Escrow Terms</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <StorefrontLayout>
      <Suspense fallback={<div className="min-h-screen animate-pulse bg-gray-50" />}>
        <CheckoutContent />
      </Suspense>
    </StorefrontLayout>
  );
}
