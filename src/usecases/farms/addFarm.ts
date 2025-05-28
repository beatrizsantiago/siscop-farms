import { FarmRepository } from '@domain/repositories/FarmRepository';
import { capitalizeFirstLetter } from '@utils/dataAdapters';
import Farm from '@domain/entities/Farm';

type AddFarmParams = {
  name: string;
  _lat: number;
  _long: number;
  available_products: string[];
};

class AddFarmUseCase {
  constructor(private repository: FarmRepository) {}

  async execute(params: AddFarmParams) {
    const farm = new Farm(
      '',
      capitalizeFirstLetter(params.name.trim()),
      {
        _lat: params._lat,
        _long: params._long,
      },
      params.available_products,
    );
  
    return await this.repository.add(farm);
  }
};

export default AddFarmUseCase;