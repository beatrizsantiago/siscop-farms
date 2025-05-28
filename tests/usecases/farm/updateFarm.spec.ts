import UpdateFarmUseCase from '../../../src/usecases/farms/updateFarm';
import { FarmRepository } from '../../../src/domain/repositories/FarmRepository';
import Farm from '../../../src/domain/entities/Farm';
import * as dataAdapters from '../../../src/utils/dataAdapters';

describe('UpdateFarmUseCase', () => {
  it('should create a farm with formatted name and call repository.update', async () => {
    const inputFarm: Farm = {
      id: '1',
      name: ' green valley ',
      geolocation: { _lat: -10, _long: 20 },
      available_products: ['Lettuce', 'Tomato'],
    };

    const formattedName = 'Green valley';

    const capitalizeSpy = jest
      .spyOn(dataAdapters, 'capitalizeFirstLetter')
      .mockReturnValue(formattedName);

    const updateMock = jest.fn().mockResolvedValue({
      ...inputFarm,
      name: formattedName,
    });

    const mockRepository: FarmRepository = {
      update: updateMock,
    } as unknown as FarmRepository;

    const useCase = new UpdateFarmUseCase(mockRepository);

    const result = await useCase.execute(inputFarm);

    expect(capitalizeSpy).toHaveBeenCalledWith(inputFarm.name.trim());

    const expectedFarm = new Farm(
      inputFarm.id,
      formattedName,
      inputFarm.geolocation,
      inputFarm.available_products
    );

    expect(updateMock).toHaveBeenCalledWith(expectedFarm);
    expect(result).toEqual(expect.objectContaining({ name: formattedName }));
  });
});
