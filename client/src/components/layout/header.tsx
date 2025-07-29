import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search, User, ShoppingCart, Menu, Heart } from "lucide-react";

interface HeaderProps {
  onCartOpen: () => void;
}

export default function Header({ onCartOpen }: HeaderProps) {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const navItems = [
    { href: "/shop", label: "Shop All" },
    { href: "/design", label: "Custom Design" },
    { href: "/shop?category=collections", label: "Collections" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <h1 className="text-2xl font-bold text-black tracking-tight cursor-pointer">
                EXPEROUTFIT
              </h1>
            </Link>
          </div>
          
          {/* Navigation - Desktop */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a className={`transition-colors ${
                  location === item.href 
                    ? "text-black font-medium" 
                    : "text-neutral-600 hover:text-black"
                }`}>
                  {item.label}
                </a>
              </Link>
            ))}
          </nav>
          
          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Search - Desktop */}
            <div className="hidden md:block">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              </form>
            </div>

            {/* Search - Mobile */}
            <Button variant="ghost" size="sm" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>

            {/* Wishlist */}
            <Button variant="ghost" size="sm">
              <Heart className="h-5 w-5" />
            </Button>

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {user?.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt="Profile"
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/account">My Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account?tab=orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account?tab=designs">My Designs</Link>
                  </DropdownMenuItem>
                  {user?.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Panel</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => window.location.href = "/api/login"}>
                <User className="h-5 w-5" />
              </Button>
            )}

            {/* Cart */}
            <Button variant="ghost" size="sm" className="relative" onClick={onCartOpen}>
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-500">
                  {itemCount}
                </Badge>
              )}
            </Button>

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    </div>
                  </form>

                  {/* Mobile Navigation */}
                  <nav className="flex flex-col space-y-2">
                    {navItems.map((item) => (
                      <Link key={item.href} href={item.href}>
                        <a className="block px-3 py-2 text-base font-medium text-neutral-700 hover:text-black hover:bg-neutral-50 rounded-md">
                          {item.label}
                        </a>
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile User Actions */}
                  {isAuthenticated ? (
                    <div className="border-t border-neutral-200 pt-4 space-y-2">
                      <Link href="/account">
                        <a className="block px-3 py-2 text-base font-medium text-neutral-700 hover:text-black hover:bg-neutral-50 rounded-md">
                          My Account
                        </a>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-3 py-2 text-base font-medium text-neutral-700 hover:text-black"
                        onClick={handleLogout}
                      >
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="border-t border-neutral-200 pt-4">
                      <Button
                        className="w-full bg-black text-white hover:bg-neutral-800"
                        onClick={() => window.location.href = "/api/login"}
                      >
                        Sign In
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
