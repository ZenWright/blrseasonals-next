"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { Product } from "@/types/product";

type CartItem = {
  product: Product;
  quantity: number;
};

type CartNotice = {
  productId: string;
  type: "adjusted" | "out_of_stock";
  message: string;
};

type CartContextType = {
  cartItems: CartItem[];
  notices: CartNotice[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

const CART_STORAGE_KEY = "blr-seasonals-cart";
const PRODUCTS_API_URL = "http://127.0.0.1:8000/products";

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [notices, setNotices] = useState<CartNotice[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // --------------------------------------------------
  // 1. Load saved cart
  // --------------------------------------------------
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        }
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // --------------------------------------------------
  // 2. Sync cart with latest MySQL/FastAPI products
  // --------------------------------------------------
  useEffect(() => {
    if (!isLoaded || cartItems.length === 0) {
      return;
    }

    const syncCartWithDatabase = async () => {
      try {
        const response = await fetch(PRODUCTS_API_URL, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Products API returned ${response.status}`
          );
        }

        const products: Product[] = await response.json();

        setCartItems((currentItems) => {
          const updatedItems: CartItem[] = [];
          const newNotices: CartNotice[] = [];

          for (const item of currentItems) {
            const latestProduct = products.find(
              (product) => product.id === item.product.id
            );

            // --------------------------------------------------
            // Product no longer exists
            // --------------------------------------------------
            if (!latestProduct) {
              newNotices.push({
                productId: item.product.id,
                type: "out_of_stock",
                message:
                  `${item.product.name} is no longer available.`,
              });

              updatedItems.push(item);
              continue;
            }

            // --------------------------------------------------
            // Product is out of stock
            // --------------------------------------------------
            if (latestProduct.inventory <= 0) {
              newNotices.push({
                productId: latestProduct.id,
                type: "out_of_stock",
                message:
                  `${latestProduct.name} is currently out of stock.`,
              });

              updatedItems.push({
                product: latestProduct,
                quantity: item.quantity,
              });

              continue;
            }

            // --------------------------------------------------
            // Inventory is lower than cart quantity
            // --------------------------------------------------
            if (item.quantity > latestProduct.inventory) {
              newNotices.push({
                productId: latestProduct.id,
                type: "adjusted",
                message:
                  `Only ${latestProduct.inventory} available for ${latestProduct.name}. Your quantity has been adjusted.`,
              });
            }

            const safeQuantity = Math.min(
              Math.max(1, item.quantity),
              latestProduct.inventory
            );

            updatedItems.push({
              product: latestProduct,
              quantity: safeQuantity,
            });
          }

          setNotices(newNotices);

          return updatedItems;
        });
      } catch (error) {
        // Keep the existing cart if the backend is temporarily unavailable.
        console.error(
          "Failed to sync cart with latest inventory:",
          error
        );
      }
    };

    syncCartWithDatabase();
  }, [isLoaded]);

  // --------------------------------------------------
  // 3. Save cart
  // --------------------------------------------------
  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cartItems)
      );
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  }, [cartItems, isLoaded]);

  // --------------------------------------------------
  // 4. Add product
  // --------------------------------------------------
  const addToCart = (
    product: Product,
    quantity: number = 1
  ) => {
    if (product.inventory <= 0) {
      setNotices((currentNotices) => [
        ...currentNotices.filter(
          (notice) => notice.productId !== product.id
        ),
        {
          productId: product.id,
          type: "out_of_stock",
          message: `${product.name} is currently out of stock.`,
        },
      ]);

      return;
    }

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        const newQuantity = Math.min(
          existingItem.quantity + quantity,
          product.inventory
        );

        return currentItems.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                product,
                quantity: newQuantity,
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          product,
          quantity: Math.min(
            Math.max(1, quantity),
            product.inventory
          ),
        },
      ];
    });
  };

  // --------------------------------------------------
  // 5. Remove product
  // --------------------------------------------------
  const removeFromCart = (productId: string) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) => item.product.id !== productId
      )
    );

    setNotices((currentNotices) =>
      currentNotices.filter(
        (notice) => notice.productId !== productId
      )
    );
  };

  // --------------------------------------------------
  // 6. Update quantity
  // --------------------------------------------------
  const updateQuantity = (
    productId: string,
    quantity: number
  ) => {
    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (item.product.id !== productId) {
          return item;
        }

        const safeQuantity = Math.max(
          1,
          Math.min(quantity, item.product.inventory)
        );

        return {
          ...item,
          quantity: safeQuantity,
        };
      })
    );
  };

  // --------------------------------------------------
  // 7. Clear cart
  // --------------------------------------------------
  const clearCart = () => {
    setCartItems([]);
    setNotices([]);
  };

  // --------------------------------------------------
  // 8. Total number of items
  // --------------------------------------------------
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // --------------------------------------------------
  // 9. Total price
  // --------------------------------------------------
  const cartSubtotal = cartItems.reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        notices,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}