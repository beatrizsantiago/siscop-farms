import { renderHook, act } from '@testing-library/react';
import { toast } from 'react-toastify';
import useGetProducts from '../../src/hooks/useGetProducts';
import GetAllProductsUseCase from '../../src/usecases/products/getAllProducts';

jest.mock('../../src/usecases/products/getAllProducts');

describe('useGetProducts', () => {
  const mockProducts = [
    { id: '1', name: 'Product A', unit_value: 10, cycle_days: 5 },
    { id: '2', name: 'Product B', unit_value: 20, cycle_days: 10 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load and expose products from GetAllProductsUseCase', async () => {
    (GetAllProductsUseCase as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue(mockProducts),
    }));

    const { result } = renderHook(() => useGetProducts());

    expect(result.current.loading).toBe(true);

    await act(async () => {});

    expect(result.current.loading).toBe(false);
    expect(result.current.products).toEqual(mockProducts);
  });

  it('should call toast.error if loading products fails', async () => {
    (GetAllProductsUseCase as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockRejectedValue(new Error('Failed')),
    }));

    const { result } = renderHook(() => useGetProducts());

    await act(async () => {});

    expect(toast.error).toHaveBeenCalledWith('Erro ao carregar produtos');
    expect(result.current.products).toEqual([]);
    expect(result.current.loading).toBe(false);
  });
});
