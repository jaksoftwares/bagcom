'use client';

import { useState, useEffect, useCallback } from 'react';
import { Star, ThumbsUp, MessageSquare, Send, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Review {
  id: string;
  rating: number;
  comment: string;
  images: any[];
  helpful_votes: number;
  created_at: string;
  user_id: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
}

interface ProductReviewsProps {
  productId: string;
  currentUserId?: string | null;
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          <Star
            className={`h-7 w-7 transition-colors ${
              star <= (hovered || value)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-muted text-muted-foreground/30'
            }`}
          />
        </button>
      ))}
      <span className="ml-2 text-sm font-semibold text-muted-foreground">
        {hovered || value ? ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][hovered || value] : 'Select'}
      </span>
    </div>
  );
}

export default function ProductReviews({ productId, currentUserId }: ProductReviewsProps) {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [helpfulLoading, setHelpfulLoading] = useState<string | null>(null);

  // Write form state
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/products/${productId}/reviews`);
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0) {
      toast({ title: 'Please select a star rating', variant: 'destructive' });
      return;
    }
    if (newComment.trim().length < 5) {
      toast({ title: 'Review too short', description: 'Please write at least 5 characters.', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: newRating, comment: newComment.trim() })
      });
      const data = await res.json();

      if (!res.ok) {
        toast({ title: data.error || 'Failed to submit review', variant: 'destructive' });
        return;
      }

      toast({ title: 'Review submitted!', description: 'Thank you for your feedback.' });
      setNewRating(0);
      setNewComment('');
      // Refresh reviews
      await fetchReviews();
    } catch (err) {
      toast({ title: 'Something went wrong. Please try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleHelpful = async (reviewId: string) => {
    if (!currentUserId) {
      toast({ title: 'Sign in to vote', variant: 'destructive' });
      return;
    }
    setHelpfulLoading(reviewId);
    try {
      await fetch(`/api/products/${productId}/reviews`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId })
      });
      // Optimistic update
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, helpful_votes: r.helpful_votes + 1 } : r));
    } finally {
      setHelpfulLoading(null);
    }
  };

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0';

  const starBreakdown = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => r.rating === stars).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { stars, count, percentage };
  });

  // Check if the current user already left a review
  const alreadyReviewed = currentUserId
    ? reviews.some(r => r.user_id === currentUserId)
    : false;

  if (loading) {
    return <div className="animate-pulse h-64 bg-muted/20 rounded-2xl w-full" />;
  }

  return (
    <section className="py-12 border-t border-border/40" id="reviews">
      <h3 className="text-2xl font-bold text-foreground mb-8 tracking-tight">Customer Reviews</h3>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
        {/* Left: Summary & Star Breakdown */}
        <div className="lg:col-span-4 space-y-8">
          <div className="flex items-center gap-4">
            <div className="text-5xl font-black text-foreground tracking-tighter">{averageRating}</div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < Math.round(Number(averageRating)) ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'}`} />
                ))}
              </div>
              <p className="text-sm font-medium text-muted-foreground">{totalReviews} verified {totalReviews === 1 ? 'rating' : 'ratings'}</p>
            </div>
          </div>

          <div className="space-y-3">
            {starBreakdown.map(bd => (
              <div key={bd.stars} className="flex items-center gap-3 text-sm font-semibold text-muted-foreground">
                <div className="flex items-center gap-1 w-12 shrink-0">
                  <span>{bd.stars}</span> <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                </div>
                <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${bd.percentage}%` }} />
                </div>
                <div className="w-8 text-right text-xs">{bd.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Reviews List */}
        <div className="lg:col-span-8 space-y-8">
          {reviews.length === 0 ? (
            <div className="text-center py-12 bg-muted/10 rounded-2xl border border-dashed border-border/40">
              <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-foreground font-bold">No reviews yet</p>
              <p className="text-sm text-muted-foreground mt-1">Be the first to review this product!</p>
            </div>
          ) : (
            reviews.map(review => (
              <div key={review.id} className="pb-8 border-b border-border/40 last:border-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted overflow-hidden relative shrink-0">
                      {review.avatar_url ? (
                        <Image src={review.avatar_url} alt={review.first_name || 'User'} fill className="object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-bold text-sm">
                          {(review.first_name || 'U')[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {review.first_name} {review.last_name?.charAt(0)}.
                      </p>
                      <p className="text-xs font-medium text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'}`} />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-foreground leading-relaxed font-medium">{review.comment}</p>

                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mt-4">
                    {review.images.map((img: any, idx: number) => (
                      <div key={idx} className="relative h-20 w-20 rounded-lg overflow-hidden border border-border/40">
                        <Image src={img.url || img} alt={`Review photo ${idx}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 mt-4">
                  <button
                    onClick={() => handleHelpful(review.id)}
                    disabled={helpfulLoading === review.id}
                    className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                  >
                    {helpfulLoading === review.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <ThumbsUp className="h-3.5 w-3.5" />
                    )}
                    Helpful ({review.helpful_votes})
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Write a Review */}
      <div className="bg-muted/5 border border-border/40 rounded-2xl p-8">
        <h4 className="text-lg font-bold text-foreground mb-6 tracking-tight">Write a Review</h4>

        {!currentUserId ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground font-medium mb-4">Sign in to leave a review.</p>
            <Button asChild variant="outline" className="font-bold uppercase tracking-widest text-[11px] h-11 px-6">
              <a href="/login">Sign In</a>
            </Button>
          </div>
        ) : alreadyReviewed ? (
          <div className="text-center py-8 text-muted-foreground">
            <Star className="h-8 w-8 fill-amber-400 text-amber-400 mx-auto mb-3" />
            <p className="font-bold text-foreground">You've already reviewed this product.</p>
            <p className="text-sm mt-1">Thank you for your feedback!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmitReview} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Your Rating *
              </label>
              <StarPicker value={newRating} onChange={setNewRating} />
            </div>

            <div>
              <label htmlFor="review-comment" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Your Review *
              </label>
              <textarea
                id="review-comment"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Share your experience with this product — quality, delivery, accuracy to description..."
                rows={5}
                className="w-full px-4 py-3 text-sm text-foreground bg-white border border-border/60 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground/50"
              />
              <p className="text-xs text-muted-foreground mt-1.5">{newComment.length} characters (minimum 5)</p>
            </div>

            <Button
              type="submit"
              disabled={submitting || newRating === 0}
              className="h-12 px-8 bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest text-[11px] shadow-md"
            >
              {submitting ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting...</>
              ) : (
                <><Send className="h-4 w-4 mr-2" /> Submit Review</>
              )}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
