import GetAllProductsUseCase from '../../../src/usecases/products/getAllProducts';
import { ProductRepository } from '../../../src/domain/repositories/ProductRepository';

describe('GetAllProductsUseCase', () => {
  it('should call repository.getAll and return the product list', async () => {
    const mockProducts = [
      { id: '1', name: 'Tomato', unit_value: 2.5, cycle_days: 10 },
      { id: '2', name: 'Lettuce', unit_value: 1.8, cycle_days: 7 },
    ];

    const getAllMock = jest.fn().mockResolvedValue(mockProducts);

    const mockRepository: ProductRepository = {
      getAll: getAllMock,
    } as unknown as ProductRepository;

    const useCase = new GetAllProductsUseCase(mockRepository);

    const result = await useCase.execute();

    expect(getAllMock).toHaveBeenCalled();
    expect(result).toEqual(mockProducts);
  });
});
