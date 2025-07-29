import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductGrid from "@/components/product/product-grid";
import CartSidebar from "@/components/cart/cart-sidebar";
import AIChatbot from "@/components/chat/ai-chatbot";
import InstagramFeed from "@/components/social/instagram-feed";
import CustomerReviews from "@/components/reviews/customer-reviews";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Eye, Palette, Check } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: featuredProducts = [] } = useQuery({
    queryKey: ["/api/products", { featured: true }],
  });

  const categoryImages = {
    "t-shirts": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    "hoodies": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    "shoes": "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    "accessories": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onCartOpen={() => setIsCartOpen(true)} />

      {/* Hero Section */}
      <section className="relative bg-neutral-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl lg:text-6xl font-bold text-black leading-tight">
                Design Your
                <span className="text-blue-500"> Unique</span>
                <br />Streetwear
              </h2>
              <p className="text-lg text-neutral-600 leading-relaxed">
                Create custom t-shirts, hoodies, and accessories with our intuitive design tools. 
                Express your style with premium quality materials and professional printing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/design">
                  <Button className="bg-black text-white px-8 py-4 text-lg hover:bg-neutral-800">
                    Start Designing
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button variant="outline" className="px-8 py-4 text-lg">
                    Shop Collections
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800" 
                alt="Custom designed streetwear" 
                className="rounded-2xl shadow-2xl w-full h-auto" 
              />
              <Card className="absolute -bottom-6 -left-6 bg-white p-6 shadow-lg">
                <CardContent className="p-0">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Free Shipping</p>
                      <p className="text-neutral-500 text-xs">On orders over $50</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-black mb-4">Shop by Category</h3>
            <p className="text-neutral-600 max-w-2xl mx-auto">Discover our premium collection of streetwear essentials and custom design options</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.length > 0 ? (
              categories.map((category: any) => (
                <Link key={category.id} href={`/shop?category=${category.id}`}>
                  <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-xl bg-neutral-100 aspect-square mb-4">
                      <img 
                        src={category.imageUrl || categoryImages[category.slug as keyof typeof categoryImages] || categoryImages["t-shirts"]}
                        alt={`${category.name} Collection`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h4 className="font-semibold text-lg">{category.name}</h4>
                        <p className="text-sm opacity-90">From $24.99</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // Default categories if none exist
              ["T-Shirts", "Hoodies", "Shoes", "Accessories"].map((name, index) => (
                <Link key={index} href={`/shop`}>
                  <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-xl bg-neutral-100 aspect-square mb-4">
                      <img 
                        src={Object.values(categoryImages)[index]}
                        alt={`${name} Collection`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h4 className="font-semibold text-lg">{name}</h4>
                        <p className="text-sm opacity-90">From $24.99</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Custom Design Section */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-black">Custom Design Studio</h3>
              <p className="text-lg text-neutral-600">
                Bring your ideas to life with our professional design tools. Upload your artwork, 
                choose colors, and see instant previews on premium quality apparel.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Upload className="h-4 w-4 text-blue-500" />
                  </div>
                  <span className="text-neutral-700">Upload your designs or choose from templates</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Eye className="h-4 w-4 text-blue-500" />
                  </div>
                  <span className="text-neutral-700">Real-time preview on clothing mockups</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Palette className="h-4 w-4 text-blue-500" />
                  </div>
                  <span className="text-neutral-700">AI background removal & color customization</span>
                </div>
              </div>
              
              <Link href="/design">
                <Button className="bg-blue-500 text-white px-8 py-4 hover:bg-blue-600">
                  Try Design Studio
                </Button>
              </Link>
            </div>
            
            <Card className="bg-white shadow-xl p-8">
              <CardContent className="p-0">
                <div className="space-y-6">
                  <div className="text-center">
                    <h4 className="font-semibold text-lg mb-4">Design Preview</h4>
                    <div className="relative bg-neutral-100 rounded-lg p-8 aspect-square">
                      <img 
                        src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
                        alt="T-shirt design template"
                        className="w-full h-full object-contain" 
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg text-center">
                          <Upload className="h-8 w-8 text-neutral-400 mb-2 mx-auto" />
                          <p className="text-sm text-neutral-600">Drop your design here</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Garment</label>
                      <select className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>T-Shirt</option>
                        <option>Hoodie</option>
                        <option>Tank Top</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Color</label>
                      <select className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Black</option>
                        <option>White</option>
                        <option>Navy</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
                    <span className="text-lg font-semibold">Total: <span className="text-blue-500">$29.99</span></span>
                    <Button className="bg-black text-white hover:bg-neutral-800">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-black mb-4">Featured Products</h3>
            <p className="text-neutral-600">Handpicked designs from our latest collections</p>
          </div>
          
          <ProductGrid products={featuredProducts} />
          
          <div className="text-center mt-12">
            <Link href="/shop">
              <Button variant="outline" className="px-8 py-3">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <InstagramFeed />

      {/* Customer Reviews */}
      <CustomerReviews />

      <Footer />

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* AI Chatbot */}
      <AIChatbot />

      {/* WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 group relative">
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.108"/>
          </svg>
          <div className="absolute bottom-full right-0 mb-2 bg-neutral-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Chat with us on WhatsApp
          </div>
        </Button>
      </div>
    </div>
  );
}
