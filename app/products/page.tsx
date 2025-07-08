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
  Filter, 
  Grid, 
  List,
  Heart,
  MapPin,
  Clock,
  SlidersHorizontal,
  Star,
  Eye,
  MessageCircle,
  ArrowUpDown
} from 'lucide-react';
import Header from '@/components/Header';
import Link from 'next/link';
import { sampleProducts } from '@/lib/products';
import { categories, getAllSubcategories } from '@/lib/categories';

// Enhanced regions for better filtering
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

export default function Products() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'seller' | 'buyer'>('buyer');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [showFilters, setShowFilters] = useState(false);
  const [likedItems, setLikedItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleLike = (id: number) => {
    setLikedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // Enhanced filter logic with region filtering
  const filteredProducts = sampleProducts.filter(product => {
    const totalPrice = product.price + product.commission;
    const matchesPrice = totalPrice >= priceRange[0] && totalPrice <= priceRange[1];
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSubcategory = selectedSubcategory === 'all' || product.subcategory === selectedSubcategory;
    const matchesCondition = selectedCondition === 'all' || product.condition === selectedCondition;
    const matchesRegion = selectedRegion === 'all' || selectedRegion === 'All Regions' || 
      product.location.area.toLowerCase().includes(selectedRegion.toLowerCase()) ||
      product.location.campus.toLowerCase().includes(selectedRegion.toLowerCase());
    const matchesSearch = searchQuery === '' || 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesPrice && matchesCategory && matchesSubcategory && matchesCondition && matchesRegion && matchesSearch;
  });

  const conditions = ['All', 'Excellent', 'Very Good', 'Good', 'Fair'];
  const sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Most Popular', 'Highest Rated'];
  const allSubcategories = getAllSubcategories();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userRole={userRole} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
              🔄 Second-Hand Marketplace
            </Badge>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Second-Hand Products</h1>
          <p className="text-gray-600">Browse through {filteredProducts.length} pre-owned items from trusted sellers</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search second-hand products..."
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
                  {sortOptions.map(option => (
                    <SelectItem key={option} value={option.toLowerCase().replace(/[^a-z0-9]/g, '-')}>
                      {option}
                    </SelectItem>
                  ))}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                    <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subcategories</SelectItem>
                        {allSubcategories
                          .filter(sub => selectedCategory === 'all' || sub.categoryId === selectedCategory)
                          .map(sub => (
                            <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                    <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {conditions.map(condition => (
                          <SelectItem key={condition} value={condition.toLowerCase()}>{condition}</SelectItem>
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
                      max={100000}
                      min={0}
                      step={1000}
                      className="mt-2"
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedSubcategory('all');
                      setSelectedCondition('all');
                      setSelectedRegion('all');
                      setPriceRange([0, 100000]);
                      setSearchQuery('');
                    }}
                  >
                    Clear Filters
                  </Button>
                  <div className="text-sm text-gray-600 flex items-center">
                    Showing {filteredProducts.length} of {sampleProducts.length} products
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
              setSelectedSubcategory('all');
              setSelectedCondition('all');
              setSelectedRegion('all');
              setPriceRange([0, 100000]);
              setSearchQuery('');
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
            {filteredProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden bg-white cursor-pointer">
                  <div className="relative">
                    <img 
                      src={product.images[0]} 
                      alt={product.title}
                      className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                        viewMode === 'grid' ? 'h-40 sm:h-48' : 'h-32 sm:h-40'
                      }`}
                    />
                    
                    <Badge className="absolute top-2 left-2 bg-blue-500 text-white shadow-lg">
                      {product.condition}
                    </Badge>
                    
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

                    <Badge variant="secondary" className="absolute bottom-2 left-2 shadow-lg">
                      {categories.find(cat => cat.id === product.category)?.name}
                    </Badge>

                    <div className="absolute bottom-2 right-2 flex items-center space-x-1 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                      <Eye className="h-3 w-3" />
                      <span>{product.views}</span>
                    </div>
                  </div>

                  <CardContent className="p-3 lg:p-4">
                    <div className={`${viewMode === 'list' ? 'flex items-start gap-4' : ''}`}>
                      <div className="flex-1">
                        <h3 className="text-base lg:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                          {product.title}
                        </h3>

                        {viewMode === 'list' && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {product.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-1 mb-2">
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

                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <span className="text-sm text-gray-600 truncate">{product.location.area}</span>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{product.timePosted}</span>
                        </div>

                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg lg:text-xl font-bold text-gray-900">
                              KSh {(product.price + product.commission).toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              KSh {product.originalPrice.toLocaleString()}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Seller gets: KSh {product.price.toLocaleString()} | Commission: KSh {product.commission.toLocaleString()}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700 truncate">
                              {product.seller.name}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span className="text-xs text-gray-600">{product.seller.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {product.likes + (likedItems.includes(product.id) ? 1 : 0)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className={`${viewMode === 'list' ? 'flex flex-col gap-2 min-w-[120px]' : 'flex flex-col sm:flex-row gap-2'}`}>
                        <Button className="flex-1" size="sm">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Contact</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
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