'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Grid, List, ChevronRight } from 'lucide-react';
import Header from '@/components/navigation/Header';
import Footer from '@/components/navigation/Footer';
import Link from 'next/link';
import { getCategories } from '@/services/products/productService';

// Category images mapping - Product-focused realistic visuals
const categoryImages: Record<string, string> = {
  'furniture': 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=600',
  'electronics': 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600',
  'kitchen': 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=600',
  'clothing': 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=600',
  'books': 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=600',
  'sports': 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=600',
  'transport': 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=600',
  'personal-care': 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=600',
  'hobbies': 'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=600',
  'jobs': 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=600'
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    async function loadCategories() {
      const data = await getCategories();
      setCategories(data);
      setIsLoading(false);
    }
    loadCategories();
  }, []);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Header isLoggedIn={false} setIsLoggedIn={() => {}} />
      
      <main className="container mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumbs - Functional & Subtle */}
        <nav className="flex items-center gap-1.5 text-[12px] text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-900 font-medium">All Categories</span>
        </nav>

        {/* Page Title & Search - Commerce Layout */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-gray-200 pb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Marketplace Categories</h1>
            <p className="text-sm text-gray-500 mt-1">Browse all available item categories on Bagcom.</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Find a category..." 
                  className="h-10 pl-9 pr-4 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary w-64 transition-all"
                />
             </div>
             <div className="h-8 w-px bg-gray-200 mx-1 hidden md:block"></div>
             <div className="flex bg-gray-100 p-1 rounded-md border border-gray-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`h-8 w-8 flex items-center justify-center rounded transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`h-8 w-8 flex items-center justify-center rounded transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                >
                  <List className="h-4 w-4" />
                </button>
             </div>
          </div>
        </div>

        {/* Categories Grid - Functional, Restrained Cards */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-200 animate-pulse rounded-md" />
            ))}
          </div>
        ) : (
          <div className={`grid gap-5 ${
            viewMode === 'grid' 
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
              : 'grid-cols-1'
          }`}>
            {categories.map((category) => (
              <Link key={category.id} href={`/products?category=${category.id}`}>
                <Card className={`group bg-white border border-gray-200 hover:border-gray-300 transition-all shadow-none hover:shadow-sm rounded-lg overflow-hidden h-full ${viewMode === 'list' ? 'flex items-center gap-6 p-4' : ''}`}>
                  <div className={`${viewMode === 'list' ? 'h-24 w-32 shrink-0' : 'aspect-[4/3]'} overflow-hidden bg-gray-100`}>
                    <img 
                      src={categoryImages[category.slug] || categoryImages['electronics']} 
                      alt={category.name}
                      className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                  
                  <CardContent className={`${viewMode === 'list' ? 'p-0 flex-1' : 'p-4'}`}>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary transition-colors leading-tight">
                        {category.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] text-gray-500">
                          {category.subcategories?.length || 0} subcategories
                        </span>
                        <div className="h-1 w-1 rounded-full bg-gray-300"></div>
                        <span className="text-[12px] text-primary font-medium">Browse All</span>
                      </div>
                    </div>
                    
                    {category.subcategories?.length > 0 && viewMode === 'grid' && (
                      <div className="mt-3 flex flex-wrap gap-1.5 pt-3 border-t border-gray-100">
                        {category.subcategories.slice(0, 3).map((sub: any) => (
                          <span key={sub.id} className="text-[11px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded transition-colors hover:bg-gray-200">
                            {sub.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Secondary Marketplace Actions - Subdued & Practical */}
        <div className="mt-16 bg-white border border-gray-200 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="max-w-lg">
              <h2 className="text-xl font-semibold text-gray-900">Can't find a specific category?</h2>
              <p className="text-sm text-gray-500 mt-1">
                Our marketplace is constantly growing. If you have an item that doesn't fit, contact our support team or suggest a new category.
              </p>
           </div>
           <div className="flex items-center gap-4 shrink-0">
              <Button variant="outline" className="text-sm font-medium border-gray-300 rounded-md h-10 px-6">
                Suggest Category
              </Button>
              <Button className="text-sm font-medium rounded-md h-10 px-6">
                Contact Support
              </Button>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
