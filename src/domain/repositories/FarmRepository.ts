import Farm from '@domain/entities/Farm';

export interface FarmRepository {
  add(farm: Farm): Promise<Farm>;
  getAll(): Promise<Farm[]>;
  update(farm: Farm): Promise<Farm>;
  isFarmReferenced(collectionName: string, farmId: string): Promise<boolean>;
  delete(id: string): Promise<void>;
  searchByName(searchText: string): Promise<Farm[]>;
};
