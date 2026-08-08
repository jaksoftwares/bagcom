'use client';

import { useState, useEffect } from 'react';
import { Star, ThumbsUp, MessageSquare } from 'lucide-react';
import Image from 'next/image';

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
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(`/api/products/${productId}/reviews`);
        const data = await res.json();
        setReviews(data.reviews || []);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, [productId]);

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1) 
    : '0.0';

  const starBreakdown = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => r.rating === stars).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { stars, count, percentage };
  });

  if (loading) {
    return <div className="animate-pulse h-64 bg-muted/20 rounded-2xl w-full"></div>;
  }

  return (
    <section className="py-12 border-t border-border/40">
      <h3 className="text-2xl font-bold text-foreground mb-8 tracking-tight">Customer Reviews</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Col: Summary & breakdown */}
        <div className="lg:col-span-4 space-y-8">
          <div className="flex items-center gap-4">
             <div className="text-5xl font-black text-foreground tracking-tighter">{averageRating}</div>
             <div>
                <div className="flex items-center gap-1 mb-1">
                   {[...Array(5)].map((_, i) => (
                     <Star key={i} className={`h-5 w-5 ${i < Math.round(Number(averageRating)) ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'}`} />
                   ))}
                </div>
                <p className="text-sm font-medium text-muted-foreground">{totalReviews} verified ratings</p>
             </div>
          </div>

          <div className="space-y-3">
             {starBreakdown.map(bd => (
                <div key={bd.stars} className="flex items-center gap-3 text-sm font-semibold text-muted-foreground">
                   <div className="flex items-center gap-1 w-12 shrink-0">
                      <span>{bd.stars}</span> <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                   </div>
                   <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${bd.percentage}%` }} />
                   </div>
                   <div className="w-8 text-right text-xs">{bd.count}</div>
                </div>
             ))}
          </div>
        </div>

        {/* Right Col: Reviews List */}
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
                       <div className="h-10 w-10 rounded-full bg-muted overflow-hidden relative">
                          <Image src={review.avatar_url || '/placeholder-avatar.jpg'} alt={review.first_name || 'User'} fill className="object-cover" />
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
                    <button className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                       <ThumbsUp className="h-3.5 w-3.5" /> Helpful ({review.helpful_votes})
                    </button>
                 </div>
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
}
