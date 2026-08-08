'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProductGalleryProps {
  images: any[];
  title: string;
  condition?: string;
  discount?: number;
}

export default function ProductGallery({ images, title, condition, discount }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierStyle, setMagnifierStyle] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  const displayImages = images?.length > 0 ? images.map(img => img.image_url) : ['/placeholder-product.jpg'];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    
    // Calculate relative coordinates (percentage)
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setMagnifierStyle({ x, y });
  };

  return (
    <div className="space-y-4">
      {/* Main Hero Image */}
      <div 
        className="relative aspect-[4/5] md:aspect-square bg-muted/10 rounded-2xl overflow-hidden cursor-crosshair border border-border/40 group"
        onMouseEnter={() => setShowMagnifier(true)}
        onMouseLeave={() => setShowMagnifier(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          ref={imageRef}
          src={displayImages[activeIndex]}
          alt={title}
          fill
          className={`object-cover transition-opacity duration-300 ${showMagnifier ? 'opacity-0' : 'opacity-100'}`}
          priority
        />
        
        {/* Zoomed Background overlay for magnifier */}
        {showMagnifier && (
           <div 
             className="absolute inset-0 bg-no-repeat z-10 pointer-events-none"
             style={{
               backgroundImage: `url(${displayImages[activeIndex]})`,
               backgroundPosition: `${magnifierStyle.x}% ${magnifierStyle.y}%`,
               backgroundSize: '200%',
             }}
           />
        )}
        
        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
              }}
              className="h-10 w-10 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:text-primary hover:scale-105 transition-all text-foreground"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((prev) => (prev + 1) % displayImages.length);
              }}
              className="h-10 w-10 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:text-primary hover:scale-105 transition-all text-foreground"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Badge Overlays */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
          {discount && discount > 0 && (
            <Badge className="bg-rose-500 text-white border-none px-3 py-1.5 rounded-md font-black text-xs shadow-lg">
              -{discount}% OFF
            </Badge>
          )}
          {condition && (
            <Badge variant="secondary" className="bg-white/90 backdrop-blur text-foreground border-none px-3 py-1.5 rounded-md font-bold text-[10px] uppercase tracking-widest shadow-sm">
              {condition}
            </Badge>
          )}
        </div>

        {/* Zoom Indicator */}
        <div className="absolute bottom-4 right-4 p-2.5 bg-white/60 backdrop-blur-md rounded-full text-foreground/80 shadow-sm z-20 pointer-events-none">
          <Maximize2 className="h-4 w-4" />
        </div>
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide pt-2">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                idx === activeIndex 
                  ? 'border-primary ring-2 ring-primary/20 ring-offset-1' 
                  : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
              }`}
            >
              <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
