'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, ShoppingBag, TrendingUp, Star, Users } from 'lucide-react';
import Link from 'next/link';

const slides = [
  {
    id: 1,
    title: 'Find Amazing Deals',
    subtitle: 'Second-Hand Marketplace',
    description: 'Discover quality pre-owned items at unbeatable prices from trusted sellers in your area.',
    image: 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=1200',
    cta: 'Browse Second-Hand',
    ctaLink: '/products',
    badge: '🔄 Pre-Owned',
    color: 'from-blue-600 to-purple-600'
  },
  {
    id: 2,
    title: 'Shop Brand New Products',
    subtitle: 'Quality & Affordable',
    description: 'Explore our curated collection of new products at competitive prices with warranty and support.',
    image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=1200',
    cta: 'Shop New Products',
    ctaLink: '/new-products',
    badge: '✨ Brand New',
    color: 'from-green-600 to-blue-600'
  },
  {
    id: 3,
    title: 'Sell Your Items',
    subtitle: 'Turn Clutter into Cash',
    description: 'List your items quickly and reach thousands of potential buyers in your local area.',
    image: 'https://images.pexels.com/photos/3964736/pexels-photo-3964736.jpeg?auto=compress&cs=tinysrgb&w=1200',
    cta: 'Start Selling',
    ctaLink: '/dashboard',
    badge: '💰 Earn Money',
    color: 'from-orange-600 to-red-600'
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === currentSlide ? 'translate-x-0' : 
            index < currentSlide ? '-translate-x-full' : 'translate-x-full'
          }`}
        >
          <div className={`relative h-full bg-gradient-to-br ${slide.color} overflow-hidden`}>
            {/* Background Image */}
            <div className="absolute inset-0 opacity-20">
              <img 
                src={slide.image} 
                alt={slide.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-20 right-10 w-40 h-40 bg-yellow-300 rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-green-300 rounded-full blur-2xl"></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl">
                  <Badge className="bg-white/20 text-white border-white/30 mb-4 text-sm px-4 py-2">
                    {slide.badge}
                  </Badge>
                  
                  <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  
                  <h2 className="text-xl sm:text-2xl lg:text-3xl text-white/90 mb-6 font-medium">
                    {slide.subtitle}
                  </h2>
                  
                  <p className="text-lg sm:text-xl text-white/80 mb-8 leading-relaxed">
                    {slide.description}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href={slide.ctaLink}>
                      <Button 
                        size="lg" 
                        className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg font-semibold shadow-lg w-full sm:w-auto"
                      >
                        <ShoppingBag className="h-5 w-5 mr-2" />
                        {slide.cta}
                      </Button>
                    </Link>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm px-8 py-3 text-lg font-semibold w-full sm:w-auto"
                    >
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Stats Overlay */}
      <div className="absolute bottom-6 right-6 hidden lg:flex space-x-6">
        <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
          <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full mb-2 mx-auto">
            <Users className="h-4 w-4 text-white" />
          </div>
          <div className="text-lg font-bold text-white">50K+</div>
          <div className="text-xs text-white/80">Active Users</div>
        </div>
        
        <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
          <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full mb-2 mx-auto">
            <Star className="h-4 w-4 text-white" />
          </div>
          <div className="text-lg font-bold text-white">4.8</div>
          <div className="text-xs text-white/80">Rating</div>
        </div>
      </div>
    </div>
  );
}