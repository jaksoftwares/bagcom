'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Grid, 
  List,
  Heart,
  MapPin,
  Clock,
  Star,
  Eye,
  MessageCircle,
  ArrowLeft
} from 'lucide-react';
import Header from '@/components/Header';
import Link from 'next/link';
import { getCategory } from '@/lib/categories';
import { getProductsByCategory } from '@/lib/products';

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;
  const category = getCategory(categoryId);
  const products = getProductsByCategory(categoryId);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'seller' | 'buyer'>('buyer');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [likedItems, setLikedItems] = useState<number[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');

  const toggleLike = (id: number) => {
    setLikedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userRole={userRole} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
            <p className="text-gray-600 mb-6">The category you're looking for doesn't exist.</p>
            <Link href="/products">
              <Button>Browse All Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredProducts = selectedSubcategory === 'all' 
    ? products 
    : products.filter(product => product.subcategory === selectedSubcategory);

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
                All Products
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-lg ${category.color}`}>
              <div className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{category.name}</h1>
              <p className="text-gray-600">{category.description}</p>
            </div>
          </div>
          
          <p className="text-gray-600">{filteredProducts.length} items available</p>
        </div>

        {/* Subcategory Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedSubcategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSubcategory('all')}
            >
              All ({products.length})
            </Button>
            {category.subcategories.map((subcategory) => {
              const count = products.filter(p => p.subcategory === subcategory.id).length;
              return (
                <Button
                  key={subcategory.id}
                  variant={selectedSubcategory === subcategory.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSubcategory(subcategory.id)}
                >
                  {subcategory.name} ({count})
                </Button>
              );
            })}
          </div>
        </div>

        {/* Search and View Toggle */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            <div className="flex-1 relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search in this category..."
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">
              {selectedSubcategory === 'all' 
                ? `No products available in ${category.name} category yet.`
                : `No products found in the selected subcategory.`
              }
            </p>
            <Button onClick={() => setSelectedSubcategory('all')}>
              View All in {category.name}
            </Button>
          </div>
        ) : (
          <div className={`grid gap-4 lg:gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden bg-white cursor-pointer">
                  <div className="relative">
                    <img 
                      src={product.images[0]} 
                      alt={product.title}
                      className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                        viewMode === 'grid' ? 'h-40 sm:h-48' : 'h-32 sm:h-40'
                      }`}
                    />
                    
                    <Badge className="absolute top-2 left-2 bg-green-500 text-white shadow-lg">
                      {product.condition}
                    </Badge>
                    
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleLike(product.id);
                      }}
                      className="absolute top-2 right-2 p-2 rounded-full bg-white/90 hover:bg-white transition-all shadow-lg"
                    >
                      <Heart 
                        className={`h-4 w-4 ${likedItems.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                      />
                    </button>

                    <div className="absolute bottom-2 right-2 flex items-center space-x-1 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                      <Eye className="h-3 w-3" />
                      <span>{product.views}</span>
                    </div>
                  </div>

                  <CardContent className="p-3 lg:p-4">
                    <div className={`${viewMode === 'list' ? 'flex items-start gap-4' : ''}`}>
                      <div className="flex-1">
                        <h3 className="text-base lg:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                          {product.title}
                        </h3>

                        {viewMode === 'list' && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {product.description}
                          </p>
                        )}

                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <span className="text-sm text-gray-600 truncate">{product.location.area}</span>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{product.timePosted}</span>
                        </div>

                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg lg:text-xl font-bold text-gray-900">
                              KSh {(product.price + product.commission).toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              KSh {product.originalPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700 truncate">
                              {product.seller.name}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span className="text-xs text-gray-600">{product.seller.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {product.likes + (likedItems.includes(product.id) ? 1 : 0)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className={`${viewMode === 'list' ? 'flex flex-col gap-2 min-w-[120px]' : 'flex flex-col sm:flex-row gap-2'}`}>
                        <Button className="flex-1" size="sm">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}