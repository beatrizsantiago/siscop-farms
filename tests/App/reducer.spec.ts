import reducer from '../../src/App/reducer';
import { State, ActionType } from '../../src/App/types';

describe('farm reducer', () => {
  const initialState: State = {
    farms: [],
    loading: true,
  };

  it('should handle SET_FARMS', () => {
    const action: ActionType = {
      type: 'SET_FARMS',
      list: [
        { id: '1', name: 'Green Farm', geolocation: { _lat: 10, _long: 20 }, available_products: [] },
      ],
    };

    const result = reducer(initialState, action);

    expect(result.farms).toEqual(action.list);
    expect(result.loading).toBe(false);
  });

  it('should handle ADD_FARM', () => {
    const startState: State = {
      farms: [{ id: '1', name: 'Green Farm', geolocation: { _lat: 10, _long: 20 }, available_products: [] }],
      loading: false,
    };

    const newFarm = { id: '2', name: 'Blue Hills', geolocation: { _lat: 5, _long: 15 }, available_products: [] };

    const action: ActionType = {
      type: 'ADD_FARM',
      item: newFarm,
    };

    const result = reducer(startState, action);

    expect(result.farms).toHaveLength(2);
    expect(result.farms).toContainEqual(newFarm);
  });

  it('should handle UPDATE_FARM', () => {
    const startState: State = {
      farms: [
        { id: '1', name: 'Green Farm', geolocation: { _lat: 10, _long: 20 }, available_products: [] },
        { id: '2', name: 'Blue Hills', geolocation: { _lat: 5, _long: 15 }, available_products: [] },
      ],
      loading: false,
    };

    const updatedFarm = { id: '2', name: 'Updated Blue Hills', geolocation: { _lat: 5, _long: 15 }, available_products: ['Tomato'] };

    const action: ActionType = {
      type: 'UPDATE_FARM',
      item: updatedFarm,
    };

    const result = reducer(startState, action);

    expect(result.farms.find(f => f.id === '2')).toEqual(updatedFarm);
  });

  it('should handle DELETE_FARM', () => {
    const startState: State = {
      farms: [
        { id: '1', name: 'Green Farm', geolocation: { _lat: 10, _long: 20 }, available_products: [] },
        { id: '2', name: 'Blue Hills', geolocation: { _lat: 5, _long: 15 }, available_products: [] },
      ],
      loading: false,
    };

    const action: ActionType = {
      type: 'DELETE_FARM',
      id: '1',
    };

    const result = reducer(startState, action);

    expect(result.farms).toHaveLength(1);
    expect(result.farms.find(f => f.id === '1')).toBeUndefined();
  });

  it('should throw error for unhandled action type', () => {
    const action = { type: 'UNKNOWN_ACTION' } as unknown as ActionType;

    expect(() => reducer(initialState, action)).toThrow('Unhandled action');
  });
});
