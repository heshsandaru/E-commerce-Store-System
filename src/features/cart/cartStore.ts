import create from "zustand";
import type { Product } from "../../types/product";

type CartItem = { product: Product; qty: number };
type CartState = {
    items: CartItem[];
    add: (p: Product, qty?: number) => void;
    remove: (productId: string) => void;
    updateQty: (productId: string, qty: number) => void;
    clear: () => void;
    total: () => number;
};

const STORAGE_KEY = "ecom_cart_v1";

export const useCart = create<CartState>((set, get) => ({
    items: JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"),
    add: (product, qty = 1) => {
        const items = [...get().items];
        const idx = items.findIndex((i) => i.product.id === product.id);
        if (idx >= 0) items[idx].qty += qty;
        else items.push({ product, qty });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        set({ items });
    },
    remove: (productId) => {
        const items = get().items.filter((i) => i.product.id !== productId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        set({ items });
    },
    updateQty: (productId, qty) => {
        const items = get().items.map((i) => (i.product.id === productId ? { ...i, qty } : i));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        set({ items });
    },
    clear: () => {
        localStorage.removeItem(STORAGE_KEY);
        set({ items: [] });
    },
    total: () => get().items.reduce((s, i) => s + i.product.price * i.qty, 0),
}));
