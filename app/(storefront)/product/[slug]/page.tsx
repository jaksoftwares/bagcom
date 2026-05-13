'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertCircle, 
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
  Zap,
  Info
} from 'lucide-react';
import Link from 'next/link';

// Layout & Navigation
import StorefrontLayout from '@/components/layout/StorefrontLayout';
import Header from '@/components/navigation/Header';
import Footer from '@/components/navigation/Footer';

// Product Detail Components
import ProductGallery from '@/components/product-detail/ProductGallery';
import ProductHeader from '@/components/product-detail/ProductHeader';
import SellerCard from '@/components/product-detail/SellerCard';
import EscrowModule from '@/components/product-detail/EscrowModule';
import ProductTabs from '@/components/product-detail/ProductTabs';
import PurchasePanel from '@/components/product-detail/PurchasePanel';
import MobileStickyBar from '@/components/product-detail/MobileStickyBar';
import ProductCard from '@/components/products/ProductCard';

// Services & Context
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
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      try {
        const [data, user] = await Promise.all([
          getProductBySlug(slug),
          getCurrentUser()
        ]);
        setCurrentUser(user);
        
        if (data) {
          setProduct(data);
          
          // Parallel fetch for all recommendation sections
          const [related, sellerItems, trending] = await Promise.all([
            getProducts({ category_id: data.category_id || undefined, limit: 5 }),
            getProducts({ sellerId: data.seller_id, limit: 5 }),
            getProducts({ limit: 12 }) 
          ]);

          setRelatedProducts(related.filter(p => p.id !== data.id).slice(0, 4));
          setSellerProducts(sellerItems.filter(p => p.id !== data.id).slice(0, 4));
          setTrendingProducts(trending.filter(p => p.id !== data.id));

          // Track View
          if (user && data.id) {
            fetch('/api/products/track-view', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: user.id, productId: data.id })
            }).catch(console.error);

            // Check Wishlist
            const favRes = await fetch(`/api/favorites?userId=${user.id}`);
            const favJson = await favRes.json();
            setIsWishlisted(favJson.favorites?.some((f: any) => f.product_id === data.id));
          }
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setIsLoading(false);
      }
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
      description: "Item successfully added to your shopping cart."
    });
  };

  const handleBuyNow = () => {
    if (!currentUser) {
      toast({ title: "Sign in required", description: "Please log in to purchase items.", variant: "destructive" });
      router.push(`/login?redirect=/product/${slug}`);
      return;
    }
    handleAddToCart();
    router.push(`/checkout`);
  };

  const handleWishlist = async () => {
    if (!currentUser) {
      toast({ title: "Sign in required", description: "Log in to save items to your wishlist.", variant: "destructive" });
      return;
    }
    if (!product || isWishlistLoading) return;

    setIsWishlistLoading(true);
    try {
      const method = isWishlisted ? 'DELETE' : 'POST';
      await fetch('/api/favorites', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, productId: product.id })
      });
      setIsWishlisted(!isWishlisted);
      toast({ title: isWishlisted ? "Removed from wishlist" : "Saved to wishlist" });
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const handleStartChat = () => {
    if (!currentUser) {
      toast({ title: "Sign in required", description: "Log in to message the seller.", variant: "destructive" });
      router.push(`/login?redirect=/product/${slug}`);
      return;
    }
    if (!product) return;
    router.push(`/chat?seller_id=${product.seller_id}&product_id=${product.id}`);
  };

  if (isLoading) {
    return (
      <StorefrontLayout>
        <div className="min-h-screen bg-white">
          <div className="container mx-auto px-4 py-12 space-y-8">
            <div className="h-8 w-64 bg-slate-100 animate-pulse rounded-lg" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
               <div className="lg:col-span-7 h-[600px] bg-slate-100 animate-pulse rounded-[2.5rem]" />
               <div className="lg:col-span-5 h-[600px] bg-slate-100 animate-pulse rounded-[2.5rem]" />
            </div>
          </div>
        </div>
      </StorefrontLayout>
    );
  }

  if (!product) {
    return (
      <StorefrontLayout>
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
          <AlertCircle className="h-16 w-16 text-slate-300 mx-auto mb-6" />
          <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Item Not Found</h1>
          <p className="text-slate-500 mb-10 max-w-md mx-auto font-medium">This product may have been sold, removed, or the link might be broken.</p>
          <Link href="/products">
            <button className="h-14 px-10 bg-primary text-white font-black rounded-2xl uppercase tracking-widest shadow-xl">Browse All Items</button>
          </Link>
        </div>
      </StorefrontLayout>
    );
  }

  const isAvailable = product.is_available && product.status === 'ACTIVE';
  const discountPercent = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <StorefrontLayout>
      <div className="bg-white min-h-screen pb-24 lg:pb-0">
        <main className="container mx-auto px-4 sm:px-6 py-6 lg:py-12">
          
          {/* Enhanced Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-10 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
            <Link href="/" className="hover:text-primary transition-colors">Marketplace</Link>
            <ChevronRight className="h-3 w-3 opacity-30" />
            <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
            <ChevronRight className="h-3 w-3 opacity-30" />
            <span className="text-slate-900">{product.category?.name}</span>
            <ChevronRight className="h-3 w-3 opacity-30" />
            <span className="text-slate-300 truncate max-w-[200px]">{product.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* LEFT COLUMN: Gallery & Info */}
            <div className="lg:col-span-7 space-y-12">
               <ProductGallery 
                 images={product.images || []} 
                 title={product.title}
                 condition={product.condition}
                 discount={discountPercent}
               />
               
               <div className="hidden lg:block">
                  <ProductTabs 
                    description={product.description || ''}
                    specifications={product.specifications}
                    brand={product.brand || undefined}
                    model={product.model || undefined}
                  />
               </div>
            </div>

            {/* RIGHT COLUMN: Header & Actions (Sticky on Desktop) */}
            <div className="lg:col-span-5 space-y-8">
               <ProductHeader 
                 product={product} 
                 viewCount={product.view_count}
                 favoriteCount={product.favorite_count}
               />
               
               <div className="hidden lg:block">
                 <PurchasePanel 
                   product={product}
                   onAddToCart={handleAddToCart}
                   onBuyNow={handleBuyNow}
                   isAvailable={isAvailable}
                 />
               </div>

               <SellerCard 
                 seller={product.seller} 
                 onContact={handleStartChat}
               />

               <EscrowModule />

               <div className="lg:hidden">
                  <ProductTabs 
                    description={product.description || ''}
                    specifications={product.specifications}
                    brand={product.brand || undefined}
                    model={product.model || undefined}
                  />
               </div>
            </div>
          </div>

          {/* MORE FROM THIS SELLER */}
          {sellerProducts.length > 0 && (
            <section className="mt-16 space-y-10">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="space-y-3">
                     <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full text-primary font-bold text-[10px] uppercase tracking-widest border border-primary/10">
                        <ShoppingBag className="h-3 w-3" /> Exclusive
                     </div>
                     <h2 className="text-3xl font-bold text-foreground tracking-tight">More from {product.seller?.first_name || 'this seller'}</h2>
                     <p className="text-muted-foreground font-medium max-w-xl text-sm leading-relaxed">Check out other quality items listed by this verified merchant.</p>
                  </div>
                  <Link href={`/seller/${product.seller_id}`} className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest flex items-center gap-2">
                     Visit store <ChevronRight className="h-4 w-4" />
                  </Link>
               </div>
               
               <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                 {sellerProducts.map(p => (
                   <ProductCard key={p.id} product={p} />
                 ))}
               </div>
            </section>
          )}

          {/* RELATED PRODUCTS SECTION */}
          {relatedProducts.length > 0 && (
            <section className="mt-16 pt-16 border-t border-border/20 space-y-10">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="space-y-3">
                     <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full text-emerald-600 font-bold text-[10px] uppercase tracking-widest border border-emerald-100">
                        <Zap className="h-3 w-3" /> Similar
                     </div>
                     <h2 className="text-3xl font-bold text-foreground tracking-tight">You may also like</h2>
                     <p className="text-muted-foreground font-medium max-w-xl text-sm leading-relaxed">Based on your interest in this item, we thought these might also catch your eye.</p>
                  </div>
                  <Link href={`/categories/${product.category?.slug}`} className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest flex items-center gap-2">
                     See more items <ChevronRight className="h-4 w-4" />
                  </Link>
               </div>
               
               <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                 {relatedProducts.map(p => (
                   <ProductCard key={p.id} product={p} />
                 ))}
               </div>
            </section>
          )}

          {/* TRENDING / DISCOVERY SECTION (AliExpress Experience) */}
          {trendingProducts.length > 0 && (
            <section className="mt-16 pt-16 border-t border-border/20 space-y-10">
               <div className="text-center space-y-3 max-w-2xl mx-auto">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full text-amber-600 font-bold text-[10px] uppercase tracking-widest border border-amber-100">
                     <Zap className="h-3 w-3 fill-current" /> Trending
                  </div>
                  <h2 className="text-3xl font-bold text-foreground tracking-tight">Discover more treasures</h2>
                  <p className="text-muted-foreground font-medium text-sm leading-relaxed">Explore the most popular items across the entire marketplace right now.</p>
               </div>
               
               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 md:gap-8">
                 {trendingProducts.map(p => (
                   <ProductCard key={p.id} product={p} />
                 ))}
               </div>
               
               <div className="text-center pt-8">
                  <Link href="/products">
                    <button className="h-12 px-10 border border-border/60 text-foreground font-bold rounded-md uppercase tracking-widest text-[10px] hover:bg-muted/5 transition-all">
                       View all products
                    </button>
                  </Link>
               </div>
            </section>
          )}

          {/* SAFETY TIPS CTA */}
          <div className="mt-16 p-10 bg-muted/5 rounded-md border border-border/40 flex flex-col md:flex-row items-center gap-10">
             <div className="h-20 w-20 bg-white rounded-md flex items-center justify-center border border-border/20 shrink-0 shadow-sm">
                <ShieldCheck className="h-8 w-8 text-primary" />
             </div>
             <div className="flex-1 text-center md:text-left space-y-2">
                <h4 className="text-xl font-bold text-foreground tracking-tight">Shopping safely on Bagcom</h4>
                <p className="text-muted-foreground font-medium leading-relaxed text-sm">We take your security seriously. Always use our built-in chat and payment systems. Never send money outside the platform and meet in public places for local pickups.</p>
             </div>
             <Link href="/safety">
                <button className="h-11 px-8 border border-border/60 text-foreground font-bold rounded-md uppercase tracking-widest text-[10px] hover:bg-white transition-all">Learn more</button>
             </Link>
          </div>
        </main>
      </div>

      {/* MOBILE STICKY ACTIONS */}
      <MobileStickyBar 
        price={product.price}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        isWishlisted={isWishlisted}
        onWishlist={handleWishlist}
        isAvailable={isAvailable}
      />

      <Footer />
    </StorefrontLayout>
  );
}
