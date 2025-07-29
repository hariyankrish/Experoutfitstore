import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Upload, Eye, Palette, Heart, ShoppingCart, Check, Instagram, Twitter, Facebook } from "lucide-react";

export default function Landing() {
  const { toast } = useToast();

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const categories = [
    {
      name: "T-Shirts",
      price: "From $24.99",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    },
    {
      name: "Hoodies",
      price: "From $49.99", 
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    },
    {
      name: "Shoes",
      price: "From $79.99",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    },
    {
      name: "Accessories", 
      price: "From $9.99",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    },
  ];

  const featuredProducts = [
    {
      name: "Urban Graphic Tee",
      price: "$24.99",
      originalPrice: "$34.99",
      rating: 5,
      reviews: 24,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      badge: "New",
    },
    {
      name: "Essential Hoodie",
      price: "$49.99",
      rating: 4,
      reviews: 18,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    },
    {
      name: "Street Sneakers",
      price: "$89.99",
      rating: 5,
      reviews: 31,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      badge: "Hot",
    },
    {
      name: "Sticker Pack",
      price: "$12.99",
      rating: 4,
      reviews: 12,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    },
  ];

  const reviews = [
    {
      text: "Amazing quality and the design tool is so easy to use! My custom hoodie turned out exactly how I imagined.",
      author: "Sarah M.",
      rating: 5,
    },
    {
      text: "Fast shipping and great customer service. The WhatsApp support made ordering so convenient!",
      author: "Mike D.",
      rating: 5,
    },
    {
      text: "Love the streetwear aesthetic and the custom options. Finally found a brand that gets my style!",
      author: "Alex R.",
      rating: 5,
    },
  ];

  const instagramPosts = [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-black tracking-tight">EXPEROUTFIT</h1>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-neutral-600 hover:text-black transition-colors">Shop All</a>
              <a href="#" className="text-neutral-600 hover:text-black transition-colors">Custom Design</a>
              <a href="#" className="text-neutral-600 hover:text-black transition-colors">Collections</a>
              <a href="#" className="text-neutral-600 hover:text-black transition-colors">About</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-500">
                  3
                </Badge>
              </Button>
              <Button onClick={handleLogin} className="bg-black text-white hover:bg-neutral-800">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

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
                <Button onClick={handleLogin} className="bg-black text-white px-8 py-4 text-lg hover:bg-neutral-800">
                  Start Designing
                </Button>
                <Button variant="outline" className="px-8 py-4 text-lg">
                  Shop Collections
                </Button>
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
            {categories.map((category, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-xl bg-neutral-100 aspect-square mb-4">
                  <img 
                    src={category.image}
                    alt={`${category.name} Collection`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h4 className="font-semibold text-lg">{category.name}</h4>
                    <p className="text-sm opacity-90">{category.price}</p>
                  </div>
                </div>
              </div>
            ))}
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
              
              <Button onClick={handleLogin} className="bg-blue-500 text-white px-8 py-4 hover:bg-blue-600">
                Try Design Studio
              </Button>
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-xl bg-neutral-100 aspect-square mb-4">
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="bg-white p-2 rounded-full shadow-lg hover:bg-neutral-50">
                      <Heart className="h-4 w-4 text-neutral-400 hover:text-red-500" />
                    </Button>
                  </div>
                  {product.badge && (
                    <div className="absolute top-4 left-4">
                      <Badge className={product.badge === "Hot" ? "bg-red-500" : "bg-blue-500"}>
                        {product.badge}
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-neutral-900">{product.name}</h4>
                  <div className="flex items-center space-x-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < product.rating ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                    <span className="text-neutral-500 text-sm">({product.reviews})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-black">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-neutral-400 line-through text-sm">{product.originalPrice}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline" className="px-8 py-3">
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-black mb-4">Follow @experoutfit</h3>
            <p className="text-neutral-600">See how our community styles their custom designs</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {instagramPosts.map((post, index) => (
              <div key={index} className="aspect-square bg-neutral-100 rounded-lg overflow-hidden cursor-pointer group">
                <img 
                  src={post}
                  alt="Instagram post"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-black mb-4">What Our Customers Say</h3>
            <p className="text-neutral-600">Real feedback from our community</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <Card key={index} className="bg-neutral-50 p-6">
                <CardContent className="p-0">
                  <div className="flex text-yellow-400 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-neutral-700 mb-4">{review.text}</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-neutral-300 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-sm">{review.author}</p>
                      <p className="text-neutral-500 text-xs">Verified Customer</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <h4 className="text-2xl font-bold">EXPEROUTFIT</h4>
              <p className="text-neutral-300">
                Premium custom streetwear designed by you, crafted by us.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-neutral-300 hover:text-white p-0">
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-neutral-300 hover:text-white p-0">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-neutral-300 hover:text-white p-0">
                  <Facebook className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Shop</h5>
              <ul className="space-y-2 text-neutral-300">
                <li><a href="#" className="hover:text-white transition-colors">All Products</a></li>
                <li><a href="#" className="hover:text-white transition-colors">T-Shirts</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Hoodies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Accessories</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Custom Design</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-neutral-300">
                <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Newsletter</h5>
              <p className="text-neutral-300 mb-4">Get updates on new drops and exclusive designs</p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button className="w-full bg-blue-500 text-white hover:bg-blue-600">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-neutral-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-300 text-sm">© 2024 EXPEROUTFIT. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-neutral-300">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
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
