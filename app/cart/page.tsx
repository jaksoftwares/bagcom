'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  CreditCard,
  MapPin,
  Clock,
  Star,
  ArrowLeft
} from 'lucide-react';
import Header from '@/components/Header';
import Link from 'next/link';

export default function Cart() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userRole, setUserRole] = useState<'admin' | 'seller' | 'buyer'>('buyer');
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: 'Study Desk with Ergonomic Chair',
      price: 8500,
      commission: 850,
      quantity: 1,
      image: 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=400',
      seller: 'John Kiprotich',
      sellerRating: 4.8,
      location: 'Hostels Block A, Room 204',
      condition: 'Good'
    },
    {
      id: 2,
      title: 'Gas Cylinder (13kg) with Burner',
      price: 4200,
      commission: 420,
      quantity: 1,
      image: 'https://images.pexels.com/photos/3964736/pexels-photo-3964736.jpeg?auto=compress&cs=tinysrgb&w=400',
      seller: 'Mary Wanjiku',
      sellerRating: 5.0,
      location: 'Off-campus, Kalimoni Estate',
      condition: 'Excellent'
    },
    {
      id: 3,
      title: 'Engineering Textbooks Collection',
      price: 3500,
      commission: 350,
      quantity: 1,
      image: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=400',
      seller: 'Peter Ochieng',
      sellerRating: 4.0,
      location: 'Library Area, Main Campus',
      condition: 'Fair'
    }
  ]);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalCommission = cartItems.reduce((sum, item) => sum + (item.commission * item.quantity), 0);
  const deliveryFee = 200;
  const total = subtotal + totalCommission + deliveryFee;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userRole={userRole} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <Link href="/products">
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-sm sm:text-base text-gray-600">{cartItems.length} items in your cart</p>
        </div>

        {cartItems.length === 0 ? (
          <Card className="text-center py-8 sm:py-12">
            <CardContent>
              <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Add some items to get started</p>
              <Link href="/products">
                <Button className="text-sm sm:text-base">Browse Products</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-3 sm:p-4 lg:p-6">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <div className="relative">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full sm:w-20 lg:w-24 h-24 sm:h-20 lg:h-24 object-cover rounded-lg"
                        />
                        <Badge className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-green-500 text-white text-xs">
                          {item.condition}
                        </Badge>
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col gap-3 sm:gap-4">
                          <div className="flex-1">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                              {item.title}
                            </h3>
                            
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                              <span className="text-xs sm:text-sm text-gray-600 truncate">{item.location}</span>
                            </div>

                            <div className="flex items-center gap-2 mb-2 sm:mb-3">
                              <span className="text-xs sm:text-sm font-medium text-gray-700">
                                by {item.seller}
                              </span>
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span className="text-xs text-gray-600">{item.sellerRating}</span>
                              </div>
                            </div>

                            <div className="mb-3">
                              <div className="text-base sm:text-lg font-bold text-gray-900">
                                KSh {(item.price + item.commission).toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-500">
                                Seller gets: KSh {item.price.toLocaleString()} | Commission: KSh {item.commission.toLocaleString()}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-row items-center justify-between gap-3 sm:gap-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center border rounded-lg">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                              >
                                <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                className="w-12 sm:w-16 h-7 sm:h-8 text-center border-0 focus:ring-0 text-sm"
                                min="1"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                              >
                                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </div>

                            {/* Remove Button */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs sm:text-sm px-2 sm:px-3"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              <span className="hidden sm:inline">Remove</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20 sm:top-24">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">KSh {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Platform Commission</span>
                      <span className="font-medium">KSh {totalCommission.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="font-medium">KSh {deliveryFee.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-base sm:text-lg font-bold">
                      <span>Total</span>
                      <span>KSh {total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4">
                    <Button className="w-full text-sm sm:text-base py-2.5 sm:py-3" size="lg">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Proceed to Checkout
                    </Button>
                    
                    <div className="text-center">
                      <Link href="/products">
                        <Button variant="outline" className="w-full text-sm sm:text-base py-2.5">
                          Continue Shopping
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="pt-3 sm:pt-4 border-t">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Estimated delivery: 1-2 days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}