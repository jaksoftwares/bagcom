'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Heart, 
  MapPin, 
  Clock, 
  Star, 
  MessageCircle,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Eye,
  Info,
  ShoppingBag,
  Loader2
} from 'lucide-react';
import StorefrontLayout from '@/components/layout/StorefrontLayout';
import ProductCard from '@/components/products/ProductCard';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { getProductBySlug, getProducts, Product } from '@/services/products/productService';
import { getCurrentUser } from '@/services/auth/authService';

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const slug = params.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      const [data, user] = await Promise.all([
        getProductBySlug(slug),
        getCurrentUser()
      ]);
      setCurrentUser(user);
      if (data) {
        setProduct(data);
        const related = await getProducts({ category_id: data.category_id || undefined, limit: 4 });
        setRelatedProducts(related.filter(p => p.id !== data.id));

        // --- TRACKING LOGIC ---
        // 1. LocalStorage Tracking (For everyone)
        try {
          const localHistory = JSON.parse(localStorage.getItem('bagcom_recently_viewed') || '[]');
          const updatedHistory = [data.id, ...localHistory.filter((id: string) => id !== data.id)].slice(0, 20);
          localStorage.setItem('bagcom_recently_viewed', JSON.stringify(updatedHistory));
        } catch (e) {
          console.error('LocalStorage tracking error', e);
        }

        // 2. Database Tracking (For logged-in users)
        if (user && data.id) {
          fetch('/api/products/track-view', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, productId: data.id })
          }).catch(console.error);

          // 3. Check if already wishlisted
          try {
            const res = await fetch(`/api/favorites?userId=${user.id}`);
            const json = await res.json();
            const alreadySaved = json.favorites?.some((f: any) => f.product_id === data.id);
            setIsWishlisted(alreadySaved);
          } catch {}
        }
      }
      setIsLoading(false);
    }
    loadData();
  }, [slug]);



   const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.images?.[0]?.image_url || '',
      seller: product.seller?.first_name ? `${product.seller.first_name} ${product.seller.last_name || ''}`.trim() : 'Verified Seller',
      category: product.category?.name
    });
    toast({ 
      title: "Added to cart", 
      description: "You can view your items in the shopping cart.",
      action: <Link href="/cart" className="bg-primary text-white px-3 py-1 rounded text-xs font-bold">View Cart</Link>
    });
  };

  const handleBuyNow = () => {
    if (!currentUser) {
      toast({ title: "Sign in required", description: "Please log in to purchase items.", variant: "destructive" });
      router.push(`/login?redirect=/product/${slug}`);
      return;
    }
    if (!product) return;
    
    // Add to cart first then checkout
    addToCart({
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.images?.[0]?.image_url || '',
      seller: product.seller?.first_name ? `${product.seller.first_name} ${product.seller.last_name || ''}`.trim() : 'Verified Seller',
      category: product.category?.name
    });
    router.push(`/checkout`);
  };

  const handleWishlist = async () => {
    if (!currentUser) {
      toast({ title: "Sign in required", description: "Log in to save items to your wishlist.", variant: "destructive" });
      return;
    }
    if (!product) return;

    setIsWishlistLoading(true);
    try {
      if (isWishlisted) {
        await fetch('/api/favorites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUser.id, productId: product.id })
        });
        setIsWishlisted(false);
        toast({ title: "Removed from wishlist" });
      } else {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUser.id, productId: product.id })
        });
        setIsWishlisted(true);
        toast({ title: "Saved to wishlist" });
      }
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
    } finally {
      setIsWishlistLoading(false);
    }
  };


  const handleStartChat = async () => {
    if (!currentUser) {
      toast({ title: "Sign in required", description: "Log in to message the seller.", variant: "destructive" });
      router.push(`/login?redirect=/product/${slug}`);
      return;
    }
    if (!product) return;

    try {
      const res = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer_id: currentUser.id,
          seller_id: product.seller_id,
          product_id: product.id
        })
      });
      const data = await res.json();
      if (data.conversation) {
        router.push(`/chat?id=${data.conversation.id}`);
      }
    } catch (error) {
      toast({ title: "Could not start chat", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <StorefrontLayout>
        <div className="min-h-screen bg-white animate-pulse" />
      </StorefrontLayout>
    );
  }


  if (!product) {
    return (
      <StorefrontLayout>
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Item not found</h1>
          <p className="text-muted-foreground mb-8 text-sm">This product may have been sold or removed by the seller.</p>
          <Link href="/products">
            <Button className="rounded-sm px-8">Browse all items</Button>
          </Link>
        </div>
      </StorefrontLayout>
    );
  }

  const displayImages = product.images?.map((img: any) => img.image_url) || [];
  const sellerName = product.seller?.first_name ? `${product.seller.first_name} ${product.seller.last_name || ''}`.trim() : 'Verified Seller';
  const isAvailable = product.is_available && product.status === 'ACTIVE';

  return (
    <StorefrontLayout>
      <div className="min-h-screen bg-white">
        <main className="container mx-auto px-4 sm:px-6 py-6 lg:py-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50 mb-8 overflow-x-auto whitespace-nowrap pb-2 lg:pb-0">
            <Link href="/" className="hover:text-primary transition-colors">Marketplace</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/products" className="hover:text-primary transition-colors">Browse</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{product.category?.name}</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground/40 truncate">{product.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* === LEFT: Images === */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative aspect-[4/3] bg-muted/5 border border-border/30 rounded-sm overflow-hidden group">
                {displayImages.length > 0 ? (
                  <Image
                    src={displayImages[currentImageIndex]}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-700"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">No Image</div>
                )}
                
                {displayImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev + 1) % displayImages.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Condition badge */}
                <div className="absolute top-3 left-3">
                  <div className="bg-white/90 backdrop-blur-sm text-[9px] font-bold px-2 py-1 rounded-sm border border-border/20 uppercase tracking-wider text-foreground shadow-sm">
                    {product.condition}
                  </div>
                </div>
              </div>

              {displayImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {displayImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative flex-shrink-0 w-20 aspect-square rounded-sm overflow-hidden border-2 transition-all ${
                        index === currentImageIndex ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image src={image} alt={`Preview ${index + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* === RIGHT: Details + Actions === */}
            <div className="lg:col-span-5 space-y-6">
              {/* Title & Metadata */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                    {product.category?.name}
                  </span>
                  <div className="flex items-center gap-3 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Eye className="h-3.5 w-3.5" /> {product.view_count || 0}</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {new Date(product.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <h1 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight tracking-tight">
                  {product.title}
                </h1>

                <div className="flex items-baseline gap-3 pt-2">
                  <span className="text-3xl font-bold text-foreground">
                    KSh {product.price.toLocaleString()}
                  </span>
                  {product.original_price && (
                    <span className="text-lg text-muted-foreground line-through opacity-40">
                      KSh {product.original_price.toLocaleString()}
                    </span>
                  )}
                  {product.negotiable && (
                    <Badge variant="outline" className="ml-2 border-primary/30 text-primary text-[10px] font-bold uppercase bg-primary/5">
                      Negotiable
                    </Badge>
                  )}
                </div>
              </div>

              {/* === PRIMARY ACTION PANEL === */}
              <div className="p-6 bg-muted/5 border border-border/40 rounded-sm space-y-4 shadow-sm sticky top-24">
                {!isAvailable ? (
                  <div className="bg-red-50 border border-red-200 rounded-sm p-4 text-center">
                    <p className="text-sm font-bold text-red-700">This item has been sold or is no longer available.</p>
                    <Link href="/products" className="text-sm text-primary font-bold mt-2 block hover:underline">Browse similar items →</Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                     {/* BUY NOW — Primary CTA */}
                    <div className="space-y-2">
                      <Button
                        onClick={handleBuyNow}
                        className="w-full h-13 text-[13px] font-bold uppercase tracking-widest shadow-md bg-primary hover:bg-primary/90 gap-2"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Buy Now
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleAddToCart}
                        className="w-full h-11 text-[11px] font-bold uppercase tracking-widest border-primary/20 text-primary hover:bg-primary/5 transition-all"
                      >
                        Add to Cart
                      </Button>
                    </div>

                    {/* Secondary actions */}
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        onClick={handleWishlist}
                        disabled={isWishlistLoading}
                        className={`h-11 text-[11px] font-bold uppercase tracking-widest border-border/60 gap-2 ${isWishlisted ? 'border-red-300 text-red-500 bg-red-50' : ''}`}
                      >
                        {isWishlistLoading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Heart className={`h-3.5 w-3.5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                        )}
                        {isWishlisted ? 'Saved' : 'Save'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleStartChat}
                        className="h-11 text-[11px] font-bold uppercase tracking-widest border-border/60 gap-2"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        Chat
                      </Button>

                    </div>
                  </div>
                )}

                <Separator className="bg-border/30" />

                {/* Seller Info */}
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted border border-border/30 flex-shrink-0">
                    {product.seller?.profile_photo_url ? (
                      <Image src={product.seller.profile_photo_url} alt={sellerName} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground/60 text-sm">
                        {sellerName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-foreground">{sellerName}</h3>
                      <CheckCircle className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-bold text-foreground/80">4.8</span>
                      <span className="text-muted-foreground/40 text-xs">•</span>
                      <span className="text-[11px] font-medium text-muted-foreground">Verified Seller</span>
                    </div>
                  </div>
                </div>

                {/* Escrow Badge */}
                <div className="bg-primary/5 p-4 rounded-sm border border-primary/10 flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-primary uppercase tracking-tight">Escrow Protected</p>
                    <p className="text-[11px] text-primary/80 leading-snug">Your payment is held securely. Funds are only released to the seller after you confirm delivery.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* === DESCRIPTION & SPECS === */}
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-12">
              <section className="space-y-6">
                <h2 className="text-lg font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
                  <span className="w-8 h-[2px] bg-primary" />
                  Description
                </h2>
                <div className="text-[15px] text-muted-foreground leading-[1.8]">
                  {product.description || 'No description provided.'}
                </div>
              </section>

              {product.specifications && Object.keys(product.specifications as object).length > 0 && (
                <section className="space-y-6">
                  <h2 className="text-lg font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
                    <span className="w-8 h-[2px] bg-primary" />
                    Specifications
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-2">
                    {Object.entries(product.specifications as object).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-3 border-b border-border/20">
                        <span className="text-sm font-semibold text-muted-foreground/60">{key}</span>
                        <span className="text-sm font-bold text-foreground">{String(value)}</span>
                      </div>
                    ))}
                    {product.brand && (
                      <div className="flex justify-between py-3 border-b border-border/20">
                        <span className="text-sm font-semibold text-muted-foreground/60">Brand</span>
                        <span className="text-sm font-bold text-foreground">{product.brand}</span>
                      </div>
                    )}
                  </div>
                </section>
              )}

              <div className="p-6 border border-yellow-200 bg-yellow-50/30 rounded-sm flex gap-4">
                <Info className="h-6 w-6 text-yellow-600 shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-yellow-800 uppercase tracking-widest">Safety Tips</h4>
                  <p className="text-xs text-yellow-700 leading-relaxed">
                    Always use Bagcom Escrow when buying. Never send money outside the platform. Meet in a safe, public location to inspect the item before confirming delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* === RELATED ITEMS === */}
          {relatedProducts.length > 0 && (
            <section className="mt-24 space-y-8">
              <h2 className="text-xl font-bold text-foreground uppercase tracking-[0.2em]">Similar Items</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-5">
                {relatedProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </StorefrontLayout>
  );
}
