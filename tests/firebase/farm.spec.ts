import { firebaseFarm } from '../../src/firebase/farm';
import {
  addDoc,
  deleteDoc,
  getDocs,
  updateDoc,
  query,
  doc,
} from 'firebase/firestore';

jest.mock('firebase/firestore', () => {
  const original = jest.requireActual('firebase/firestore');
  return {
    ...original,
    addDoc: jest.fn(),
    collection: jest.fn(),
    deleteDoc: jest.fn(),
    doc: jest.fn(),
    getDocs: jest.fn(),
    updateDoc: jest.fn(),
    query: jest.fn(),
    orderBy: jest.fn(),
    startAt: jest.fn(),
    endAt: jest.fn(),
  };
});

describe('FirebaseFarm', () => {
  const mockFarm = {
    id: 'farm123',
    name: 'Green Fields',
    geolocation: { lat: 10, lng: 20 },
    available_products: ['Tomato', 'Lettuce'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add a new farm and return it with generated ID', async () => {
    (addDoc as jest.Mock).mockResolvedValue({ id: 'farm123' });

    const result = await firebaseFarm.add({ ...mockFarm, id: '' });

    expect(addDoc).toHaveBeenCalled();
    expect(result).toEqual({ ...mockFarm });
  });

  it('should get all farms from Firestore', async () => {
    const mockSnapshot = {
      docs: [
        {
          id: 'farm1',
          data: () => ({
            name: 'Farm A',
            geolocation: { lat: 0, lng: 0 },
            available_products: [],
          }),
        },
        {
          id: 'farm2',
          data: () => ({
            name: 'Farm B',
            geolocation: { lat: 1, lng: 1 },
            available_products: ['Banana'],
          }),
        },
      ],
    };

    (getDocs as jest.Mock).mockResolvedValue(mockSnapshot);

    const result = await firebaseFarm.getAll();

    expect(getDocs).toHaveBeenCalled();
    expect(result).toEqual([
      { id: 'farm1', name: 'Farm A', geolocation: { lat: 0, lng: 0 }, available_products: [] },
      { id: 'farm2', name: 'Farm B', geolocation: { lat: 1, lng: 1 }, available_products: ['Banana'] },
    ]);
  });

  it('should update an existing farm', async () => {
    (doc as jest.Mock).mockReturnValue({});
    (updateDoc as jest.Mock).mockResolvedValue(undefined);
    await firebaseFarm.update(mockFarm);

    expect(updateDoc).toHaveBeenCalledWith(
      {},
      {
        name: mockFarm.name,
        geolocation: mockFarm.geolocation,
        available_products: mockFarm.available_products,
      }
    );
  });

  it('should delete a farm by ID', async () => {
    await firebaseFarm.delete(mockFarm.id);

    expect(deleteDoc).toHaveBeenCalledWith(expect.anything());
  });

  it('should search farms by name', async () => {
    const mockSnapshot = {
      docs: [
        {
          id: 'farmX',
          data: () => ({
            name: 'Green Fields',
            geolocation: { lat: 10, lng: 20 },
            available_products: ['Tomato'],
          }),
        },
      ],
    };

    (getDocs as jest.Mock).mockResolvedValue(mockSnapshot);

    const result = await firebaseFarm.searchByName('Green');

    expect(query).toHaveBeenCalled();
    expect(result).toEqual([
      {
        id: 'farmX',
        name: 'Green Fields',
        geolocation: { lat: 10, lng: 20 },
        available_products: ['Tomato'],
      },
    ]);
  });
});
