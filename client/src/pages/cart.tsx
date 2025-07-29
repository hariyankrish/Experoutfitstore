import { useState, useMemo } from "react";
import { useCart } from "@/hooks/useCart";
import { Link } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";

export default function Cart() {
  const { items, updateQuantity, removeItem, total } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const subtotal = total;
  const shipping = subtotal >= 50 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const finalTotal = subtotal + shipping + tax - discount;

  const handlePromoCode = () => {
    // Simple promo code logic
    if (promoCode.toLowerCase() === "welcome10") {
      setDiscount(subtotal * 0.1);
    } else if (promoCode.toLowerCase() === "save5") {
      setDiscount(5);
    } else {
      setDiscount(0);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header onCartOpen={() => {}} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="h-24 w-24 text-neutral-300 mx-auto mb-8" />
            <h1 className="text-3xl font-bold text-black mb-4">Your Cart is Empty</h1>
            <p className="text-neutral-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added anything to your cart yet. 
              Start shopping to fill it up!
            </p>
            <div className="space-x-4">
              <Link href="/shop">
                <Button className="bg-black text-white hover:bg-neutral-800">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/design">
                <Button variant="outline">
                  Create Custom Design
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onCartOpen={() => {}} />

      {/* Breadcrumb */}
      <div className="bg-neutral-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm text-neutral-600">
            <span>Home</span>
            <span>/</span>
            <span className="text-black font-medium">Shopping Cart</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-black">Shopping Cart</h1>
              <span className="text-neutral-600">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-black mb-1">
                          {item.name}
                        </h3>
                        {item.variant && (
                          <div className="text-sm text-neutral-600 mb-2">
                            {item.variant.color && <span>Color: {item.variant.color}</span>}
                            {item.variant.color && item.variant.size && <span className="mx-2">•</span>}
                            {item.variant.size && <span>Size: {item.variant.size}</span>}
                            {item.variant.placement && (
                              <>
                                <span className="mx-2">•</span>
                                <span>Placement: {item.variant.placement}</span>
                              </>
                            )}
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-medium w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-neutral-600">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-neutral-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-8">
              <Link href="/shop">
                <Button variant="outline">
                  ← Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Promo Code</label>
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline" onClick={handlePromoCode}>
                      Apply
                    </Button>
                  </div>
                  {discount > 0 && (
                    <p className="text-green-600 text-sm mt-2">
                      Promo code applied! You saved ${discount.toFixed(2)}
                    </p>
                  )}
                </div>

                <Separator className="mb-6" />

                {/* Order Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Free Shipping Message */}
                {shipping > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <p className="text-blue-800 text-sm">
                      Add ${(50 - subtotal).toFixed(2)} more to get free shipping!
                    </p>
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (subtotal / 50) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Checkout Button */}
                <Link href="/checkout">
                  <Button className="w-full bg-black text-white hover:bg-neutral-800 py-3">
                    Proceed to Checkout
                  </Button>
                </Link>

                {/* Security Badges */}
                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center space-x-4 text-sm text-neutral-600">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Secure Checkout</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Fast Shipping</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
