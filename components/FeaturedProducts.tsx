'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Clock, Star, Eye, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const featuredProducts = [
  {
    id: 1,
    title: 'Study Desk with Ergonomic Chair',
    price: 8500,
    originalPrice: 12000,
    commission: 850,
    image: 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=400',
    seller: 'John Kiprotich',
    sellerRating: 4.8,
    location: 'Hostels Block A, Room 204',
    category: 'Furniture',
    condition: 'Good',
    timePosted: '2 hours ago',
    likes: 12,
    views: 156,
    description: 'Perfect study setup for engineering students. Includes adjustable chair and spacious desk.',
    features: ['Adjustable height', 'Storage drawers', 'Cable management']
  },
  {
    id: 2,
    title: 'Gas Cylinder (13kg) with Burner',
    price: 4200,
    originalPrice: 5500,
    commission: 420,
    image: 'https://images.pexels.com/photos/3964736/pexels-photo-3964736.jpeg?auto=compress&cs=tinysrgb&w=400',
    seller: 'Mary Wanjiku',
    sellerRating: 5.0,
    location: 'Off-campus, Kalimoni Estate',
    category: 'Kitchen',
    condition: 'Excellent',
    timePosted: '5 hours ago',
    likes: 8,
    views: 89,
    description: 'Full gas cylinder with 2-burner gas cooker. Perfect for student cooking needs.',
    features: ['Full gas', '2-burner cooker', 'Safety certified']
  },
  {
    id: 3,
    title: 'MacBook Pro 2020 (M1 Chip)',
    price: 85000,
    originalPrice: 120000,
    commission: 8500,
    image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=400',
    seller: 'David Mwangi',
    sellerRating: 4.8,
    location: 'Main Campus, Engineering Block',
    category: 'Electronics',
    condition: 'Very Good',
    timePosted: '1 day ago',
    likes: 25,
    views: 342,
    description: 'Powerful laptop perfect for programming and design work. Includes original charger and box.',
    features: ['M1 Chip', '8GB RAM', '256GB SSD', 'Original accessories']
  },
  {
    id: 4,
    title: 'Queen Size Bed with Mattress',
    price: 15000,
    originalPrice: 25000,
    commission: 1500,
    image: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=400',
    seller: 'Grace Akinyi',
    sellerRating: 4.3,
    location: 'Juja Town, Opposite Gate C',
    category: 'Furniture',
    condition: 'Good',
    timePosted: '3 days ago',
    likes: 18,
    views: 203,
    description: 'Comfortable queen size bed with quality mattress. Perfect for student accommodation.',
    features: ['Queen size', 'Firm mattress', 'Wooden frame', 'Storage space']
  },
  {
    id: 5,
    title: 'Engineering Textbooks Collection',
    price: 3500,
    originalPrice: 8000,
    commission: 350,
    image: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=400',
    seller: 'Peter Ochieng',
    sellerRating: 4.0,
    location: 'Library Area, Main Campus',
    category: 'Books',
    condition: 'Fair',
    timePosted: '1 week ago',
    likes: 7,
    views: 78,
    description: 'Complete set of engineering textbooks for 2nd and 3rd year students.',
    features: ['15 textbooks', 'Engineering subjects', 'Good condition', 'Notes included']
  },
  {
    id: 6,
    title: 'Samsung Microwave Oven (23L)',
    price: 6800,
    originalPrice: 12000,
    commission: 680,
    image: 'https://images.pexels.com/photos/4252137/pexels-photo-4252137.jpeg?auto=compress&cs=tinysrgb&w=400',
    seller: 'Sarah Muthoni',
    sellerRating: 4.7,
    location: 'Hostels Block C, Room 156',
    category: 'Kitchen',
    condition: 'Excellent',
    timePosted: '4 days ago',
    likes: 15,
    views: 134,
    description: 'Barely used microwave oven with all original accessories and manual.',
    features: ['23L capacity', 'Digital display', 'Auto cook menus', 'Child lock']
  }
];

export default function FeaturedProducts() {
  const [likedItems, setLikedItems] = useState<number[]>([]);

  const toggleLike = (id: number) => {
    setLikedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Featured Products
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-xl sm:max-w-2xl mx-auto px-4 sm:px-0">
            Discover the best deals from our top-rated sellers. Find quality second-hand items at great prices, perfect for students and budget-conscious shoppers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden bg-white cursor-pointer">
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-40 sm:h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Condition Badge */}
                  <Badge className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-green-500 text-white shadow-lg text-xs">
                    {product.condition}
                  </Badge>
                  
                  {/* Like Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleLike(product.id);
                    }}
                    className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 rounded-full bg-white/90 hover:bg-white transition-all shadow-lg"
                  >
                    <Heart 
                      className={`h-3 w-3 sm:h-4 sm:w-4 ${likedItems.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                    />
                  </button>

                  {/* Category Badge */}
                  <Badge variant="secondary" className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 shadow-lg text-xs">
                    {product.category}
                  </Badge>

                  {/* Views Counter */}
                  <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 flex items-center space-x-1 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                    <Eye className="h-3 w-3" />
                    <span>{product.views}</span>
                  </div>
                </div>

                <CardContent className="p-3 sm:p-4 lg:p-5">
                  <div className="mb-3">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1 sm:mb-2">
                      {product.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
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

                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-600 truncate">{product.location}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-600">{product.timePosted}</span>
                  </div>

                  <div className="mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                        KSh {(product.price + product.commission).toLocaleString()}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500 line-through">
                        KSh {product.originalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Seller gets: KSh {product.price.toLocaleString()} | Commission: KSh {product.commission.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">
                        {product.seller}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-gray-600">{product.sellerRating}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 text-xs sm:text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {product.likes + (likedItems.includes(product.id) ? 1 : 0)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button className="flex-1 text-xs sm:text-sm py-2" size="sm">
                      Add to Cart
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm py-2">
                      <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-10 lg:mt-12">
          <Link href="/products">
            <Button size="lg" variant="outline" className="px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}