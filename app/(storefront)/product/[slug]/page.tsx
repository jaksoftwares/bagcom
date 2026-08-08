'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertCircle, 
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
  Zap
} from 'lucide-react';
import Link from 'next/link';

// Layout & Navigation
import StorefrontLayout from '@/components/layout/StorefrontLayout';
import Footer from '@/components/navigation/Footer';

// Product Detail Components
import ProductGallery from '@/components/product-detail/ProductGallery';
import ProductHeader from '@/components/product-detail/ProductHeader';
import SellerCard from '@/components/product-detail/SellerCard';
import EscrowModule from '@/components/product-detail/EscrowModule';
import PurchasePanel from '@/components/product-detail/PurchasePanel';
import MobileStickyBar from '@/components/product-detail/MobileStickyBar';
import ProductCard from '@/components/products/ProductCard';

// Phase 3 Components
import ProductVariants from '@/components/product-detail/ProductVariants';
import UrgencyAndShipping from '@/components/product-detail/UrgencyAndShipping';
import ProductReviews from '@/components/product-detail/ProductReviews';
import FrequentlyBoughtTogether from '@/components/product-detail/FrequentlyBoughtTogether';

// Services & Context
import { useCartStore } from '@/store/useCartStore';
import { getProductBySlug, getProducts, Product } from '@/services/products/productService';
import { getCurrentUser } from '@/services/auth/authService';

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const addToCart = useCartStore(state => state.addToCart);
  const slug = params.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Variant selection state
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

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
          
          // Initial variant selection (select first option of each variant by default)
          const initialVariants: Record<string, string> = {};
          if (data.variants && Array.isArray(data.variants)) {
             data.variants.forEach((v: any) => {
               if (v.name && v.options && v.options.length > 0) {
                 initialVariants[v.name] = v.options[0];
               }
             });
          }
          setSelectedVariants(initialVariants);

          // Parallel fetch for recommendation sections
          const [related, sellerItems] = await Promise.all([
            getProducts({ category_id: data.category_id || undefined, limit: 5 }),
            getProducts({ sellerId: data.seller_id, limit: 5 })
          ]);

          setRelatedProducts(related.filter(p => p.id !== data.id).slice(0, 4));
          setSellerProducts(sellerItems.filter(p => p.id !== data.id).slice(0, 4));

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
    
    // Construct variant string
    const variantParts = Object.entries(selectedVariants).map(([k, v]) => `${k}: ${v}`);
    const variantName = variantParts.length > 0 ? ` - ${variantParts.join(', ')}` : '';

    addToCart({
      id: product.id, // For a real app, variant id would be appended
      name: product.title + variantName,
      price: product.price,
      image: product.images?.[0]?.image_url || product.image || '/placeholder-product.jpg',
      seller: product.seller?.first_name || 'Verified Seller',
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

  const handleVariantSelect = (name: string, option: string) => {
     setSelectedVariants(prev => ({ ...prev, [name]: option }));
  };

  if (isLoading) {
    return (
      <StorefrontLayout>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-12 space-y-8">
            <div className="h-8 w-64 bg-muted animate-pulse rounded-lg" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
               <div className="lg:col-span-7 h-[600px] bg-muted animate-pulse rounded-3xl" />
               <div className="lg:col-span-5 h-[600px] bg-muted animate-pulse rounded-3xl" />
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
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-black text-foreground mb-4 tracking-tight">Item Not Found</h1>
          <p className="text-muted-foreground mb-10 max-w-md mx-auto font-medium">This product may have been sold, removed, or the link might be broken.</p>
          <Link href="/products">
            <button className="h-14 px-10 bg-primary text-white font-black rounded-xl uppercase tracking-widest shadow-xl">Browse All Items</button>
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
      <div className="bg-background min-h-screen pb-24 lg:pb-0">
        <main className="container mx-auto px-4 sm:px-6 py-6 lg:py-12">
          
          {/* Enhanced Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
            <Link href="/" className="hover:text-primary transition-colors">Marketplace</Link>
            <ChevronRight className="h-3 w-3 opacity-30" />
            <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
            <ChevronRight className="h-3 w-3 opacity-30" />
            <span className="text-foreground">{product.category?.name}</span>
            <ChevronRight className="h-3 w-3 opacity-30" />
            <span className="text-muted-foreground/60 truncate max-w-[200px]">{product.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* LEFT COLUMN: Gallery & Description */}
            <div className="lg:col-span-7 space-y-12">
               <ProductGallery 
                 images={product.images || []} 
                 title={product.title}
                 condition={product.condition}
                 discount={discountPercent}
               />
               
               <FrequentlyBoughtTogether currentProduct={product} />

               {/* Description and Specs Flowing Instead of Tabs */}
               <div className="pt-8 border-t border-border/40 space-y-8">
                  <div className="space-y-4">
                     <h3 className="text-xl font-bold text-foreground">About this item</h3>
                     <div className="prose prose-sm md:prose-base max-w-none text-muted-foreground">
                        {product.description ? (
                           <p className="whitespace-pre-wrap leading-relaxed">{product.description}</p>
                        ) : (
                           <p className="italic">No description provided.</p>
                        )}
                     </div>
                  </div>

                  {product.specifications && Object.keys(product.specifications).length > 0 && (
                     <div className="space-y-4">
                        <h3 className="text-xl font-bold text-foreground">Specifications</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                           {(product.brand || product.model) && (
                              <>
                                {product.brand && (
                                   <div className="flex justify-between py-2 border-b border-border/30">
                                      <span className="text-muted-foreground">Brand</span>
                                      <span className="font-semibold text-foreground">{product.brand}</span>
                                   </div>
                                )}
                                {product.model && (
                                   <div className="flex justify-between py-2 border-b border-border/30">
                                      <span className="text-muted-foreground">Model</span>
                                      <span className="font-semibold text-foreground">{product.model}</span>
                                   </div>
                                )}
                              </>
                           )}
                           {Object.entries(product.specifications as Record<string, string>).map(([key, value]) => (
                             <div key={key} className="flex justify-between py-2 border-b border-border/30">
                               <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</span>
                               <span className="font-semibold text-foreground">{value}</span>
                             </div>
                           ))}
                        </div>
                     </div>
                  )}
               </div>
            </div>

            {/* RIGHT COLUMN: Action Panel */}
            <div className="lg:col-span-5 relative">
               <div className="sticky top-24 space-y-8">
                  <ProductHeader 
                    product={product} 
                    viewCount={product.view_count}
                    favoriteCount={product.favorite_count}
                  />
                  
                  {/* Dynamic Variants */}
                  <ProductVariants 
                    variants={product.variants as any} 
                    onVariantSelect={handleVariantSelect}
                  />

                  {/* Urgency and Shipping */}
                  <UrgencyAndShipping product={product} />
                  
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
               </div>
            </div>
          </div>

          {/* REVIEWS SECTION */}
          <div className="mt-20">
             <ProductReviews productId={product.id} />
          </div>

          {/* MORE FROM THIS SELLER */}
          {sellerProducts.length > 0 && (
            <section className="mt-20 space-y-10 border-t border-border/40 pt-16">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="space-y-3">
                     <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full text-primary font-bold text-[10px] uppercase tracking-widest border border-primary/10">
                        <ShoppingBag className="h-3 w-3" /> Exclusive
                     </div>
                     <h2 className="text-3xl font-bold text-foreground tracking-tight">More from {product.seller?.first_name || 'this seller'}</h2>
                  </div>
                  <Link href={`/seller/${product.seller_id}`} className="text-sm font-bold text-primary hover:underline flex items-center gap-2">
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
            <section className="mt-20 pt-16 border-t border-border/40 space-y-10">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="space-y-3">
                     <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full text-emerald-600 font-bold text-[10px] uppercase tracking-widest border border-emerald-100">
                        <Zap className="h-3 w-3" /> Similar
                     </div>
                     <h2 className="text-3xl font-bold text-foreground tracking-tight">You may also like</h2>
                  </div>
                  <Link href={`/categories/${product.category?.slug}`} className="text-sm font-bold text-primary hover:underline flex items-center gap-2">
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
