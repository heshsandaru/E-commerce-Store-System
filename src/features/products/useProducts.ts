import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/client";
import type { Product } from "../../types/product";

type ListParams = { page?: number; pageSize?: number; q?: string; sort?: string; category?: string };

export const fetchProducts = async (params: ListParams = {}) => {
    const { data } = await api.get("/products", { params });
    return data as { items: Product[]; total: number; page: number; pageSize: number };
};

export const useProducts = (params: ListParams) => {
    return useQuery(["products", params], () => fetchProducts(params), {
        keepPreviousData: true,
        staleTime: 1000 * 60 * 1,
    });
};

export const fetchProductById = async (id: string) => {
    const { data } = await api.get(`/products/${id}`);
    return data as Product;
};

export const useProduct = (id?: string) => {
    return useQuery(["product", id], () => fetchProductById(id!), { enabled: !!id });
};
