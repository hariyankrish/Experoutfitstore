import { useState } from "react";
import { Link } from "wouter";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: string;
    originalPrice?: string;
    images?: string[];
    rating?: string;
    reviewCount?: number;
    isFeatured?: boolean;
    colors?: string[];
    sizes?: string[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const rating = parseFloat(product.rating || "0");
  const hasDiscount = product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price);
  const discountPercentage = hasDiscount 
    ? Math.round((1 - parseFloat(product.price) / parseFloat(product.originalPrice!)) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const defaultColor = product.colors?.[0] || 'Black';
    const defaultSize = product.sizes?.[0] || 'M';
    
    addItem({
      id: `${product.id}-${defaultColor}-${defaultSize}`,
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      variant: {
        color: defaultColor,
        size: defaultSize,
      },
      image: product.images?.[0],
    });
  };

  return (
    <div 
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`}>
        <div className="product-card-image">
          <img 
            src={product.images?.[0] || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          
          {/* Hover Actions */}
          <div className={`absolute top-4 right-4 space-y-2 transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <Button variant="ghost" size="sm" className="bg-white p-2 rounded-full shadow-lg hover:bg-neutral-50">
              <Heart className="h-4 w-4 text-neutral-400 hover:text-red-500" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="bg-white p-2 rounded-full shadow-lg hover:bg-neutral-50"
              onClick={handleQuickAdd}
            >
              <ShoppingCart className="h-4 w-4 text-neutral-600" />
            </Button>
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 space-y-2">
            {product.isFeatured && (
              <Badge className="bg-blue-500 text-white">Featured</Badge>
            )}
            {hasDiscount && (
              <Badge className="bg-red-500 text-white">{discountPercentage}% OFF</Badge>
            )}
          </div>

          {/* Quick Add Button - Mobile */}
          <div className={`absolute bottom-4 left-4 right-4 transition-all duration-200 md:hidden ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
          }`}>
            <Button 
              onClick={handleQuickAdd}
              className="w-full bg-black text-white hover:bg-neutral-800"
              size="sm"
            >
              Quick Add
            </Button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="space-y-2 pt-4">
        <h3 className="font-semibold text-neutral-900 line-clamp-2">{product.name}</h3>
        
        {/* Rating */}
        {product.reviewCount && product.reviewCount > 0 && (
          <div className="flex items-center space-x-1">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-3 w-3 ${i < Math.floor(rating) ? 'fill-current' : ''}`} 
                />
              ))}
            </div>
            <span className="text-neutral-500 text-sm">({product.reviewCount})</span>
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-black">${product.price}</span>
          {product.originalPrice && (
            <span className="text-neutral-400 line-through text-sm">
              ${product.originalPrice}
            </span>
          )}
        </div>

        {/* Color Options Preview */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center space-x-1">
            <span className="text-xs text-neutral-600">Colors:</span>
            <div className="flex space-x-1">
              {product.colors.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-neutral-300"
                  style={{
                    backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' : 
                                   color.toLowerCase() === 'black' ? '#000000' :
                                   color.toLowerCase() === 'navy' ? '#1e3a8a' :
                                   color.toLowerCase() === 'gray' ? '#6b7280' :
                                   color.toLowerCase() === 'red' ? '#dc2626' :
                                   color.toLowerCase() === 'blue' ? '#2563eb' :
                                   color.toLowerCase() === 'green' ? '#16a34a' : '#6b7280'
                  }}
                  title={color}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-neutral-500">+{product.colors.length - 4}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
