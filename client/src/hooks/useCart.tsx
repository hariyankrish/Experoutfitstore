import { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface CartItem {
  id: string;
  productId?: string;
  customDesignId?: string;
  name: string;
  price: number;
  quantity: number;
  variant?: { color?: string; size?: string };
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useLocalStorage<CartItem[]>("cart", []);

  const addItem: CartContextType["addItem"] = (item) => {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.id === item.id);
      if (i >= 0) {
        const copy = [...prev];
        copy[i] = { ...copy[i], quantity: copy[i].quantity + 1 };
        return copy;
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem: CartContextType["removeItem"] = (id) =>
    setItems((prev) => prev.filter((x) => x.id !== id));

  const updateQuantity: CartContextType["updateQuantity"] = (id, quantity) =>
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, quantity: Math.max(0, quantity) } : x)).filter((x) => x.quantity > 0)
    );

  const clearCart: CartContextType["clearCart"] = () => setItems([]);

  const itemCount = useMemo(() => items.reduce((n, x) => n + x.quantity, 0), [items]);
  const total = useMemo(() => items.reduce((s, x) => s + x.price * x.quantity, 0), [items]);

  return (
    <CartContext.Provider value={{ items, itemCount, total, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}