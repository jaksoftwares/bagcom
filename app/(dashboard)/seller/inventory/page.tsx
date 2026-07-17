'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Star,
  Loader2,
  Search,
  LayoutGrid,
  List,
  Tag,
  Archive,
  DollarSign,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import SellerLayout from '@/components/layout/SellerLayout';
import { ProductFormDrawer } from '@/components/dashboard/seller/ProductFormDrawer';
import { getCurrentUser } from '@/services/auth/authService';

type ViewMode = 'list' | 'grid';
type StatusFilter = 'ALL' | 'ACTIVE' | 'DRAFT';

export default function SellerInventoryPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  // UI States
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

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
    if (!confirm('Are you sure you want to delete this product?')) return;
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

  // --- Derived State (Stats, Filtering, Pagination) ---
  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (statusFilter === 'ACTIVE') {
      filtered = filtered.filter(p => p.is_available);
    } else if (statusFilter === 'DRAFT') {
      filtered = filtered.filter(p => !p.is_available);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title?.toLowerCase().includes(query) || 
        p.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [products, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    const active = products.filter(p => p.is_available).length;
    const drafts = products.filter(p => !p.is_available).length;
    const totalValue = products.reduce((acc, p) => acc + (Number(p.price) || 0), 0);
    return { total: products.length, active, drafts, totalValue };
  }, [products]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

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
      <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
        
        {/* Header & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Inventory</h1>
            <p className="text-sm text-gray-500 font-medium mt-1">Manage your product catalog and visibility.</p>
          </div>
          <Button onClick={openAddDrawer} className="font-bold shadow-md h-11 px-6 bg-primary hover:bg-primary/90">
            <Plus className="h-5 w-5 mr-2" /> Add New Product
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white border-gray-100 shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-gray-100 shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                <Tag className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Active Listings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-gray-100 shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center shrink-0">
                <Archive className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Hidden / Drafts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.drafts}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-gray-100 shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Inventory Value</p>
                <p className="text-xl font-bold text-gray-900">KSh {stats.totalValue.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar: Search, Filter, View Toggle */}
        <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-2 sticky top-0 z-10">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search inventory by title or description..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-gray-50/50 border-transparent focus-visible:bg-white h-11 text-base md:text-sm"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto custom-scrollbar pb-1 md:pb-0">
            <div className="flex p-1 bg-gray-100 rounded-lg shrink-0">
              <button 
                onClick={() => setStatusFilter('ALL')}
                className={cn("px-4 py-1.5 rounded-md text-sm font-bold transition-colors", statusFilter === 'ALL' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700")}
              >
                All
              </button>
              <button 
                onClick={() => setStatusFilter('ACTIVE')}
                className={cn("px-4 py-1.5 rounded-md text-sm font-bold transition-colors", statusFilter === 'ACTIVE' ? "bg-white text-green-600 shadow-sm" : "text-gray-500 hover:text-gray-700")}
              >
                Active
              </button>
              <button 
                onClick={() => setStatusFilter('DRAFT')}
                className={cn("px-4 py-1.5 rounded-md text-sm font-bold transition-colors", statusFilter === 'DRAFT' ? "bg-white text-gray-600 shadow-sm" : "text-gray-500 hover:text-gray-700")}
              >
                Drafts
              </button>
            </div>

            <div className="w-px h-8 bg-gray-200 shrink-0 mx-1 hidden md:block" />

            <div className="flex p-1 bg-gray-100 rounded-lg shrink-0 hidden md:flex">
              <button 
                onClick={() => setViewMode('list')}
                className={cn("p-1.5 rounded-md transition-colors", viewMode === 'list' ? "bg-white text-primary shadow-sm" : "text-gray-400 hover:text-gray-700")}
                title="List View"
              >
                <List className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={cn("p-1.5 rounded-md transition-colors", viewMode === 'grid' ? "bg-white text-primary shadow-sm" : "text-gray-400 hover:text-gray-700")}
                title="Grid View"
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-2xl border border-dashed border-gray-200">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900">No products found</h3>
            <p className="text-gray-500 mt-2 mb-6 max-w-sm mx-auto">
              {searchQuery || statusFilter !== 'ALL' 
                ? "We couldn't find any products matching your current filters." 
                : "Create your first product to start selling on the marketplace."}
            </p>
            {searchQuery || statusFilter !== 'ALL' ? (
              <Button variant="outline" onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); }} className="font-bold">
                Clear Filters
              </Button>
            ) : (
              <Button onClick={openAddDrawer} className="font-bold h-11 px-6">
                <Plus className="h-5 w-5 mr-2" /> Add New Product
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* --- LIST VIEW --- */}
            {viewMode === 'list' && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4">Product</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Stats</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {paginatedProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                                {product.images?.[0] ? (
                                  <img src={product.images[0].image_url} alt={product.title} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                    <ImageIcon className="h-4 w-4" />
                                  </div>
                                )}
                              </div>
                              <div className="max-w-[200px] lg:max-w-[300px]">
                                <p className="font-bold text-gray-900 truncate">{product.title}</p>
                                <p className="text-xs text-gray-500 truncate">{product.category?.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {product.is_available ? (
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Active</Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-100 border-none">Draft</Badge>
                            )}
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-900">
                            KSh {Number(product.price).toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-3 text-gray-400 font-medium">
                              <span className="flex items-center gap-1" title="Views"><Eye className="h-4 w-4" /> {product.view_count || 0}</span>
                              <span className="flex items-center gap-1" title="Favorites"><Star className="h-4 w-4" /> {product.favorite_count || 0}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button onClick={() => openEditDrawer(product)} variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-primary hover:bg-primary/10">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button onClick={() => handleDelete(product.id)} variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* --- GRID VIEW --- */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {paginatedProducts.map((product) => (
                  <Card key={product.id} className="border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group rounded-2xl flex flex-col">
                    <div className="relative aspect-square bg-gray-100 shrink-0">
                      {product.images?.[0] ? (
                        <img src={product.images[0].image_url} alt={product.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                          <ImageIcon className="h-8 w-8" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">No Image</span>
                        </div>
                      )}
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        {product.is_available ? (
                          <Badge className="bg-green-500/90 hover:bg-green-500 text-white border-none shadow-sm backdrop-blur-sm">Active</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-900/80 hover:bg-gray-900 text-white border-none shadow-sm backdrop-blur-sm">Draft</Badge>
                        )}
                      </div>
                      
                      {/* Action Overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
                        <Button onClick={() => openEditDrawer(product)} variant="secondary" size="icon" className="h-8 w-8 bg-white/90 hover:bg-white text-gray-900">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => handleDelete(product.id)} variant="destructive" size="icon" className="h-8 w-8 shadow-sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <CardContent className="p-4 flex flex-col flex-1">
                      <div className="space-y-1 mb-3">
                        <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{product.title}</h3>
                        <p className="text-lg font-black text-primary">KSh {Number(product.price).toLocaleString()}</p>
                      </div>
                      <div className="mt-auto flex justify-between items-center text-xs font-bold text-gray-400">
                        <span className="truncate pr-2">{product.category?.name || 'Uncategorized'}</span>
                        <div className="flex gap-2 shrink-0">
                          <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{product.view_count || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-100 rounded-xl shadow-sm mt-6">
                <p className="text-sm text-gray-600 font-medium hidden sm:block">
                  Showing <span className="font-bold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-gray-900">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> of <span className="font-bold text-gray-900">{filteredProducts.length}</span> results
                </p>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="font-bold"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                  </Button>
                  <span className="text-sm font-bold text-gray-900 px-2 sm:hidden">
                    Page {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="font-bold"
                  >
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

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
