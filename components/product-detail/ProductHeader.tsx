'use client';

import { Star, Clock, Eye, Heart, Share2, Flag } from 'lucide-react';
import Link from 'next/link';

interface ProductHeaderProps {
  product: any;
  viewCount?: number;
  favoriteCount?: number;
}

export default function ProductHeader({ product, viewCount, favoriteCount }: ProductHeaderProps) {
  const discountPercent = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Meta Area */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm">
            {product.category?.name || 'Category'}
          </Badge>
          <div className="flex items-center gap-1.5 text-muted-foreground/60">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Listed {new Date(product.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/contact?topic=Reporting Fraud&product_id=${product.id}`}>
            <button className="p-2 text-muted-foreground/20 hover:text-rose-500 transition-all group" title="Report Listing">
              <Flag className="h-4 w-4" />
            </button>
          </Link>
          <button className="p-2 text-muted-foreground/40 hover:text-primary transition-all">
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Title & Reviews */}
      <div className="space-y-3">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-tight">
          {product.title}
        </h1>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`h-3 w-3 ${s <= 4 ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
              ))}
            </div>
            <span className="text-[11px] font-bold text-foreground ml-1">4.8</span>
            <span className="text-[11px] font-semibold text-muted-foreground/60 ml-1">(42 Reviews)</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
            <div className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              <span>{viewCount || 0} views</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5" />
              <span>{favoriteCount || 0} saves</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Area */}
      <div className="py-8 border-y border-border/20 flex flex-col gap-2">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-foreground tracking-tight">
            KSh {product.price.toLocaleString()}
          </span>
          {product.original_price && (
            <div className="flex items-center gap-2">
              <span className="text-lg text-muted-foreground/40 line-through font-medium">
                KSh {product.original_price.toLocaleString()}
              </span>
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-bold rounded-sm px-2">
                -{discountPercent}%
              </Badge>
            </div>
          )}
        </div>
        <p className="text-[11px] font-semibold text-muted-foreground">Prices are inclusive of all marketplace fees.</p>
      </div>

      {/* Item Details Highlight */}
      <div className="grid grid-cols-2 gap-4">
         <div className="p-4 bg-muted/5 border border-border/40 rounded-md">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Condition</p>
            <p className="text-sm font-bold text-foreground uppercase tracking-tight">{product.condition || 'Good'}</p>
         </div>
         <div className="p-4 bg-muted/5 border border-border/40 rounded-md">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Availability</p>
            <p className="text-sm font-bold text-foreground uppercase tracking-tight">{product.is_available ? 'In Stock' : 'Sold'}</p>
         </div>
      </div>
    </div>
  );
}
