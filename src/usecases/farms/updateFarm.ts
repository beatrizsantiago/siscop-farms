import { FarmRepository } from '@domain/repositories/FarmRepository';
import { capitalizeFirstLetter } from '@utils/dataAdapters';
import Farm from '@domain/entities/Farm';

class UpdateFarmUseCase {
  constructor(private repository: FarmRepository) {}

  async execute(params: Farm) {
    const farm = new Farm(
      params.id,
      capitalizeFirstLetter(params.name.trim()),
      params.geolocation,
      params.available_products,
    );
  
    return await this.repository.update(farm);
  }
};

export default UpdateFarmUseCase;
