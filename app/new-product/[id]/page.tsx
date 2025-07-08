'use client';

import { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Share2, 
  MapPin, 
  Star, 
  ShoppingCart,
  Shield,
  Truck,
  CreditCard,
  ArrowLeft,
  Package,
  Award,
  CheckCircle,
  Phone,
  Mail
} from 'lucide-react';
import Header from '@/components/Header';
import Link from 'next/link';
import { getNewProductById } from '@/lib/new-products-data';

export default function NewProductDetail() {
  const params = useParams();
  const productId = parseInt(params.id as string);
  const product = getNewProductById(productId);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'seller' | 'buyer'>('buyer');
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    notFound();
  }

  const savings = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userRole={userRole} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href="/new-products" className="hover:text-blue-600">New Products</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-96 lg:h-[500px] object-cover rounded-lg shadow-lg"
              />
              
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <Badge className="bg-green-500 text-white">
                  NEW
                </Badge>
                {savings > 0 && (
                  <Badge className="bg-red-500 text-white">
                    {savings}% OFF
                  </Badge>
                )}
                {product.freeShipping && (
                  <Badge className="bg-blue-500 text-white">
                    Free Shipping
                  </Badge>
                )}
              </div>

              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="p-2 rounded-full bg-white/90 hover:bg-white transition-all shadow-lg"
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                </button>
                <button className="p-2 rounded-full bg-white/90 hover:bg-white transition-all shadow-lg">
                  <Share2 className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.category}</Badge>
                <Badge variant="outline">{product.subcategory}</Badge>
              </div>
              
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-sm text-gray-600">({product.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{product.region}</span>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl font-bold text-gray-900">
                        KSh {product.price.toLocaleString()}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        KSh {product.originalPrice.toLocaleString()}
                      </span>
                      <Badge className="bg-green-500 text-white">
                        Save {savings}%
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      Brand: {product.brand} | Warranty: {product.warranty}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {product.freeShipping ? 'Free shipping included' : 'Shipping charges apply'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {product.warranty} warranty included
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        100% authentic product
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700" 
                      size="lg"
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button variant="outline" size="lg">
                      <Heart className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>

                  {!product.inStock && (
                    <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                      <Package className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm text-yellow-800">
                        This item is currently out of stock
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Store Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Store Information</h3>
                  <Badge className="bg-blue-500 text-white">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified Store
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {product.brand.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{product.brand} Official Store</div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{product.rating}</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          ({product.reviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Store
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Store
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Product Description</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {product.description}
                  </p>
                  
                  <h4 className="font-semibold mb-3">Key Features</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Brand:</span>
                      <span className="text-gray-900">{product.brand}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Category:</span>
                      <span className="text-gray-900">{product.category}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Warranty:</span>
                      <span className="text-gray-900">{product.warranty}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Shipping:</span>
                      <span className="text-gray-900">{product.freeShipping ? 'Free' : 'Paid'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        Shipping Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-gray-700">
                            {product.freeShipping ? 'Free shipping nationwide' : 'Standard shipping rates apply'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-gray-700">Delivery within 2-5 business days</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-gray-700">Express delivery available</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Returns & Warranty
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-gray-700">30-day return policy</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-gray-700">{product.warranty} manufacturer warranty</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-gray-700">Free returns on defective items</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Customer Reviews</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="font-medium">{product.rating}</span>
                      <span className="text-gray-600">({product.reviews} reviews)</span>
                    </div>
                  </div>
                  
                  <div className="text-center py-8 text-gray-500">
                    <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Customer reviews will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}