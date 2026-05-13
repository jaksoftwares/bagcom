'use client';

import { useState } from 'react';
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
  const [isZoomed, setIsZoomed] = useState(false);

  const displayImages = images?.length > 0 ? images.map(img => img.image_url) : ['/placeholder-product.jpg'];

  return (
    <div className="space-y-4">
      {/* Main Hero Image */}
      <div className="relative aspect-square bg-muted/20 rounded-md overflow-hidden border border-border/40 group cursor-crosshair">
        <Image
          src={displayImages[activeIndex]}
          alt={title}
          fill
          className={`object-cover transition-transform duration-500 ${isZoomed ? 'scale-150' : 'group-hover:scale-105'}`}
          onMouseMove={(e) => {
            if (isZoomed) {
              const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
              const x = ((e.pageX - left) / width) * 100;
              const y = ((e.pageY - top) / height) * 100;
              e.currentTarget.style.transformOrigin = `${x}% ${y}%`;
            }
          }}
          onClick={() => setIsZoomed(!isZoomed)}
          priority
        />
        
        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
              }}
              className="p-2 bg-white/90 backdrop-blur-md rounded-md shadow-md hover:text-primary transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((prev) => (prev + 1) % displayImages.length);
              }}
              className="p-2 bg-white/90 backdrop-blur-md rounded-md shadow-md hover:text-primary transition-all"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Badge Overlays */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {discount && discount > 0 && (
            <Badge className="bg-rose-500 text-white border-none px-2 py-1 rounded-sm font-bold text-[10px] shadow-lg">
              -{discount}% OFF
            </Badge>
          )}
          {condition && (
            <Badge variant="secondary" className="bg-white/90 text-foreground border-none px-2 py-1 rounded-sm font-bold text-[9px] uppercase tracking-widest shadow-sm">
              {condition}
            </Badge>
          )}
        </div>

        {/* Zoom Indicator */}
        <div className="absolute bottom-4 right-4 p-2 bg-white/60 backdrop-blur-md rounded-md text-muted-foreground/60 shadow-sm">
          <Maximize2 className="h-4 w-4" />
        </div>
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                idx === activeIndex ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
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
