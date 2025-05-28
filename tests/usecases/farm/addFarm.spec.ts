import AddFarmUseCase from '../../../src/usecases/farms/addFarm';
import { FarmRepository } from '../../../src/domain/repositories/FarmRepository';
import Farm from '../../../src/domain/entities/Farm';
import * as dataAdapters from '../../../src/utils/dataAdapters';

describe('AddFarmUseCase', () => {
  it('should create a farm with capitalized name and call repository.add', async () => {
    const params = {
      name: ' green valley ',
      _lat: -23.5,
      _long: -46.6,
      available_products: ['Tomato', 'Lettuce'],
    };

    const expectedName = 'Green valley';

    const capitalizeSpy = jest
      .spyOn(dataAdapters, 'capitalizeFirstLetter')
      .mockReturnValue(expectedName);

    const addMock = jest.fn().mockResolvedValue({
      id: '123',
      name: expectedName,
      geolocation: {
        _lat: params._lat,
        _long: params._long,
      },
      available_products: params.available_products,
    });

    const mockRepository = {
      add: addMock,
    } as unknown as FarmRepository;

    const useCase = new AddFarmUseCase(mockRepository);

    const result = await useCase.execute(params);

    expect(capitalizeSpy).toHaveBeenCalledWith(params.name.trim());

    const expectedFarm = new Farm(
      '',
      expectedName,
      { _lat: params._lat, _long: params._long },
      params.available_products,
    );

    expect(addMock).toHaveBeenCalledWith(expectedFarm);
    expect(result).toEqual(expect.objectContaining({ id: '123', name: expectedName }));
  });
});
