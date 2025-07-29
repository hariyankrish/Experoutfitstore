import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Instagram, Twitter, Facebook } from "lucide-react";

export default function Footer() {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter subscription would be handled here
    console.log("Newsletter subscription");
  };

  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
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
          
          {/* Shop Links */}
          <div>
            <h5 className="font-semibold mb-4">Shop</h5>
            <ul className="space-y-2 text-neutral-300">
              <li>
                <Link href="/shop">
                  <a className="hover:text-white transition-colors">All Products</a>
                </Link>
              </li>
              <li>
                <Link href="/shop?category=t-shirts">
                  <a className="hover:text-white transition-colors">T-Shirts</a>
                </Link>
              </li>
              <li>
                <Link href="/shop?category=hoodies">
                  <a className="hover:text-white transition-colors">Hoodies</a>
                </Link>
              </li>
              <li>
                <Link href="/shop?category=accessories">
                  <a className="hover:text-white transition-colors">Accessories</a>
                </Link>
              </li>
              <li>
                <Link href="/design">
                  <a className="hover:text-white transition-colors">Custom Design</a>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support Links */}
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
          
          {/* Newsletter */}
          <div>
            <h5 className="font-semibold mb-4">Newsletter</h5>
            <p className="text-neutral-300 mb-4">Get updates on new drops and exclusive designs</p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-400 focus:ring-blue-500"
              />
              <Button className="w-full bg-blue-500 text-white hover:bg-blue-600">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        
        <Separator className="border-neutral-700 mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-300 text-sm">© 2024 EXPEROUTFIT. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-neutral-300">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
