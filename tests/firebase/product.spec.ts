import { collection, query, getDocs } from 'firebase/firestore';
import { firebaseProduct } from '../../src/firebase/product';
import Product from '../../src/domain/entities/Product';

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  getDocs: jest.fn(),
}));

describe('FirebaseProduct', () => {
  const product: Product = {
    id: '123',
    name: 'Test Product',
    unit_value: 10,
    cycle_days: 30,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get all products', async () => {
    (collection as jest.Mock).mockReturnValue('mock-collection');
    (query as jest.Mock).mockReturnValue('mock-query');
    (getDocs as jest.Mock).mockResolvedValue({
      docs: [
        { id: '1', data: () => ({ name: 'A', unit_value: 1, cycle_days: 1 }) },
        { id: '2', data: () => ({ name: 'B', unit_value: 2, cycle_days: 2 }) },
      ]
    });

    const result = await firebaseProduct.getAll();

    expect(collection).toHaveBeenCalledWith(expect.anything(), 'products');
    expect(getDocs).toHaveBeenCalledWith('mock-query');

    expect(result).toEqual([
      { id: '1', name: 'A', unit_value: 1, cycle_days: 1 },
      { id: '2', name: 'B', unit_value: 2, cycle_days: 2 },
    ]);
  });
});
