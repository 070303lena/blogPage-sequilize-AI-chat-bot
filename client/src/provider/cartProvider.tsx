import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/api";
import type { CartItem } from "../types";

type CartContextType = {
    cart: CartItem[];
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
    totalCount: number;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCartContext = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCartContext must be used within provider");
    }
    return context;
};

export const CartContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        api("cart")
            .then(res => res.json())
            .then(data => setCart(data.result || []));
    }, []);

    const totalCount = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    return (
        <CartContext.Provider value={{ cart, setCart, totalCount }}>
            {children}
        </CartContext.Provider>
    );
};