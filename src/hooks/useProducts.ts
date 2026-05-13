import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/services/api';
import { Product } from '@/data/products';

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ['products'],
   queryFn: async () => {
  try {
    const res = await productsApi.getApproved();
    return res?.data ?? [];
  } catch {
    return [];
  }
},
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useProduct(id: string | undefined) {
  return useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
  try {
    const res = await productsApi.getById(id!);
    return res?.data ?? null;
  } catch {
    return null;
  }
},
    enabled: !!id,
  });
}
