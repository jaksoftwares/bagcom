'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { categories } from '@/lib/categories';

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
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                <CardContent className="p-4 sm:p-5 lg:p-6">
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className={`p-2 sm:p-3 rounded-lg ${category.color}`}>
                      <div className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
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