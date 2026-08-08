'use client';

import { useState, useEffect } from 'react';
import { Product, getProducts } from '@/services/products/productService';
import Image from 'next/image';
import { Check, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { useToast } from '@/hooks/use-toast';

interface FrequentlyBoughtTogetherProps {
  currentProduct: Product;
}

export default function FrequentlyBoughtTogether({ currentProduct }: FrequentlyBoughtTogetherProps) {
  const [bundleProducts, setBundleProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set([currentProduct.id]));
  
  const addToCart = useCartStore(state => state.addToCart);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchBundle() {
      if (!currentProduct.category_id) {
         setLoading(false);
         return;
      }
      try {
        const related = await getProducts({ category_id: currentProduct.category_id, limit: 3 });
        const filtered = related.filter(p => p.id !== currentProduct.id).slice(0, 2); // get 2 additional items
        
        setBundleProducts([currentProduct, ...filtered]);
        
        // Auto-select all by default
        const ids = new Set([currentProduct.id, ...filtered.map(f => f.id)]);
        setSelectedIds(ids);
      } catch (error) {
        console.error('Failed to fetch bundle:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBundle();
  }, [currentProduct]);

  if (loading || bundleProducts.length <= 1) return null;

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectedProducts = bundleProducts.filter(p => selectedIds.has(p.id));
  const totalPrice = selectedProducts.reduce((sum, p) => sum + p.price, 0);
  const originalPrice = selectedProducts.reduce((sum, p) => sum + (p.original_price || p.price), 0);
  const saved = originalPrice - totalPrice;

  const handleAddAllToCart = () => {
    if (selectedProducts.length === 0) return;
    
    selectedProducts.forEach(p => {
       addToCart({
          id: p.id,
          name: p.title,
          price: p.price,
          image: p.images?.[0]?.image_url || p.image || '/placeholder-product.jpg',
          seller: p.seller?.first_name || 'Seller',
          category: p.category?.name || 'Category'
       });
    });

    toast({
      title: `Added ${selectedProducts.length} items to cart`,
      description: "Bundle successfully added to your shopping cart."
    });
  };

  return (
    <div className="mt-8 p-6 bg-muted/10 border border-border/40 rounded-2xl">
      <h3 className="text-lg font-bold text-foreground mb-6">Frequently Bought Together</h3>
      
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {bundleProducts.map((p, idx) => {
           const image = p.images?.[0]?.image_url || p.image || '/placeholder-product.jpg';
           const isSelected = selectedIds.has(p.id);
           return (
             <div key={p.id} className="flex items-center gap-4">
                <div 
                   onClick={() => toggleSelection(p.id)}
                   className={`relative h-24 w-24 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? 'border-primary shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                   <Image src={image} alt={p.title} fill className="object-cover rounded-xl" />
                   {isSelected && (
                      <div className="absolute -top-2 -right-2 h-6 w-6 bg-primary text-white rounded-full flex items-center justify-center shadow-sm">
                         <Check className="h-3.5 w-3.5 font-bold" />
                      </div>
                   )}
                </div>
                
                {idx < bundleProducts.length - 1 && (
                   <Plus className="h-5 w-5 text-muted-foreground/50 mx-2" />
                )}
             </div>
           );
        })}
      </div>

      <div className="space-y-4">
         {bundleProducts.map(p => (
            <label key={p.id} className="flex items-start gap-3 cursor-pointer group">
               <input 
                 type="checkbox" 
                 checked={selectedIds.has(p.id)}
                 onChange={() => toggleSelection(p.id)}
                 className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
               />
               <div className="flex-1">
                  <span className={`text-sm font-semibold transition-colors ${p.id === currentProduct.id ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                     {p.id === currentProduct.id ? <strong>This item:</strong> : null} {p.title}
                  </span>
                  <div className="text-sm font-bold mt-0.5">
                     KSh {p.price.toLocaleString()}
                  </div>
               </div>
            </label>
         ))}
      </div>

      <div className="mt-6 pt-6 border-t border-border/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div>
            <div className="text-sm font-semibold text-muted-foreground mb-1">Total price:</div>
            <div className="flex items-baseline gap-2">
               <span className="text-2xl font-black text-foreground">KSh {totalPrice.toLocaleString()}</span>
               {saved > 0 && <span className="text-sm font-bold text-rose-500 line-through">KSh {originalPrice.toLocaleString()}</span>}
            </div>
            {saved > 0 && <div className="text-xs font-bold text-emerald-600 mt-1">You save KSh {saved.toLocaleString()}</div>}
         </div>
         <Button 
            onClick={handleAddAllToCart}
            disabled={selectedProducts.length === 0}
            className="h-12 px-8 bg-primary text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
         >
            Add {selectedProducts.length > 1 ? 'all' : ''} to Cart
         </Button>
      </div>
    </div>
  );
}
