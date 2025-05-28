import { firebaseProduct } from '@fb/product';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import GetAllProductsUseCase from '@usecases/products/getAllProducts';
import Product from '@domain/entities/Product';

const useGetProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false);

  const getProducts = useCallback(async () => {
    setLoading(true);
    try {
      const getUserCase = new GetAllProductsUseCase(firebaseProduct);
      const products = await getUserCase.execute();
      setProducts(products);
    } catch {
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return {
    products,
    loading,
  };
}

export default useGetProducts;
