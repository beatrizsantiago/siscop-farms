import { FarmRepository } from '@domain/repositories/FarmRepository';


class DeleteFarmUseCase {
  constructor(private repository: FarmRepository) {}

  async execute(id: string) {
    return await this.repository.delete(id);
  };
};

export default DeleteFarmUseCase;
