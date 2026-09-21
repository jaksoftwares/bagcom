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
  Phone,
  Clock,
  MessageSquare,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import StorefrontLayout from '@/components/layout/StorefrontLayout';
import { getCurrentUser, getUserProfile } from '@/services/auth/authService';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { usePaymentStatus } from '@/lib/hooks/usePaymentStatus';
import { useCartStore } from '@/store/useCartStore';
import CheckoutProgress from '@/components/checkout/CheckoutProgress';

const COMMISSION_RATE = 0.10; // 10% — must match backend getCommissionRate()

const JKUAT_LOCATIONS = [
  'JKUAT Main Gate',
  'Library (Main Library)',
  'Administration Block',
  'School of Computing (SoC)',
  'Cafeteria / Main Mess',
  'Student Centre',
  'Hall 9',
  'Hall 10',
  'Hall 11',
  'Hall 12',
  'Sports Complex',
  'JKUAT Bus Stage',
  'Engineering Block',
  'Cohort Block / Lecture Halls',
];

function isValidSafaricomNumber(phone: string): boolean {
  const cleaned = phone.replace(/\s+/g, '');
  return /^(07\d{8}|2547\d{8}|\+2547\d{8})$/.test(cleaned);
}

function formatPhoneForMpesa(phone: string): string {
  const cleaned = phone.replace(/\s+/g, '').replace(/^\+/, '');
  if (cleaned.startsWith('07')) return '254' + cleaned.slice(1);
  if (cleaned.startsWith('2547')) return cleaned;
  return cleaned;
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { cart, clearCart } = useCartStore();
  const productId = searchParams.get('productId');

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);
  const [awaitingPayment, setAwaitingPayment] = useState(false);

  const [phone, setPhone] = useState('');
  const [meetingPoint, setMeetingPoint] = useState('');
  const [availability, setAvailability] = useState('');
  const [buyerNotes, setBuyerNotes] = useState('');

  const { status: paymentStatus } = usePaymentStatus(orderId, checkoutRequestId, awaitingPayment);

  useEffect(() => {
    if (paymentStatus === 'SUCCESS') {
      setAwaitingPayment(false);
      clearCart();
      router.push(orderId ? `/buyer/orders/${orderId}` : '/buyer');
    } else if (paymentStatus === 'CANCELLED') {
      setAwaitingPayment(false);
      setIsProcessing(false);
      toast({ title: "Payment cancelled", description: "You cancelled the payment prompt. Click pay again to retry.", variant: "destructive" });
    } else if (paymentStatus === 'FAILED' || paymentStatus === 'TIMEOUT') {
      setAwaitingPayment(false);
      setIsProcessing(false);
      toast({ title: "Payment failed", description: "Your payment was not completed. Please check your M-PESA balance and try again.", variant: "destructive" });
    }
  }, [paymentStatus, orderId, router, clearCart]);

  useEffect(() => {
    async function loadData() {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push(`/login?redirect=/checkout${productId ? `?productId=${productId}` : ''}`);
        return;
      }
      setUser(currentUser);
      const userProfile = await getUserProfile(currentUser.id).catch(() => null);
      setProfile(userProfile);
      setPhone(userProfile?.phone_number || '');

      if (productId) {
        try {
          const res = await fetch(`/api/products/${productId}`);
          const data = await res.json();
          if (data.product) { setProducts([data.product]); }
          else { toast({ title: "Product not found", variant: "destructive" }); router.push('/products'); }
        } catch { toast({ title: "Failed to load product", variant: "destructive" }); router.push('/products'); }
      } else if (cart.length > 0) {
        setProducts(cart.map(item => ({
          id: item.id, title: item.name, price: item.price,
          category: { name: item.category }, images: [{ image_url: item.image }], condition: 'Good'
        })));
      } else { setIsLoading(false); return; }
      setIsLoading(false);
    }
    loadData();
  }, [productId, cart]);

  const subtotal = products.reduce((sum, p) => sum + p.price, 0);
  const commission = Math.round(subtotal * COMMISSION_RATE);
  const total = subtotal + commission;

  const handlePlaceOrder = async () => {
    if (!phone.trim()) {
      toast({ title: "Phone number required", description: "Enter your M-PESA number to continue.", variant: "destructive" }); return;
    }
    if (!isValidSafaricomNumber(phone)) {
      toast({ title: "Invalid M-PESA number", description: "Enter a valid Safaricom number (e.g. 0712 345 678).", variant: "destructive" }); return;
    }
    if (!meetingPoint.trim()) {
      toast({ title: "Meeting point required", description: "Tell the seller where to meet you on campus.", variant: "destructive" }); return;
    }
    if (!availability.trim()) {
      toast({ title: "Availability required", description: "Let the seller know when you're free to meet.", variant: "destructive" }); return;
    }

    setIsProcessing(true);
    try {
      const deliveryNotes = [
        `Meeting Point: ${meetingPoint}`,
        `Availability: ${availability}`,
        buyerNotes ? `Notes: ${buyerNotes}` : ''
      ].filter(Boolean).join(' | ');

      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer_id: user.id,
          items: products.map(p => ({ product_id: p.id, quantity: 1 })),
          delivery_notes: deliveryNotes
        })
      });
      const orderData = await orderRes.json();

      if (!orderData.orders || orderData.orders.length === 0) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      const createdOrderIds = orderData.orders.map((o: any) => o.id);
      setOrderId(createdOrderIds[0]);

      const formattedPhone = formatPhoneForMpesa(phone);
      const payRes = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderIds: createdOrderIds, phoneNumber: formattedPhone })
      });
      const payData = await payRes.json();

      if (!payData.success) throw new Error(payData.error || 'Payment initiation failed');

      setCheckoutRequestId(payData.checkoutRequestId);
      setAwaitingPayment(true);
      toast({ title: "Check your phone!", description: "An M-PESA prompt has been sent. Enter your PIN to complete payment." });

    } catch (err: any) {
      setIsProcessing(false);
      toast({ title: "Order failed", description: err.message, variant: "destructive" });
    }
  };

  if (isLoading) return <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  if (products.length === 0) return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center gap-4">
      <AlertCircle className="h-12 w-12 text-gray-300" />
      <p className="text-gray-500 font-medium">No products selected for checkout.</p>
      <Link href="/products"><Button>Browse Items</Button></Link>
    </div>
  );

  const buyerDisplayName = profile
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
    : user?.email || 'You';

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <CheckoutProgress currentStep={awaitingPayment ? 'payment' : 'details'} />

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Form */}
          <div className="lg:col-span-7 space-y-6">

            {/* Product Cards */}
            <div className="space-y-4">
              {products.map(product => {
                const img = product.images?.[0]?.image_url || product.product_images?.[0]?.image_url || null;
                return (
                  <div key={product.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex gap-5 items-start">
                    {img && (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                        <Image src={img} alt={product.title} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{product.category?.name}</p>
                      <h3 className="font-bold text-gray-900 text-sm truncate">{product.title}</h3>
                      <p className="text-[11px] text-gray-400 mt-1 font-medium">{product.condition} condition</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900 shrink-0">KSh {product.price.toLocaleString()}</p>
                  </div>
                );
              })}
            </div>

            {/* Section 1 — Your Details */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">1</div>
                <h2 className="text-base font-bold text-gray-900">Your Details</h2>
              </div>

              {/* Read-only buyer identity */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="h-9 w-9 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                  <User className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-gray-900 truncate">{buyerDisplayName}</p>
                  <p className="text-[11px] text-gray-400 font-medium truncate">{user?.email}</p>
                </div>
                <Link href="/profile" className="text-[10px] font-bold text-primary hover:underline shrink-0">Edit Profile</Link>
              </div>

              {/* M-PESA phone */}
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  <Phone className="h-3 w-3 inline mr-1" />M-PESA Phone Number
                </Label>
                <Input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="0712 345 678"
                  className={`h-11 rounded-lg border-gray-200 font-medium ${phone && !isValidSafaricomNumber(phone) ? 'border-red-300 focus-visible:ring-red-200' : ''}`}
                />
                {phone && !isValidSafaricomNumber(phone) && (
                  <p className="text-[11px] text-red-500 font-medium flex items-center gap-1.5">
                    <AlertCircle className="h-3 w-3 shrink-0" /> Must be a valid Safaricom number (e.g. 0712 345 678)
                  </p>
                )}
                <p className="text-[11px] text-gray-400 font-medium">You will receive an M-PESA PIN prompt on this number.</p>
              </div>
            </div>

            {/* Section 2 — Meetup Details */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">2</div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">Meetup Details</h2>
                  <p className="text-[11px] text-gray-400 font-medium mt-0.5">The seller will contact you to arrange a safe campus exchange.</p>
                </div>
              </div>

              {/* Meeting point select */}
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  <MapPin className="h-3 w-3 inline mr-1" />Preferred Meeting Point
                </Label>
                <select
                  value={meetingPoint}
                  onChange={e => setMeetingPoint(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select a location on campus…</option>
                  {JKUAT_LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                  <option value="Other — see notes below">Other — I'll specify in notes below</option>
                </select>
              </div>

              {/* Availability */}
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  <Clock className="h-3 w-3 inline mr-1" />Your Availability
                </Label>
                <Input
                  value={availability}
                  onChange={e => setAvailability(e.target.value)}
                  placeholder="e.g. Weekday evenings, tomorrow 10am–2pm, weekends only"
                  className="h-11 rounded-lg border-gray-200 font-medium"
                />
                <p className="text-[11px] text-gray-400 font-medium">Helps the seller reach out at a convenient time for both of you.</p>
              </div>

              {/* Optional notes */}
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  <MessageSquare className="h-3 w-3 inline mr-1" />Notes for Seller <span className="text-gray-300 normal-case font-medium">(optional)</span>
                </Label>
                <Textarea
                  value={buyerNotes}
                  onChange={e => setBuyerNotes(e.target.value)}
                  placeholder="e.g. I'll be in a red hoodie. Call me when you arrive at the gate."
                  className="rounded-lg border-gray-200 font-medium text-sm min-h-[80px] resize-none"
                />
              </div>
            </div>

            {/* Section 3 — Payment Method */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">3</div>
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
                  Your payment is held safely by <strong>Bagcom</strong>. Funds are only released to the seller after you confirm receipt using your unique 6-digit verification code.
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6">
              <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-4">Order Summary</h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-500">Items subtotal</span>
                  <span className="font-bold text-gray-900">KSh {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-500 flex items-center gap-1">Platform fee (10%) <ShieldCheck className="h-3 w-3 text-primary" /></span>
                  <span className="font-bold text-gray-900">KSh {commission.toLocaleString()}</span>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between items-end">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-primary tracking-tight">KSh {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Meetup preview */}
              {(meetingPoint || availability) && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Meetup Info</p>
                  {meetingPoint && (
                    <div className="flex items-center gap-2 text-xs text-blue-800 font-medium">
                      <MapPin className="h-3 w-3 shrink-0" /> {meetingPoint}
                    </div>
                  )}
                  {availability && (
                    <div className="flex items-center gap-2 text-xs text-blue-800 font-medium">
                      <Clock className="h-3 w-3 shrink-0" /> {availability}
                    </div>
                  )}
                </div>
              )}

              {/* Protection badge */}
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                <ShieldCheck className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-widest text-green-700 leading-tight">100% Payment Protected</span>
              </div>

              {/* Pay button */}
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
                  {isProcessing
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                    : <><Lock className="h-4 w-4" /> Place Order & Pay KSh {total.toLocaleString()} <ArrowRight className="h-4 w-4" /></>
                  }
                </Button>
              )}

              <p className="text-center text-[10px] text-gray-400">
                By placing this order, you agree to our{' '}
                <Link href="/terms" className="text-primary hover:underline">Payment Terms</Link>
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
