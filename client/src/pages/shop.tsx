import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductGrid from "@/components/product/product-grid";
import CartSidebar from "@/components/cart/cart-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Filter, X } from "lucide-react";

export default function Shop() {
  const [location] = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Parse URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const [filters, setFilters] = useState({
    category: urlParams.get('category') || '',
    search: urlParams.get('search') || '',
    minPrice: 0,
    maxPrice: 200,
    colors: [] as string[],
    sizes: [] as string[],
    sortBy: 'newest'
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["/api/products", filters.category, filters.search],
  });

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product: any) => {
      // Price filter
      const price = parseFloat(product.price);
      if (price < filters.minPrice || price > filters.maxPrice) return false;

      // Color filter
      if (filters.colors.length > 0) {
        const hasColor = filters.colors.some(color => 
          product.colors?.includes(color)
        );
        if (!hasColor) return false;
      }

      // Size filter
      if (filters.sizes.length > 0) {
        const hasSize = filters.sizes.some(size => 
          product.sizes?.includes(size)
        );
        if (!hasSize) return false;
      }

      return true;
    });

    // Sort products
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a: any, b: any) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-high':
        filtered.sort((a: any, b: any) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'rating':
        filtered.sort((a: any, b: any) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0));
        break;
      case 'newest':
      default:
        filtered.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return filtered;
  }, [products, filters]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleArrayFilterToggle = (key: 'colors' | 'sizes', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      search: '',
      minPrice: 0,
      maxPrice: 200,
      colors: [],
      sizes: [],
      sortBy: 'newest'
    });
  };

  const availableColors = ['Black', 'White', 'Navy', 'Gray', 'Red', 'Blue', 'Green'];
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="min-h-screen bg-white">
      <Header onCartOpen={() => setIsCartOpen(true)} />

      {/* Breadcrumb */}
      <div className="bg-neutral-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm text-neutral-600">
            <span>Home</span>
            <span>/</span>
            <span className="text-black font-medium">Shop</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg">Filters</h3>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-3 block">Category</Label>
                  <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories.map((category: any) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-3 block">
                    Price Range: ${filters.minPrice} - ${filters.maxPrice}
                  </Label>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-neutral-600">Min Price</Label>
                      <Slider
                        value={[filters.minPrice]}
                        onValueChange={([value]) => handleFilterChange('minPrice', value)}
                        max={200}
                        step={5}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-neutral-600">Max Price</Label>
                      <Slider
                        value={[filters.maxPrice]}
                        onValueChange={([value]) => handleFilterChange('maxPrice', value)}
                        max={200}
                        step={5}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Colors */}
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-3 block">Colors</Label>
                  <div className="space-y-2">
                    {availableColors.map((color) => (
                      <div key={color} className="flex items-center space-x-2">
                        <Checkbox
                          id={`color-${color}`}
                          checked={filters.colors.includes(color)}
                          onCheckedChange={() => handleArrayFilterToggle('colors', color)}
                        />
                        <Label htmlFor={`color-${color}`} className="text-sm">
                          {color}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-3 block">Sizes</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableSizes.map((size) => (
                      <Button
                        key={size}
                        variant={filters.sizes.includes(size) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleArrayFilterToggle('sizes', size)}
                        className="text-xs"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-black mb-2">
                  {filters.search ? `Search Results for "${filters.search}"` : 'All Products'}
                </h1>
                <p className="text-neutral-600">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                </p>
              </div>

              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                {/* Mobile Filter Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>

                {/* Sort */}
                <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {(filters.colors.length > 0 || filters.sizes.length > 0 || filters.category) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.category && (
                  <div className="flex items-center bg-neutral-100 rounded-full px-3 py-1 text-sm">
                    <span>Category: {categories.find((c: any) => c.id === filters.category)?.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-4 w-4 p-0"
                      onClick={() => handleFilterChange('category', '')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                {filters.colors.map((color) => (
                  <div key={color} className="flex items-center bg-neutral-100 rounded-full px-3 py-1 text-sm">
                    <span>{color}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-4 w-4 p-0"
                      onClick={() => handleArrayFilterToggle('colors', color)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {filters.sizes.map((size) => (
                  <div key={size} className="flex items-center bg-neutral-100 rounded-full px-3 py-1 text-sm">
                    <span>{size}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-4 w-4 p-0"
                      onClick={() => handleArrayFilterToggle('sizes', size)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-neutral-200 aspect-square rounded-lg mb-4"></div>
                    <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                    <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">😔</div>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-neutral-600 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <ProductGrid products={filteredProducts} />
            )}
          </div>
        </div>
      </div>

      <Footer />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
