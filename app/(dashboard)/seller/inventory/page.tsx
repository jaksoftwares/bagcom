'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Star,
  Loader2,
  Filter
} from 'lucide-react';
import SellerLayout from '@/components/layout/SellerLayout';
import { ProductFormDrawer } from '@/components/dashboard/seller/ProductFormDrawer';
import { getCurrentUser } from '@/services/auth/authService';

export default function SellerInventoryPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const fetchProducts = async (userId: string) => {
    try {
      const res = await fetch(`/api/products?sellerId=${userId}&sellerView=true`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      toast({ title: "Failed to load inventory", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      const currentUser = await getCurrentUser();
      if (!currentUser) return;
      setUser(currentUser);
      await fetchProducts(currentUser.id);
    }
    init();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
        toast({ title: "Product deleted successfully" });
      } else {
        throw new Error('Deletion failed');
      }
    } catch (error) {
      toast({ title: "Failed to delete product", variant: "destructive" });
    }
  };

  const openAddDrawer = () => {
    setEditingProduct(null);
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (product: any) => {
    setEditingProduct(product);
    setIsDrawerOpen(true);
  };

  if (isLoading) {
    return (
      <SellerLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Inventory Management</h1>
            <p className="text-gray-500 font-medium">Manage your listings, update prices, and track product visibility.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="font-bold">
              <Filter className="h-4 w-4 mr-2" /> Filter
            </Button>
            <Button onClick={openAddDrawer} className="font-bold shadow-md">
              <Plus className="h-4 w-4 mr-2" /> Add Listing
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900">No products listed yet</h3>
              <p className="text-gray-500 mt-1 mb-6">Create your first listing to start selling.</p>
              <Button onClick={openAddDrawer} className="font-bold">
                <Plus className="h-4 w-4 mr-2" /> Create First Listing
              </Button>
            </div>
          ) : (
            products.map((product) => (
              <Card key={product.id} className="border-gray-200/60 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="relative aspect-video bg-gray-100 shrink-0">
                    {product.images && product.images.length > 0 ? (
                      <img src={product.images[0].image_url} alt={product.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold uppercase text-xs">No Image</div>
                    )}
                    <Badge className="absolute top-3 right-3 bg-white/90 text-gray-900 border-none">{product.condition}</Badge>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{product.title}</h3>
                        <p className="text-lg font-black text-primary">KSh {Number(product.price).toLocaleString()}</p>
                      </div>
                      <Badge variant="outline" className={product.is_available ? 'border-green-200 text-green-700 bg-green-50' : 'border-gray-200 text-gray-500 bg-gray-50'}>
                        {product.is_available ? 'ACTIVE' : 'DRAFT/SOLD'}
                      </Badge>
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                      <div className="flex gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {product.view_count || 0}</span>
                        <span className="flex items-center gap-1"><Star className="h-3 w-3" /> {product.favorite_count || 0}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => openEditDrawer(product)} variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-primary">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => handleDelete(product.id)} variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <ProductFormDrawer 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          product={editingProduct} 
          sellerId={user?.id}
          onSuccess={() => fetchProducts(user?.id)}
        />
      </div>
    </SellerLayout>
  );
}
