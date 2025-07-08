'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Search, Grid, List } from 'lucide-react';
import Header from '@/components/Header';
import Link from 'next/link';
import { categories } from '@/lib/categories';

// Category images mapping
const categoryImages = {
  'furniture': 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=600',
  'electronics': 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=600',
  'kitchen': 'https://images.pexels.com/photos/4252137/pexels-photo-4252137.jpeg?auto=compress&cs=tinysrgb&w=600',
  'clothing': 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=600',
  'books': 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=600',
  'sports': 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=600',
  'transport': 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=600',
  'personal-care': 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=600'
};

export default function CategoriesPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'seller' | 'buyer'>('buyer');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userRole={userRole} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">All Categories</h1>
          <p className="text-lg text-gray-600 mb-6">
            Browse through our comprehensive collection of product categories
          </p>
          
          {/* View Toggle */}
          <div className="flex justify-end">
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

        {/* Categories Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {categories.map((category) => (
            <Link key={category.id} href={`/category/${category.id}`}>
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer h-full overflow-hidden">
                <div className="relative">
                  <img 
                    src={categoryImages[category.id as keyof typeof categoryImages]} 
                    alt={category.name}
                    className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                      viewMode === 'grid' ? 'h-40 sm:h-48' : 'h-32'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute top-3 right-3">
                    <ArrowRight className="h-5 w-5 text-white group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <Badge className="bg-white/90 text-gray-900">
                      {category.subcategories.length} subcategories
                    </Badge>
                  </div>
                </div>
                
                <CardContent className={`${viewMode === 'list' ? 'flex items-center gap-6' : ''} p-4 sm:p-6`}>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {category.description}
                    </p>
                    
                    {viewMode === 'list' && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Subcategories:</h4>
                        <div className="flex flex-wrap gap-1">
                          {category.subcategories.slice(0, 4).map((sub) => (
                            <Badge key={sub.id} variant="outline" className="text-xs">
                              {sub.name}
                            </Badge>
                          ))}
                          {category.subcategories.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{category.subcategories.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <Button className="w-full group-hover:bg-blue-600 transition-colors">
                      <Search className="h-4 w-4 mr-2" />
                      Browse {category.name}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Popular Categories Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.slice(0, 4).map((category) => (
              <Link key={category.id} href={`/category/${category.id}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-lg ${category.color} flex items-center justify-center`}>
                      <div className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}