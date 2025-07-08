'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Star, 
  MapPin,
  ArrowLeft,
  Share2
} from 'lucide-react';
import Header from '@/components/Header';
import Link from 'next/link';

// Sample wishlist items
const wishlistItems = [
  {
    id: 1,
    title: 'Study Desk with Ergonomic Chair',
    price: 8500,
    originalPrice: 12000,
    commission: 850,
    image: 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=400',
    seller: 'John Kiprotich',
    sellerRating: 4.8,
    location: 'Nairobi County',
    condition: 'Good',
    category: 'Furniture',
    availability: 'Available',
    dateAdded: '2024-01-15'
  },
  {
    id: 2,
    title: 'MacBook Pro 2020 (M1 Chip)',
    price: 85000,
    originalPrice: 120000,
    commission: 8500,
    image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=400',
    seller: 'David Mwangi',
    sellerRating: 4.8,
    location: 'Kiambu County',
    condition: 'Very Good',
    category: 'Electronics',
    availability: 'Available',
    dateAdded: '2024-01-14'
  },
  {
    id: 3,
    title: 'Wireless Bluetooth Headphones',
    price: 4500,
    originalPrice: 6000,
    commission: 0,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
    seller: 'TechSound Store',
    sellerRating: 4.9,
    location: 'Nairobi County',
    condition: 'New',
    category: 'Electronics',
    availability: 'Available',
    dateAdded: '2024-01-13'
  }
];

export default function Wishlist() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userRole, setUserRole] = useState<'admin' | 'seller' | 'buyer'>('buyer');
  const [items, setItems] = useState(wishlistItems);

  const removeFromWishlist = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const addToCart = (id: number) => {
    // Add to cart logic here
    console.log('Added to cart:', id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userRole={userRole} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/products">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">{items.length} items saved for later</p>
        </div>

        {items.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600 mb-6">Save items you love to buy them later</p>
              <Link href="/products">
                <Button>Browse Products</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full sm:w-32 h-32 object-cover rounded-lg"
                      />
                      <Badge className="absolute top-2 left-2 bg-green-500 text-white text-xs">
                        {item.condition}
                      </Badge>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              Added {new Date(item.dateAdded).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <Link href={`/product/${item.id}`}>
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                              {item.title}
                            </h3>
                          </Link>

                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{item.location}</span>
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm font-medium text-gray-700">
                              by {item.seller}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span className="text-xs text-gray-600">{item.sellerRating}</span>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xl font-bold text-gray-900">
                                KSh {(item.price + item.commission).toLocaleString()}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                KSh {item.originalPrice.toLocaleString()}
                              </span>
                            </div>
                            {item.commission > 0 && (
                              <div className="text-xs text-gray-500">
                                Seller gets: KSh {item.price.toLocaleString()} | Commission: KSh {item.commission.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-row lg:flex-col gap-2 lg:min-w-[140px]">
                          <Button 
                            className="flex-1"
                            onClick={() => addToCart(item.id)}
                            disabled={item.availability !== 'Available'}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                          
                          <Button variant="outline" className="flex-1">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeFromWishlist(item.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>

                      {item.availability !== 'Available' && (
                        <div className="mt-3 p-2 bg-yellow-50 rounded-lg">
                          <span className="text-sm text-yellow-800">
                            This item is currently {item.availability.toLowerCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Wishlist Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <Button variant="outline" className="flex-1">
                Share Wishlist
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => setItems([])}
              >
                Clear All Items
              </Button>
              <Button className="flex-1">
                Add All to Cart
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}