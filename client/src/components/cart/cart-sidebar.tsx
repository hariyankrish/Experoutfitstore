import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, updateQuantity, removeItem, total, itemCount } = useCart();

  const subtotal = total;
  const shipping = subtotal >= 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const finalTotal = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              <span>Shopping Cart</span>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </SheetTitle>
          </SheetHeader>
          
          <div className="flex-1 flex items-center justify-center py-16">
            <div className="text-center">
              <ShoppingBag className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
              <p className="text-neutral-600 mb-6">Add some items to get started</p>
              <div className="space-y-2">
                <Link href="/shop">
                  <Button onClick={onClose} className="w-full bg-black text-white hover:bg-neutral-800">
                    Continue Shopping
                  </Button>
                </Link>
                <Link href="/design">
                  <Button onClick={onClose} variant="outline" className="w-full">
                    Create Custom Design
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Shopping Cart</span>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{itemCount}</Badge>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetTitle>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-start space-x-4 p-4 border rounded-lg">
              {/* Product Image */}
              <div className="w-16 h-16 bg-neutral-100 rounded-md overflow-hidden flex-shrink-0">
                <img
                  src={item.image || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm leading-tight mb-1">{item.name}</h4>
                
                {item.variant && (
                  <div className="text-xs text-neutral-600 mb-2">
                    {item.variant.color && <span>{item.variant.color}</span>}
                    {item.variant.color && item.variant.size && <span> • </span>}
                    {item.variant.size && <span>{item.variant.size}</span>}
                    {item.variant.placement && (
                      <>
                        <br />
                        <span>Placement: {item.variant.placement}</span>
                      </>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="h-6 w-6 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="h-6 w-6 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Price and Remove */}
                  <div className="text-right">
                    <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 h-auto p-0 text-xs"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="border-t pt-4 space-y-4">
          {/* Shipping Message */}
          {shipping > 0 && (
            <div className="bg-blue-50 p-3 rounded-lg">
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

          {/* Order Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>
                {shipping === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  `$${shipping.toFixed(2)}`
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Link href="/checkout">
              <Button 
                onClick={onClose}
                className="w-full bg-black text-white hover:bg-neutral-800"
              >
                Secure Checkout
              </Button>
            </Link>
            <Link href="/cart">
              <Button 
                onClick={onClose}
                variant="outline" 
                className="w-full"
              >
                View Full Cart
              </Button>
            </Link>
          </div>

          {/* Security Info */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 text-xs text-neutral-600">
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
