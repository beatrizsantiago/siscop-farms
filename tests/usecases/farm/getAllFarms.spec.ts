import GetAllFarmsUseCase from '../../../src/usecases/farms/getAllFarms';
import { FarmRepository } from '../../../src/domain/repositories/FarmRepository';

describe('GetAllFarmsUseCase', () => {
  it('should call repository.getAll and return the list of farms', async () => {
    const mockFarms = [
      {
        id: '1',
        name: 'Green Farm',
        geolocation: { _lat: 10, _long: 20 },
        available_products: ['Tomato'],
      },
      {
        id: '2',
        name: 'Blue Hills',
        geolocation: { _lat: 5, _long: 15 },
        available_products: ['Lettuce'],
      },
    ];

    const getAllMock = jest.fn().mockResolvedValue(mockFarms);

    const mockRepository: FarmRepository = {
      getAll: getAllMock,
    } as unknown as FarmRepository;

    const useCase = new GetAllFarmsUseCase(mockRepository);

    const result = await useCase.execute();

    expect(getAllMock).toHaveBeenCalled();
    expect(result).toEqual(mockFarms);
  });
});
