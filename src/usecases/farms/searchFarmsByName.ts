import { FarmRepository } from '@domain/repositories/FarmRepository';
import { capitalizeFirstLetter } from '@utils/dataAdapters';


class SearchFarmsByNameUseCase {
  constructor(private repository: FarmRepository) {}

  async execute(searchText: string) {
    const list = await this.repository.searchByName(
      capitalizeFirstLetter(searchText.trim()),
    );
    return list;
  };
};

export default SearchFarmsByNameUseCase;
