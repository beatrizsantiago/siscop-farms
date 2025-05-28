import SearchFarmsByNameUseCase from '../../../src/usecases/farms/searchFarmsByName';
import { FarmRepository } from '../../../src/domain/repositories/FarmRepository';
import * as dataAdapters from '../../../src/utils/dataAdapters';

describe('SearchFarmsByNameUseCase', () => {
  it('should trim and capitalize the search text and call repository.searchByName', async () => {
    const rawSearch = '   green hills ';
    const formattedSearch = 'Green hills';

    const mockFarms = [
      {
        id: '1',
        name: 'Green Hills',
        geolocation: { _lat: 10, _long: 20 },
        available_products: ['Tomato'],
      },
    ];

    const capitalizeSpy = jest
      .spyOn(dataAdapters, 'capitalizeFirstLetter')
      .mockReturnValue(formattedSearch);

    const searchByNameMock = jest.fn().mockResolvedValue(mockFarms);

    const mockRepository: FarmRepository = {
      searchByName: searchByNameMock,
    } as unknown as FarmRepository;

    const useCase = new SearchFarmsByNameUseCase(mockRepository);

    const result = await useCase.execute(rawSearch);

    expect(capitalizeSpy).toHaveBeenCalledWith(rawSearch.trim());
    expect(searchByNameMock).toHaveBeenCalledWith(formattedSearch);
    expect(result).toEqual(mockFarms);
  });
});
