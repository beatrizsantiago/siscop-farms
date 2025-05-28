import DeleteFarmUseCase from '../../../src/usecases/farms/deleteFarm';
import { FarmRepository } from '../../../src/domain/repositories/FarmRepository';

describe('DeleteFarmUseCase', () => {
  it('should call repository.delete with the correct farm ID', async () => {
    const deleteMock = jest.fn().mockResolvedValue(undefined);

    const mockRepository = {
      delete: deleteMock,
    } as unknown as FarmRepository;

    const useCase = new DeleteFarmUseCase(mockRepository);
    const farmId = 'farm123';

    const result = await useCase.execute(farmId);

    expect(deleteMock).toHaveBeenCalledWith(farmId);
    expect(result).toBeUndefined();
  });
});
