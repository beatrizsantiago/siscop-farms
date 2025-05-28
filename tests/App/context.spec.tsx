import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { toast } from 'react-toastify';
import { FarmProvider, useFarmContext } from '../../src/App/context';

import GetAllFarmsUseCase from '../../src/usecases/farms/getAllFarms';
import SearchFarmsUseCase from '../../src/usecases/farms/searchFarmsByName';

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock('../../src/usecases/farms/getAllFarms');
jest.mock('../../src/usecases/farms/searchFarmsByName');

const mockFarms = [
  {
    id: '1',
    name: 'Green Farm',
    geolocation: { _lat: -10, _long: 30 },
    available_products: ['Tomato'],
  },
  {
    id: '2',
    name: 'Blue Hills',
    geolocation: { _lat: 5, _long: 15 },
    available_products: ['Lettuce'],
  },
];

const ConsumerComponent = () => {
  const { state, onSearch } = useFarmContext();

  return (
    <div>
      <div data-testid="farm-count">{state.farms.length}</div>
      <button onClick={() => onSearch('Green')}>Search</button>
    </div>
  );
};

describe('<FarmProvider />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load farms on mount using GetAllFarmsUseCase', async () => {
    const executeMock = jest.fn().mockResolvedValue(mockFarms);
    (GetAllFarmsUseCase as jest.Mock).mockImplementation(() => ({
      execute: executeMock,
    }));

    render(
      <FarmProvider>
        <ConsumerComponent />
      </FarmProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('farm-count').textContent).toBe('2');
    });

    expect(executeMock).toHaveBeenCalledTimes(1);
  });

  it('should call SearchFarmsUseCase on onSearch and update context', async () => {
    const searchResult = [mockFarms[0]];

    const executeMock = jest.fn().mockResolvedValue(searchResult);
    (SearchFarmsUseCase as jest.Mock).mockImplementation(() => ({
      execute: executeMock,
    }));

    render(
      <FarmProvider>
        <ConsumerComponent />
      </FarmProvider>
    );

    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getByTestId('farm-count').textContent).toBe('1');
    });

    expect(executeMock).toHaveBeenCalledWith('Green');
  });

  it('should show toast error if GetAllFarmsUseCase fails', async () => {
    const executeMock = jest.fn().mockRejectedValue(new Error('fail'));
    (GetAllFarmsUseCase as jest.Mock).mockImplementation(() => ({
      execute: executeMock,
    }));

    render(
      <FarmProvider>
        <ConsumerComponent />
      </FarmProvider>
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erro ao carregar as fazendas');
    });
  });

  it('should show toast error if SearchFarmsUseCase fails', async () => {
    const executeMock = jest.fn().mockRejectedValue(new Error('fail'));
    (SearchFarmsUseCase as jest.Mock).mockImplementation(() => ({
      execute: executeMock,
    }));

    render(
      <FarmProvider>
        <ConsumerComponent />
      </FarmProvider>
    );

    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erro ao pesquisar as fazendas');
    });
  });
});
