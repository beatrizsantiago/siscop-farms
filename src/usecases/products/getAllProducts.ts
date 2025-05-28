import { ProductRepository } from '@domain/repositories/ProductRepository';


class GetAllProductsUseCase {
  constructor(private repository: ProductRepository) {}

  async execute() {
    const list = await this.repository.getAll();
    return list;
  };
};

export default GetAllProductsUseCase;
