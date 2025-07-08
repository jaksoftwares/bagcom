'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Share2, 
  MapPin, 
  Clock, 
  Star, 
  Eye, 
  MessageCircle,
  ShoppingCart,
  Shield,
  Truck,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Calendar,
  Package,
  Award,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Header from '@/components/Header';
import Link from 'next/link';
import { getProductById } from '@/lib/products';
import { getCategory, getSubcategory } from '@/lib/categories';

export default function ProductDetail() {
  const params = useParams();
  const productId = parseInt(params.id as string);
  const product = getProductById(productId);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'seller' | 'buyer'>('buyer');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userRole={userRole} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/products">
              <Button>Browse All Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const category = getCategory(product.category);
  const subcategory = getSubcategory(product.category, product.subcategory);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const totalPrice = product.price + product.commission;
  const savings = product.originalPrice - totalPrice;
  const savingsPercentage = Math.round((savings / product.originalPrice) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userRole={userRole} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-blue-600">Products</Link>
          <span>/</span>
          <Link href={`/category/${product.category}`} className="hover:text-blue-600">
            {category?.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.images[currentImageIndex]}
                alt={product.title}
                className="w-full h-96 lg:h-[500px] object-cover rounded-lg shadow-lg"
              />
              
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <Badge className="bg-green-500 text-white">
                  {product.condition}
                </Badge>
                {product.negotiable && (
                  <Badge variant="outline" className="bg-white/90">
                    Negotiable
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
                {currentImageIndex + 1} / {product.images.length}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{category?.name}</Badge>
                <Badge variant="outline">{subcategory?.name}</Badge>
              </div>
              
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{product.views} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{product.likes + (isLiked ? 1 : 0)} likes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{product.timePosted}</span>
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
                        KSh {totalPrice.toLocaleString()}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        KSh {product.originalPrice.toLocaleString()}
                      </span>
                      <Badge className="bg-green-500 text-white">
                        Save {savingsPercentage}%
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      Seller gets: KSh {product.price.toLocaleString()} | Platform fee: KSh {product.commission.toLocaleString()}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{product.location.area}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        Delivery: {product.deliveryOptions.join(', ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        Payment: {product.paymentMethods.join(', ')}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex gap-3">
                    <Button className="flex-1" size="lg">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button variant="outline" size="lg">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact Seller
                    </Button>
                  </div>

                  {product.availability !== 'Available' && (
                    <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm text-yellow-800">
                        This item is currently {product.availability.toLowerCase()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Seller Information</h3>
                  {product.seller.isVerified && (
                    <Badge className="bg-blue-500 text-white">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {product.seller.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{product.seller.name}</div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{product.seller.rating}</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {product.seller.totalSales} sales
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {product.seller.joinedDate}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
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
              <TabsTrigger value="delivery">Delivery & Payment</TabsTrigger>
              <TabsTrigger value="seller">About Seller</TabsTrigger>
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

                  {product.reasonForSelling && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Why I&apos;m Selling</h4>
                      <p className="text-blue-800">{product.reasonForSelling}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
                  {product.specifications ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                          <span className="font-medium text-gray-700">{key}:</span>
                          <span className="text-gray-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No detailed specifications available.</p>
                  )}

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {product.brand && (
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Award className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                        <div className="font-semibold text-gray-900">Brand</div>
                        <div className="text-gray-600">{product.brand}</div>
                      </div>
                    )}
                    {product.yearPurchased && (
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Calendar className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                        <div className="font-semibold text-gray-900">Year Purchased</div>
                        <div className="text-gray-600">{product.yearPurchased}</div>
                      </div>
                    )}
                    {product.warranty && (
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Shield className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                        <div className="font-semibold text-gray-900">Warranty</div>
                        <div className="text-gray-600">{product.warranty}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="delivery" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        Delivery Options
                      </h3>
                      <div className="space-y-3">
                        {product.deliveryOptions.map((option, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-gray-700">{option}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Payment Methods
                      </h3>
                      <div className="space-y-3">
                        {product.paymentMethods.map((method, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-gray-700">{method}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Secure Transaction Guarantee
                    </h4>
                    <p className="text-blue-800 text-sm">
                      All transactions are protected by JKUATBagCom&apos;s buyer protection policy. 
                      Your payment is held securely until you confirm receipt of the item.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seller" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">
                        {product.seller.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{product.seller.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{product.seller.rating}</span>
                        </div>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-600">{product.seller.totalSales} sales</span>
                        {product.seller.isVerified && (
                          <>
                            <span className="text-gray-600">•</span>
                            <Badge className="bg-blue-500 text-white">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{product.seller.totalSales}</div>
                      <div className="text-sm text-gray-600">Total Sales</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{product.seller.rating}</div>
                      <div className="text-sm text-gray-600">Average Rating</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">
                        {new Date(product.seller.joinedDate).getFullYear()}
                      </div>
                      <div className="text-sm text-gray-600">Member Since</div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>
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