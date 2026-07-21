'use client';

import { useState, useEffect, useCallback } from 'react';
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
  ChevronRight,
  Filter,
  ExternalLink,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import SellerLayout from '@/components/layout/SellerLayout';
import { ProductFormDrawer } from '@/components/dashboard/seller/ProductFormDrawer';
import { getCurrentUser } from '@/services/auth/authService';

type ViewMode = 'list' | 'grid';
type StatusFilter = 'ALL' | 'ACTIVE' | 'DRAFT';

export default function SellerInventoryPage() {
  const { toast } = useToast();
  
  // Data States
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState({ total: 0, active: 0, drafts: 0, totalValue: 0 });
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  // UI / Filter States
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter]);

  // Fetch Stats
  const fetchStats = useCallback(async (userId: string) => {
    try {
      const res = await fetch(`/api/seller/inventory/stats?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, []);

  // Fetch Products (Server-side Pagination & Filtering)
  const fetchProducts = useCallback(async (userId: string, page: number, search: string, status: StatusFilter) => {
    setIsFetching(true);
    try {
      let url = `/api/products?sellerId=${userId}&sellerView=true&page=${page}&limit=${itemsPerPage}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (status !== 'ALL') url += `&status=${status}`;

      const res = await fetch(url);
      const data = await res.json();
      
      if (res.ok) {
        setProducts(data.products || []);
        setTotalCount(data.count || 0);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({ title: "Failed to load inventory", variant: "destructive" });
    } finally {
      setIsFetching(false);
      setIsInitialLoading(false);
    }
  }, [itemsPerPage, toast]);

  // Initial Load & Effect Triggers
  useEffect(() => {
    let active = true;
    const init = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser || !active) return;
      
      if (!user) setUser(currentUser);
      
      await Promise.all([
        fetchStats(currentUser.id),
        fetchProducts(currentUser.id, currentPage, debouncedSearch, statusFilter)
      ]);
    };
    init();
    return () => { active = false; };
  }, [currentPage, debouncedSearch, statusFilter, fetchStats, fetchProducts, user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast({ title: "Product deleted successfully" });
        // Refresh current view
        if (user) {
          fetchStats(user.id);
          fetchProducts(user.id, currentPage, debouncedSearch, statusFilter);
        }
      } else {
        throw new Error('Deletion failed');
      }
    } catch (error) {
      toast({ title: "Failed to delete product", variant: "destructive" });
    }
  };

  const handleTogglePublish = async (product: any) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_available: !product.is_available }),
      });
      if (res.ok) {
        toast({ title: `Product ${product.is_available ? 'unpublished' : 'published'} successfully` });
        if (user) {
          fetchStats(user.id);
          fetchProducts(user.id, currentPage, debouncedSearch, statusFilter);
        }
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      toast({ title: "Failed to update product status", variant: "destructive" });
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

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  if (isInitialLoading) {
    return (
      <SellerLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-gray-500 tracking-wider uppercase animate-pulse">Loading Inventory</p>
        </div>
      </SellerLayout>
    );
  }

  const statCards = [
    { title: 'Total Products', value: stats.total, icon: Package, gradient: 'from-blue-500/10 to-transparent', color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Active Listings', value: stats.active, icon: Tag, gradient: 'from-emerald-500/10 to-transparent', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { title: 'Drafts', value: stats.drafts, icon: Archive, gradient: 'from-gray-500/10 to-transparent', color: 'text-gray-500', bg: 'bg-gray-50' },
    { title: 'Inventory Value', value: `KSh ${Number(stats.totalValue).toLocaleString()}`, icon: DollarSign, gradient: 'from-purple-500/10 to-transparent', color: 'text-purple-500', bg: 'bg-purple-50' }
  ];

  return (
    <SellerLayout>
      <div className="w-full mx-auto space-y-4 sm:space-y-6 pb-8 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl overflow-x-hidden">
        
        {/* Header & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Inventory</h1>
            <p className="text-sm text-gray-500 font-medium mt-1">Manage your products.</p>
          </div>
          <Button onClick={openAddDrawer} className="w-full md:w-auto font-medium shadow-sm h-11 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
            <Plus className="h-5 w-5 mr-2" /> Add Product
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statCards.map((stat, idx) => (
            <Card key={idx} className="border border-gray-100 shadow-sm overflow-hidden bg-white rounded-2xl transition-all duration-300 hover:shadow-md">
              <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className={`h-12 w-12 rounded-xl flex-shrink-0 ${stat.bg} ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{stat.title}</p>
                  <p className="text-xl md:text-2xl font-semibold text-gray-900 tracking-tight">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Toolbar: Search, Filter, View Toggle */}
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-3 sticky top-4 z-20 backdrop-blur-xl bg-white/90">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search products by title..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-gray-50/50 border-gray-200 focus-visible:bg-white focus-visible:ring-primary/20 h-12 text-base md:text-sm rounded-xl font-medium"
            />
          </div>
          
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <div className="flex p-1 bg-gray-100/80 rounded-xl shrink-0">
              {['ALL', 'ACTIVE', 'DRAFT'].map((status) => (
                <button 
                  key={status}
                  onClick={() => setStatusFilter(status as StatusFilter)}
                  className={cn(
                    "px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all", 
                    statusFilter === status 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="w-px h-8 bg-gray-200 shrink-0 hidden md:block" />

            <div className="flex p-1 bg-gray-100/80 rounded-xl shrink-0 hidden md:flex">
              <button 
                onClick={() => setViewMode('list')}
                className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-white text-primary shadow-sm" : "text-gray-400 hover:text-gray-700")}
              >
                <List className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-white text-primary shadow-sm" : "text-gray-400 hover:text-gray-700")}
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className={cn("transition-opacity duration-300", isFetching ? "opacity-50 pointer-events-none" : "opacity-100")}>
          {products.length === 0 ? (
            <div className="py-24 text-center bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
              <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Filter className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">No products found</h3>
              <p className="text-gray-500 mt-2 mb-8 max-w-sm mx-auto font-medium">
                {searchQuery || statusFilter !== 'ALL' 
                  ? "No products match your search." 
                  : "You have no products yet. Add your first product to get started."}
              </p>
              {searchQuery || statusFilter !== 'ALL' ? (
                <Button variant="outline" onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); }} className="font-bold rounded-xl h-12 px-6">
                  Clear Filters
                </Button>
              ) : (
                <Button onClick={openAddDrawer} className="font-bold h-12 px-6 rounded-xl shadow-lg shadow-primary/20">
                  <Plus className="h-5 w-5 mr-2" /> Add New Product
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* --- LIST VIEW --- */}
              {viewMode === 'list' && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left whitespace-nowrap">
                      <thead className="bg-gray-50/80 border-b border-gray-100">
                        <tr>
                          <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">Product</th>
                          <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                          <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">Price</th>
                          <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">Engagement</th>
                          <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {products.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200 shadow-sm relative">
                                  {product.images?.[0] ? (
                                    <img src={product.images[0].image_url} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                  ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
                                      <ImageIcon className="h-5 w-5" />
                                    </div>
                                  )}
                                </div>
                                <div className="max-w-[200px] lg:max-w-[300px]">
                                  <p className="font-bold text-gray-900 truncate">{product.title}</p>
                                  <p className="text-xs text-gray-500 font-medium truncate mt-0.5">{product.category?.name || 'Uncategorized'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {product.is_available ? (
                                <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-none px-3 py-1 font-medium shadow-sm">Active</Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-none px-3 py-1 font-medium shadow-sm">Draft</Badge>
                              )}
                            </td>
                            <td className="px-6 py-4 font-semibold text-gray-900">
                              KSh {Number(product.price).toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-4 text-gray-400 font-bold text-xs">
                                <span className="flex items-center gap-1.5" title="Views"><Eye className="h-4 w-4" /> {product.view_count || 0}</span>
                                <span className="flex items-center gap-1.5" title="Favorites"><Star className="h-4 w-4" /> {product.favorite_count || 0}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button asChild variant="outline" size="icon" className="h-9 w-9 rounded-lg text-blue-600 hover:bg-blue-50 hover:border-blue-200 border-gray-200 bg-white shrink-0" title="View in store">
                                  <a href={`/product/${product.slug || product.id}`} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                </Button>
                                <Button onClick={() => handleTogglePublish(product)} variant="outline" size="icon" className="h-9 w-9 rounded-lg text-amber-600 hover:bg-amber-50 hover:border-amber-200 border-gray-200 bg-white shrink-0" title={product.is_available ? "Unpublish" : "Publish"}>
                                  {product.is_available ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                                <Button onClick={() => openEditDrawer(product)} variant="outline" size="sm" className="h-9 rounded-lg text-gray-600 hover:text-primary bg-white border-gray-200" title="Edit">
                                  <Edit className="h-4 w-4 sm:mr-1.5" /> <span className="hidden sm:inline">Edit</span>
                                </Button>
                                <Button onClick={() => handleDelete(product.id)} variant="outline" size="icon" className="h-9 w-9 rounded-lg text-red-600 hover:bg-red-50 hover:border-red-200 border-gray-200 bg-white shrink-0" title="Delete">
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <Card key={product.id} className="border-none shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 group rounded-3xl flex flex-col bg-white">
                      <div className="relative aspect-square bg-gray-100 shrink-0 overflow-hidden">
                        {product.images?.[0] ? (
                          <img src={product.images[0].image_url} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2 bg-gray-50">
                            <ImageIcon className="h-8 w-8" />
                            <span className="text-[10px] font-medium uppercase tracking-wider">No Image</span>
                          </div>
                        )}
                        
                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex gap-2">
                          {product.is_available ? (
                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none px-2 shadow-sm">Active</Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-none px-2 shadow-sm">Draft</Badge>
                          )}
                        </div>
                      </div>
                      
                      <CardContent className="p-4 flex flex-col flex-1">
                        <div className="space-y-1 mb-4">
                          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{product.title}</h3>
                          <p className="text-lg font-bold text-gray-900">KSh {Number(product.price).toLocaleString()}</p>
                        </div>
                        
                        <div className="mt-auto space-y-3">
                          <div className="flex justify-between items-center text-xs font-medium text-gray-500 border-t border-gray-50 pt-3">
                            <span className="truncate pr-2 uppercase tracking-wider text-[10px]">{product.category?.name || 'Uncategorized'}</span>
                            <div className="flex gap-2 shrink-0">
                              <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{product.view_count || 0}</span>
                            </div>
                          </div>
                          
                          {/* Visible Actions */}
                          <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                            <Button onClick={() => openEditDrawer(product)} variant="outline" className="flex-1 h-9 rounded-lg text-gray-600 hover:text-primary hover:bg-primary/5 border-gray-200">
                              <Edit className="h-4 w-4 mr-1.5" /> Edit
                            </Button>
                            <Button asChild variant="outline" size="icon" className="h-9 w-9 shrink-0 rounded-lg text-blue-600 hover:bg-blue-50 hover:border-blue-200 border-gray-200" title="View in store">
                              <a href={`/product/${product.slug || product.id}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                            <Button onClick={() => handleTogglePublish(product)} variant="outline" size="icon" className="h-9 w-9 shrink-0 rounded-lg text-amber-600 hover:bg-amber-50 hover:border-amber-200 border-gray-200" title={product.is_available ? "Unpublish" : "Publish"}>
                              {product.is_available ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button onClick={() => handleDelete(product.id)} variant="outline" size="icon" className="h-9 w-9 shrink-0 rounded-lg text-red-600 hover:bg-red-50 hover:border-red-200 border-gray-200" title="Delete">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 sm:px-6 sm:py-4 rounded-2xl shadow-sm mt-6 border border-gray-100 gap-4">
                  <p className="text-sm text-gray-500 font-medium">
                    Showing <span className="font-semibold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(currentPage * itemsPerPage, totalCount)}</span> of <span className="font-semibold text-gray-900">{totalCount}</span>
                  </p>
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <Button
                      variant="outline"
                      className="font-medium rounded-xl h-10 px-4 border-gray-200 hover:bg-gray-50"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" /> Prev
                    </Button>
                    <span className="text-sm font-medium text-gray-900 px-2 sm:hidden">
                      {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      className="font-medium rounded-xl h-10 px-4 border-gray-200 hover:bg-gray-50"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <ProductFormDrawer 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          product={editingProduct} 
          sellerId={user?.id}
          onSuccess={() => {
            if (user) {
              fetchStats(user.id);
              fetchProducts(user.id, currentPage, debouncedSearch, statusFilter);
            }
          }}
        />
      </div>
    </SellerLayout>
  );
}
