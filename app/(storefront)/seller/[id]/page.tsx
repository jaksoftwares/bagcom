'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ShieldCheck,
  MapPin,
  Calendar,
  Activity,
  Store,
  CheckCircle2,
  MessageCircle,
  Award,
  Star,
  Zap,
  Package,
  Search,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Layout & Components
import StorefrontLayout from '@/components/layout/StorefrontLayout';
import Footer from '@/components/navigation/Footer';
import ProductCard from '@/components/products/ProductCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Services
import { getProducts, Product } from '@/services/products/productService';
import { getCurrentUser } from '@/services/auth/authService';

interface SellerData {
  id: string;
  first_name: string;
  last_name: string;
  profile_photo_url: string;
  created_at: string;
  shop_name: string;
  bio: string;
  city: string;
  physical_address: string;
  average_rating: number;
  total_reviews: number;
  total_products: number;
  total_sales: number;
  verification_status: string;
}

interface SellerReview {
  review_id: string;
  rating: number;
  comment: string;
  helpful_votes: number;
  created_at: string;
  reviewer_name: string;
  reviewer_avatar: string;
  product_title: string;
  product_slug: string;
}

export default function SellerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [seller, setSeller] = useState<SellerData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<SellerReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      setIsLoading(true);
      try {
        const [user, sellerRes, productsData, reviewsRes] = await Promise.all([
          getCurrentUser(),
          fetch(`/api/sellers/${id}`),
          getProducts({ sellerId: id }),
          fetch(`/api/sellers/${id}/reviews`)
        ]);

        setCurrentUser(user);

        if (sellerRes.ok) {
          const sellerJson = await sellerRes.json();
          setSeller(sellerJson.seller);
        }

        setProducts(productsData);

        if (reviewsRes.ok) {
          const reviewsJson = await reviewsRes.json();
          setReviews(reviewsJson.reviews || []);
        }
      } catch (error) {
        console.error('Error loading seller profile:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleMessage = () => {
    if (!currentUser) {
      router.push(`/login?redirect=/seller/${id}`);
      return;
    }
    router.push(`/chat?seller_id=${id}`);
  };

  // Filter products by search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(p =>
      p.title?.toLowerCase().includes(q) ||
      (p.category as any)?.name?.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  if (isLoading) {
    return (
      <StorefrontLayout>
        <div className="container mx-auto px-4 py-12 space-y-12">
          <div className="h-48 bg-muted/10 animate-pulse rounded-xl" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted/10 animate-pulse rounded-xl" />
            ))}
          </div>
        </div>
      </StorefrontLayout>
    );
  }

  if (!seller) {
    return (
      <StorefrontLayout>
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
          <Store className="h-16 w-16 text-muted-foreground/20 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Seller Not Found</h1>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">This seller may have deactivated their account or the link is incorrect.</p>
          <Link href="/products">
            <Button variant="outline" className="rounded-md uppercase tracking-widest text-[10px] font-bold h-12 px-8">Back to marketplace</Button>
          </Link>
        </div>
      </StorefrontLayout>
    );
  }

  const sellerName = seller.shop_name || (seller.first_name ? `${seller.first_name} ${seller.last_name || ''}`.trim() : 'Verified Seller');
  const isVerified = seller.verification_status === 'VERIFIED';
  const avgRating = Number(seller.average_rating ?? 0);

  const stats = [
    { icon: Package, label: 'Listings', value: seller.total_products ?? products.length, color: 'text-primary' },
    { icon: TrendingUp, label: 'Sales', value: seller.total_sales > 0 ? `${seller.total_sales}+` : '0', color: 'text-amber-500' },
    { icon: Star, label: 'Rating', value: avgRating > 0 ? avgRating.toFixed(1) : 'New', color: 'text-amber-400' },
    { icon: MessageSquare, label: 'Reviews', value: seller.total_reviews ?? 0, color: 'text-blue-500' }
  ];

  return (
    <StorefrontLayout>
      <div className="bg-white min-h-screen">

        {/* Profile Header */}
        <div className="bg-muted/5 border-b border-border/20 py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-10 items-start lg:items-center">

              {/* Avatar */}
              <div className="relative shrink-0">
                <Avatar className="h-28 w-28 md:h-36 md:w-36 border-4 border-white shadow-xl">
                  <AvatarImage src={seller.profile_photo_url} className="object-cover" />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-4xl uppercase">
                    {sellerName[0]}
                  </AvatarFallback>
                </Avatar>
                {isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-full border-4 border-white shadow-lg">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">{sellerName}</h1>
                    {isVerified && <CheckCircle2 className="h-5 w-5 text-primary" />}
                    {!isVerified && (
                      <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest border-amber-300 text-amber-600">
                        Pending Verification
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-5 text-muted-foreground/70 text-sm font-semibold">
                    {(seller.city || seller.physical_address) && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{seller.city || seller.physical_address}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Joined {new Date(seller.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                    </div>
                    {avgRating > 0 && (
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star key={i} className={`h-3.5 w-3.5 ${i <= Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/20'}`} />
                        ))}
                        <span className="text-xs font-bold text-foreground ml-1.5">{avgRating.toFixed(1)} ({seller.total_reviews} {seller.total_reviews === 1 ? 'review' : 'reviews'})</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-1">
                  <Button
                    onClick={handleMessage}
                    className="h-11 px-6 rounded-lg bg-foreground text-white font-bold uppercase tracking-widest text-[10px] shadow-sm hover:bg-foreground/90"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" /> Send Message
                  </Button>
                  {isVerified && (
                    <Button variant="outline" className="h-11 px-6 rounded-lg border-border/60 text-foreground font-bold uppercase tracking-widest text-[10px] hover:bg-muted/5">
                      <Award className="h-4 w-4 mr-2" /> Verified Seller
                    </Button>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 w-full lg:w-auto lg:min-w-[280px]">
                {stats.map((stat, i) => (
                  <div key={i} className="p-4 bg-white border border-border/40 rounded-xl shadow-sm">
                    <div className="flex items-center gap-2 mb-1.5">
                      <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
                      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">{stat.label}</p>
                    </div>
                    <p className="text-sm font-bold text-foreground">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bio / About Section */}
        {seller.bio && (
          <div className="border-b border-border/20 py-8">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">About this Seller</h2>
              <p className="text-sm text-foreground/80 leading-relaxed font-medium">{seller.bio}</p>
            </div>
          </div>
        )}

        {/* Listings */}
        <main className="container mx-auto px-4 py-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground tracking-tight">Active Listings</h2>
              <p className="text-sm font-medium text-muted-foreground mt-0.5">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} available
              </p>
            </div>

            {/* In-store search */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
              <input
                type="text"
                placeholder="Search this store..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-4 text-sm text-foreground bg-white border border-border/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-muted/5 rounded-xl border border-dashed border-border/40">
              <Store className="h-10 w-10 text-muted-foreground/20 mx-auto mb-4" />
              <h3 className="text-base font-bold text-foreground mb-2">
                {searchQuery ? 'No matching items' : 'No Active Listings'}
              </h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                {searchQuery ? `No products match "${searchQuery}". Try a different keyword.` : "This seller hasn't posted any items yet."}
              </p>
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="mt-4 text-primary text-sm font-bold hover:underline">
                  Clear search
                </button>
              )}
            </div>
          )}
        </main>

        {/* Customer Reviews Section */}
        {reviews.length > 0 && (
          <section className="container mx-auto px-4 py-10 border-t border-border/20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-foreground tracking-tight">Customer Reviews</h2>
                <p className="text-sm text-muted-foreground mt-0.5">What buyers say about this seller's products</p>
              </div>
              {avgRating > 0 && (
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-black text-foreground">{avgRating.toFixed(1)}</div>
                  <div>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className={`h-4 w-4 ${i <= Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/20'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">{seller.total_reviews} {seller.total_reviews === 1 ? 'review' : 'reviews'}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map(review => (
                <div key={review.review_id} className="p-5 bg-muted/5 border border-border/40 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-muted overflow-hidden relative shrink-0">
                        {review.reviewer_avatar ? (
                          <Image src={review.reviewer_avatar} alt={review.reviewer_name} fill className="object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-bold text-sm">
                            {(review.reviewer_name || 'U')[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{review.reviewer_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i <= review.rating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">{review.comment}</p>
                  <Link href={`/product/${review.product_slug}`} className="inline-block mt-3 text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">
                    View: {review.product_title}
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trust Banner */}
        <section className="bg-muted/5 border-t border-border/20 py-12 mt-6">
          <div className="container mx-auto px-4 max-w-3xl text-center space-y-6">
            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground tracking-tight uppercase tracking-widest">Safe Community Trading</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-lg mx-auto">
              Bagcom's escrow protocol protects every transaction. Funds are only released after you confirm delivery and quality.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="outline" className="border-border/60 text-[9px] font-bold uppercase tracking-widest px-3 py-1">Secure Payments</Badge>
              <Badge variant="outline" className="border-border/60 text-[9px] font-bold uppercase tracking-widest px-3 py-1">Identity Verified</Badge>
              <Badge variant="outline" className="border-border/60 text-[9px] font-bold uppercase tracking-widest px-3 py-1">Buyer Protection</Badge>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </StorefrontLayout>
  );
}
