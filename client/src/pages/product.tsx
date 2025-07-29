import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import CartSidebar from "@/components/cart/cart-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Heart, ShoppingCart, Minus, Plus, Share2 } from "lucide-react";

interface ProductPageProps {
  params: { id: string };
}

export default function Product({ params }: ProductPageProps) {
  const { id } = params;
  const { user, isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState({ rating: 5, title: '', comment: '' });

  const { data: product, isLoading } = useQuery({
    queryKey: ["/api/products", id],
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["/api/products", id, "reviews"],
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!selectedColor || !selectedSize) {
        throw new Error("Please select color and size");
      }

      const cartItem = {
        id: `${product.id}-${selectedColor}-${selectedSize}`,
        productId: product.id,
        name: product.name,
        price: parseFloat(product.price),
        variant: {
          color: selectedColor,
          size: selectedSize,
        },
        image: product.images?.[0],
      };

      addItem(cartItem);
      return cartItem;
    },
    onSuccess: () => {
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      });
      setIsCartOpen(true);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const submitReviewMutation = useMutation({
    mutationFn: async (reviewData: any) => {
      const response = await apiRequest("POST", `/api/products/${id}/reviews`, reviewData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      });
      setReview({ rating: 5, title: '', comment: '' });
      queryClient.invalidateQueries({ queryKey: ["/api/products", id, "reviews"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to submit a review.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 1500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a review.",
        variant: "destructive",
      });
      return;
    }
    submitReviewMutation.mutate(review);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Product link copied to clipboard!",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header onCartOpen={() => setIsCartOpen(true)} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
            <div className="space-y-4">
              <div className="bg-neutral-200 aspect-square rounded-lg"></div>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-neutral-200 aspect-square rounded-md"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-neutral-200 rounded"></div>
              <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
              <div className="h-6 bg-neutral-200 rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-neutral-200 rounded"></div>
                <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header onCartOpen={() => setIsCartOpen(true)} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-neutral-600 mb-8">The product you're looking for doesn't exist.</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  // Set default selections
  if (!selectedColor && product.colors?.length > 0) {
    setSelectedColor(product.colors[0]);
  }
  if (!selectedSize && product.sizes?.length > 0) {
    setSelectedSize(product.sizes[0]);
  }

  const images = product.images || [];
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="min-h-screen bg-white">
      <Header onCartOpen={() => setIsCartOpen(true)} />

      {/* Breadcrumb */}
      <div className="bg-neutral-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm text-neutral-600">
            <span>Home</span>
            <span>/</span>
            <span>Shop</span>
            <span>/</span>
            <span className="text-black font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden">
              <img
                src={images[selectedImage] || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-neutral-100 rounded-md overflow-hidden border-2 ${
                      selectedImage === index ? 'border-black' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(averageRating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-neutral-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-neutral-600 ml-2">
                    ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-black">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-neutral-400 line-through">
                    ${product.originalPrice}
                  </span>
                )}
                {product.originalPrice && (
                  <Badge variant="destructive">
                    {Math.round((1 - parseFloat(product.price) / parseFloat(product.originalPrice)) * 100)}% OFF
                  </Badge>
                )}
              </div>
            </div>

            <p className="text-neutral-600 leading-relaxed">{product.description}</p>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Color: {selectedColor}
                </Label>
                <div className="flex space-x-2">
                  {product.colors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                        selectedColor === color
                          ? 'border-black bg-black text-white'
                          : 'border-neutral-300 hover:border-neutral-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Size: {selectedSize}
                </Label>
                <div className="grid grid-cols-6 gap-2">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 border rounded-md text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-neutral-300 hover:border-neutral-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Quantity</Label>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <Button
                className="w-full bg-black text-white hover:bg-neutral-800 py-3"
                onClick={() => addToCartMutation.mutate()}
                disabled={addToCartMutation.isPending}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
              </Button>
              
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1">
                  <Heart className="h-4 w-4 mr-2" />
                  Add to Wishlist
                </Button>
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Product Features */}
            <div className="border-t border-neutral-200 pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Easy Returns</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Premium Quality</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Fast Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>

            <TabsContent value="reviews" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Reviews List */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Customer Reviews</h3>
                  {reviews.length === 0 ? (
                    <p className="text-neutral-600">No reviews yet. Be the first to review this product!</p>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((review: any) => (
                        <Card key={review.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="flex items-center space-x-1 mb-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${
                                        i < review.rating 
                                          ? 'text-yellow-400 fill-current' 
                                          : 'text-neutral-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <p className="font-medium text-sm">{review.title}</p>
                              </div>
                              <span className="text-xs text-neutral-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-neutral-600">{review.comment}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {/* Write Review */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
                  {isAuthenticated ? (
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Rating</Label>
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setReview(prev => ({ ...prev, rating: i + 1 }))}
                              className="text-2xl"
                            >
                              <Star
                                className={`h-6 w-6 ${
                                  i < review.rating 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-neutral-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="review-title" className="text-sm font-medium mb-2 block">
                          Review Title
                        </Label>
                        <input
                          id="review-title"
                          type="text"
                          value={review.title}
                          onChange={(e) => setReview(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Give your review a title"
                        />
                      </div>

                      <div>
                        <Label htmlFor="review-comment" className="text-sm font-medium mb-2 block">
                          Your Review
                        </Label>
                        <Textarea
                          id="review-comment"
                          value={review.comment}
                          onChange={(e) => setReview(prev => ({ ...prev, comment: e.target.value }))}
                          placeholder="Share your thoughts about this product"
                          rows={4}
                        />
                      </div>

                      <Button 
                        type="submit" 
                        disabled={submitReviewMutation.isPending}
                        className="w-full"
                      >
                        {submitReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-neutral-600 mb-4">Sign in to write a review</p>
                      <Button onClick={() => window.location.href = "/api/login"}>
                        Sign In
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="mt-8">
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">Product Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Materials</h4>
                    <p className="text-neutral-600">100% Premium Cotton</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Care Instructions</h4>
                    <p className="text-neutral-600">Machine wash cold, tumble dry low</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Fit</h4>
                    <p className="text-neutral-600">Regular fit, true to size</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Origin</h4>
                    <p className="text-neutral-600">Designed and printed in USA</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="mt-8">
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">Shipping Information</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Free Standard Shipping</h4>
                    <p className="text-neutral-600">Free shipping on all orders over $50. Delivery in 5-7 business days.</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Express Shipping</h4>
                    <p className="text-neutral-600">$9.99 for orders under $50. Delivery in 2-3 business days.</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Returns</h4>
                    <p className="text-neutral-600">30-day return policy. Items must be unworn and in original condition.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
