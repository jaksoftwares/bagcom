'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Search, 
  Grid, 
  List,
  Heart,
  SlidersHorizontal,
  Star,
  ShoppingCart,
  ArrowUpDown,
  Award,
  Shield,
  Truck
} from 'lucide-react';
import Header from '@/components/Header';
import Link from 'next/link';
import { newProducts } from '@/lib/new-products-data';

const regions = [
  'All Regions',
  'Nairobi County',
  'Kiambu County', 
  'Machakos County',
  'Kajiado County',
  'Murang\'a County',
  'Nyeri County',
  'Kirinyaga County',
  'Nakuru County',
  'Mombasa County',
  'Kisumu County',
  'Eldoret',
  'Thika',
  'Ruiru',
  'Kikuyu',
  'Limuru',
  'Juja',
  'Athi River',
  'Kitengela'
];

const categories = ['All Categories', 'Electronics', 'Furniture', 'Kitchen', 'Sports', 'Books'];
const brands = ['All Brands', 'TechSound', 'FitTech', 'BrewMaster', 'ComfortSeating', 'BrightLight', 'SoundWave', 'GameTech', 'ChargeTech'];

export default function NewProducts() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'seller' | 'buyer'>('buyer');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState([0, 30000]);
  const [showFilters, setShowFilters] = useState(false);
  const [likedItems, setLikedItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [freeShippingOnly, setFreeShippingOnly] = useState(false);

  const toggleLike = (id: number) => {
    setLikedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // Enhanced filter logic
  const filteredProducts = newProducts.filter(product => {
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesCategory = selectedCategory === 'all' || selectedCategory === 'All Categories' || product.category === selectedCategory;
    const matchesBrand = selectedBrand === 'all' || selectedBrand === 'All Brands' || product.brand === selectedBrand;
    const matchesRegion = selectedRegion === 'all' || selectedRegion === 'All Regions' || product.region === selectedRegion;
    const matchesStock = !inStockOnly || product.inStock;
    const matchesShipping = !freeShippingOnly || product.freeShipping;
    const matchesSearch = searchQuery === '' || 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesPrice && matchesCategory && matchesBrand && matchesRegion && matchesStock && matchesShipping && matchesSearch;
  });

  const calculateSavings = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userRole={userRole} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Badge className="bg-green-100 text-green-800 px-3 py-1">
              ✨ New Products Store
            </Badge>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">New Products</h1>
          <p className="text-gray-600">Discover {filteredProducts.length} brand new products with warranty and support</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search new products..."
                className="pl-10 py-3"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
              
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced Filters Panel */}
          {showFilters && (
            <Card className="mb-6">
              <CardContent className="p-4 lg:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category.toLowerCase()}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                    <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map(brand => (
                          <SelectItem key={brand} value={brand.toLowerCase()}>{brand}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                    <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map(region => (
                          <SelectItem key={region} value={region.toLowerCase()}>{region}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range: KSh {priceRange[0].toLocaleString()} - KSh {priceRange[1].toLocaleString()}
                    </label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={30000}
                      min={0}
                      step={500}
                      className="mt-2"
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">In Stock Only</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={freeShippingOnly}
                      onChange={(e) => setFreeShippingOnly(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Free Shipping Only</span>
                  </label>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedBrand('all');
                      setSelectedRegion('all');
                      setPriceRange([0, 30000]);
                      setSearchQuery('');
                      setInStockOnly(false);
                      setFreeShippingOnly(false);
                    }}
                  >
                    Clear Filters
                  </Button>
                  <div className="text-sm text-gray-600 flex items-center">
                    Showing {filteredProducts.length} of {newProducts.length} products
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
            <Button onClick={() => {
              setSelectedCategory('all');
              setSelectedBrand('all');
              setSelectedRegion('all');
              setPriceRange([0, 30000]);
              setSearchQuery('');
              setInStockOnly(false);
              setFreeShippingOnly(false);
            }}>
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className={`grid gap-4 lg:gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map((product) => {
              const savings = calculateSavings(product.originalPrice, product.price);
              
              return (
                <Link key={product.id} href={`/new-product/${product.id}`}>
                  <Card className="group hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white cursor-pointer border-2 hover:border-green-200">
                    <div className="relative">
                      <img 
                        src={product.image} 
                        alt={product.title}
                        className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                          viewMode === 'grid' ? 'h-40 sm:h-48' : 'h-32 sm:h-40'
                        }`}
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <Badge className="bg-green-500 text-white shadow-lg text-xs">
                          NEW
                        </Badge>
                        {savings > 0 && (
                          <Badge className="bg-red-500 text-white shadow-lg text-xs">
                            {savings}% OFF
                          </Badge>
                        )}
                        {product.freeShipping && (
                          <Badge className="bg-blue-500 text-white shadow-lg text-xs">
                            Free Ship
                          </Badge>
                        )}
                      </div>
                      
                      {/* Like Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleLike(product.id);
                        }}
                        className="absolute top-2 right-2 p-2 rounded-full bg-white/90 hover:bg-white transition-all shadow-lg"
                      >
                        <Heart 
                          className={`h-4 w-4 ${likedItems.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                        />
                      </button>

                      {/* Stock Status */}
                      <div className="absolute bottom-2 right-2">
                        <Badge variant={product.inStock ? 'default' : 'secondary'} className="shadow-lg text-xs">
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-3 lg:p-4">
                      <div className={`${viewMode === 'list' ? 'flex items-start gap-4' : ''}`}>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className="text-xs">
                              {product.category}
                            </Badge>
                            <span className="text-sm font-medium text-gray-600">{product.brand}</span>
                          </div>
                          
                          <h3 className="text-base lg:text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 mb-2">
                            {product.title}
                          </h3>

                          {viewMode === 'list' && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {product.description}
                            </p>
                          )}

                          {/* Rating */}
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium">{product.rating}</span>
                            <span className="text-xs text-gray-500">({product.reviews})</span>
                          </div>

                          {/* Features */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {product.features.slice(0, viewMode === 'list' ? 3 : 2).map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {product.features.length > (viewMode === 'list' ? 3 : 2) && (
                              <Badge variant="outline" className="text-xs">
                                +{product.features.length - (viewMode === 'list' ? 3 : 2)} more
                              </Badge>
                            )}
                          </div>

                          {/* Pricing */}
                          <div className="mb-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg lg:text-xl font-bold text-gray-900">
                                KSh {product.price.toLocaleString()}
                              </span>
                              {product.originalPrice > product.price && (
                                <span className="text-sm text-gray-500 line-through">
                                  KSh {product.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Shield className="h-3 w-3" />
                              <span>Warranty: {product.warranty}</span>
                              {product.freeShipping && (
                                <>
                                  <Truck className="h-3 w-3" />
                                  <span>Free Shipping</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className={`${viewMode === 'list' ? 'flex flex-col gap-2 min-w-[120px]' : 'flex flex-col sm:flex-row gap-2'}`}>
                          <Button 
                            className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700" 
                            size="sm"
                            disabled={!product.inStock}
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Add to Cart</span>
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Heart className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Save</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="mt-8 lg:mt-12 flex justify-center">
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="outline" size="sm">Previous</Button>
              <Button size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">4</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}