import { useQuery } from "@tanstack/react-query";

interface ProductFilters {
  categoryId?: string;
  featured?: boolean;
  search?: string;
}

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ["/api/products", filters],
    select: (data) => data || [],
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["/api/products", id],
    enabled: !!id,
  });
}

export function useFeaturedProducts() {
  return useProducts({ featured: true });
}

export function useProductsByCategory(categoryId: string) {
  return useProducts({ categoryId });
}

export function useProductSearch(searchQuery: string) {
  return useProducts({ search: searchQuery });
}
