'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Star, ShoppingCart, Truck, Shield, Award } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const newProducts = [
  {
    id: 101,
    title: 'Wireless Bluetooth Headphones',
    price: 4500,
    originalPrice: 6000,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
    brand: 'TechSound',
    rating: 4.8,
    reviews: 124,
    category: 'Electronics',
    features: ['Noise Cancelling', '30hr Battery', 'Fast Charging'],
    inStock: true,
    freeShipping: true,
    warranty: '2 Years'
  },
  {
    id: 102,
    title: 'Smart Fitness Watch',
    price: 8900,
    originalPrice: 12000,
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400',
    brand: 'FitTech',
    rating: 4.6,
    reviews: 89,
    category: 'Electronics',
    features: ['Heart Rate Monitor', 'GPS Tracking', 'Waterproof'],
    inStock: true,
    freeShipping: true,
    warranty: '1 Year'
  },
  {
    id: 103,
    title: 'Premium Coffee Maker',
    price: 12500,
    originalPrice: 16000,
    image: 'https://images.pexels.com/photos/4252137/pexels-photo-4252137.jpeg?auto=compress&cs=tinysrgb&w=400',
    brand: 'BrewMaster',
    rating: 4.9,
    reviews: 67,
    category: 'Kitchen',
    features: ['Programmable', 'Auto Shut-off', 'Glass Carafe'],
    inStock: true,
    freeShipping: false,
    warranty: '3 Years'
  },
  {
    id: 104,
    title: 'Ergonomic Office Chair',
    price: 18500,
    originalPrice: 25000,
    image: 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=400',
    brand: 'ComfortSeating',
    rating: 4.7,
    reviews: 156,
    category: 'Furniture',
    features: ['Lumbar Support', 'Adjustable Height', 'Breathable Mesh'],
    inStock: true,
    freeShipping: true,
    warranty: '5 Years'
  },
  {
    id: 105,
    title: 'LED Desk Lamp with USB Charging',
    price: 3200,
    originalPrice: 4500,
    image: 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=400',
    brand: 'BrightLight',
    rating: 4.5,
    reviews: 203,
    category: 'Furniture',
    features: ['Touch Control', 'USB Charging Port', 'Adjustable Brightness'],
    inStock: true,
    freeShipping: true,
    warranty: '2 Years'
  },
  {
    id: 106,
    title: 'Portable Bluetooth Speaker',
    price: 2800,
    originalPrice: 4000,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
    brand: 'SoundWave',
    rating: 4.4,
    reviews: 178,
    category: 'Electronics',
    features: ['Waterproof', '12hr Battery', 'Deep Bass'],
    inStock: true,
    freeShipping: true,
    warranty: '1 Year'
  }
];

export default function NewProductsSection() {
  const [likedItems, setLikedItems] = useState<number[]>([]);

  const toggleLike = (id: number) => {
    setLikedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const calculateSavings = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-6">
            <Award className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            New Products Store
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover brand new products at competitive prices with full warranty and customer support
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span>Warranty Included</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-500" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-500" />
              <span>Quality Guaranteed</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {newProducts.map((product) => {
            const savings = calculateSavings(product.originalPrice, product.price);
            
            return (
              <Link key={product.id} href={`/new-product/${product.id}`}>
                <Card className="group hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white cursor-pointer border-2 hover:border-blue-200">
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <Badge className="bg-green-500 text-white shadow-lg">
                        NEW
                      </Badge>
                      {savings > 0 && (
                        <Badge className="bg-red-500 text-white shadow-lg">
                          {savings}% OFF
                        </Badge>
                      )}
                      {product.freeShipping && (
                        <Badge className="bg-blue-500 text-white shadow-lg text-xs">
                          Free Shipping
                        </Badge>
                      )}
                    </div>
                    
                    {/* Like Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleLike(product.id);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-all shadow-lg"
                    >
                      <Heart 
                        className={`h-4 w-4 ${likedItems.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                      />
                    </button>

                    {/* Stock Status */}
                    <div className="absolute bottom-3 right-3">
                      <Badge variant={product.inStock ? 'default' : 'secondary'} className="shadow-lg">
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4 lg:p-6">
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                        <span className="text-sm font-medium text-gray-600">{product.brand}</span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                        {product.title}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{product.rating}</span>
                        <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {product.features.slice(0, 2).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {product.features.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{product.features.length - 2} more
                        </Badge>
                      )}
                    </div>

                    {/* Pricing */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl lg:text-2xl font-bold text-gray-900">
                          KSh {product.price.toLocaleString()}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            KSh {product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        Warranty: {product.warranty} | Free Returns
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700" 
                        size="sm"
                        disabled={!product.inStock}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button variant="outline" size="sm" className="px-3">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link href="/new-products">
            <Button size="lg" className="px-8 py-3 text-lg bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
              View All New Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}