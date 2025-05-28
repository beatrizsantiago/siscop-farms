import Farm from '@domain/entities/Farm';

export interface FarmRepository {
  add(farm: Farm): Promise<Farm>;
  getAll(): Promise<Farm[]>;
  update(farm: Farm): Promise<Farm>;
  delete(id: string): Promise<void>;
  searchByName(searchText: string): Promise<Farm[]>;
};
