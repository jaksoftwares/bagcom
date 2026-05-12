'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Star, 
  Loader2, 
  ArrowLeft, 
  CheckCircle,
  MessageSquare,
  ShieldCheck,
  Package
} from 'lucide-react';
import Link from 'next/link';
import { getCurrentUser } from '@/services/auth/authService';
import { useToast } from '@/hooks/use-toast';

export default function LeaveReviewPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const orderId = params.orderId as string;

  const [user, setUser] = useState<any>(null);
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

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

        if (data.order.status !== 'COMPLETED') {
          toast({ title: "You can only review completed orders", variant: "destructive" });
          router.push('/buyer/orders');
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
    if (rating === 0) {
      toast({ title: "Please select a rating", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewer_id: user.id,
          seller_id: order.seller_id,
          order_id: order.id,
          rating,
          comment
        })
      });

      const data = await res.json();
      if (data.success) {
        toast({ title: "Review submitted!", description: "Thank you for your feedback." });
        router.push('/buyer/orders');
      } else {
        throw new Error(data.error || "Failed to submit review");
      }
    } catch (error: any) {
      toast({ title: "Error submitting review", description: error.message, variant: "destructive" });
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

  const sellerName = order.seller?.first_name ? `${order.seller.first_name} ${order.seller.last_name || ''}`.trim() : 'Seller';

  return (
    <div className="max-w-3xl mx-auto py-8">
        <Link href="/buyer/orders">
          <Button variant="ghost" size="sm" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Orders
          </Button>
        </Link>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Star className="h-8 w-8 fill-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Rate Your Experience</h1>
              <p className="text-gray-600">Share your feedback about {sellerName} and the item you received.</p>
            </div>
          </div>

          <Card className="overflow-hidden border-2 border-primary/10">
            <CardHeader className="bg-gray-50/50 border-b">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-white rounded-lg border flex items-center justify-center shadow-sm">
                  <Package className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Reviewing Item</p>
                  <h3 className="font-bold text-gray-900">{order.product?.title}</h3>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-10">
              {/* Rating Section */}
              <div className="text-center space-y-4">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Overall Rating</p>
                <div className="flex justify-center gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform active:scale-90"
                    >
                      <Star 
                        className={`h-12 w-12 transition-colors ${
                          (hoveredRating || rating) >= star 
                            ? 'fill-yellow-400 text-yellow-400 shadow-yellow-200' 
                            : 'text-gray-200'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
                <p className="text-sm font-bold text-gray-900">
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </p>
              </div>

              {/* Comment Section */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Your Comments
                </label>
                <Textarea 
                  placeholder="Tell us about the quality, delivery, and seller's communication..."
                  className="min-h-[150px] text-base p-4 rounded-xl border-gray-200 focus:ring-primary/20"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex gap-4">
                <ShieldCheck className="h-6 w-6 text-primary shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-primary uppercase tracking-tight">Verified Purchase</p>
                  <p className="text-xs text-primary/70 leading-relaxed">Your review will be marked as a verified purchase since you completed the transaction via Bagcom Escrow.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={handleSubmit} 
                  className="flex-1 h-14 text-lg font-bold shadow-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Submitting...</>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
                <Link href="/buyer/orders" className="flex-1">
                  <Button variant="outline" className="w-full h-14 text-lg font-bold border-gray-200">
                    Cancel
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  );
}
