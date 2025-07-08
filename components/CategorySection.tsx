'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
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

export default function CategorySection() {
  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Shop by Category
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-xl sm:max-w-2xl mx-auto px-4 sm:px-0">
            Find exactly what you need from our organized categories
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/category/${category.id}`}>
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer h-full overflow-hidden">
                <div className="relative">
                  <img 
                    src={categoryImages[category.id as keyof typeof categoryImages]} 
                    alt={category.name}
                    className="w-full h-32 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                  <div className="absolute top-3 right-3">
                    <ArrowRight className="h-5 w-5 text-white group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <div className={`p-2 rounded-lg ${category.color} bg-opacity-90`}>
                      <div className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-4 sm:p-5">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  
                  <p className="text-sm sm:text-base text-gray-600 mb-3 line-clamp-2">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-gray-500">
                      {category.subcategories.length} subcategories
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-blue-600 group-hover:text-blue-700">
                      Explore →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}