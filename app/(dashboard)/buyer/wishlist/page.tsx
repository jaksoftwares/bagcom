'use client';

import { Heart, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Mock data for initial UI
const savedItems = [
  {
    id: 1,
    name: "MacBook Pro M2 2023",
    price: 185000,
    category: "Electronics",
    image: "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400",
    status: "In Stock"
  },
  {
    id: 2,
    name: "Ergonomic Office Chair",
    price: 12500,
    category: "Furniture",
    image: "https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=400",
    status: "Price Dropped"
  }
];

export default function WishlistPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Saved Items</h1>
          <p className="text-muted-foreground font-medium">Keep track of products you are interested in.</p>
        </div>
        <div className="bg-primary/5 px-4 py-2 rounded-full">
           <span className="text-primary font-bold text-sm">{savedItems.length} items saved</span>
        </div>
      </div>

      {savedItems.length > 0 ? (
        <div className="grid gap-4">
          {savedItems.map((item) => (
            <div key={item.id} className="group flex items-center gap-6 p-4 rounded-2xl border border-border/40 hover:border-primary/20 hover:bg-primary/5 transition-all">
              <div className="h-24 w-24 rounded-xl overflow-hidden flex-shrink-0 border border-border/20">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">{item.category}</span>
                  {item.status === 'Price Dropped' && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[9px] font-black uppercase rounded-full">Price Drop</span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-foreground truncate">{item.name}</h3>
                <p className="text-xl font-bold text-primary mt-1">KSh {item.price.toLocaleString()}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-xl">
                  <Trash2 className="h-5 w-5" />
                </Button>
                <Button className="rounded-xl font-bold gap-2 shadow-subtle px-6">
                  View Product <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-6">
          <div className="h-20 w-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto">
            <Heart className="h-10 w-10 text-muted-foreground/40" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">Your wishlist is empty</h3>
            <p className="text-muted-foreground font-medium max-w-xs mx-auto">
              Save items you like and we'll notify you when the price drops or they are almost gone.
            </p>
          </div>
          <Button asChild className="rounded-xl px-8 font-bold">
            <Link href="/products">Explore Marketplace</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
