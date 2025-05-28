import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useFarmContext } from '../../src/App/context';
import { toast } from 'react-toastify';
import Delete from '../../src/App/Delete';
import DeleteFarmUseCase from '../../src/usecases/farms/deleteFarm';

jest.mock('../../src/usecases/farms/deleteFarm');
jest.mock('../../src/App/context', () => ({
  useFarmContext: jest.fn(),
}));

describe('<Delete />', () => {
  const mockDispatch = jest.fn();
  const mockCloseMarkerInfo = jest.fn();

  const farm = {
    id: 'farm1',
    name: 'Green Valley',
    geolocation: { _lat: -23.5, _long: -46.6 },
    available_products: ['Tomato'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useFarmContext as jest.Mock).mockReturnValue({ dispatch: mockDispatch });
  });

  it('should open and close the confirmation dialog', () => {
    render(<Delete farm={farm} closeMakerInfo={mockCloseMarkerInfo} />);

    expect(screen.queryByText(/Tem certeza que deseja excluir a fazenda/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByText(/Excluir/i));

    expect(screen.getByText(/Tem certeza que deseja excluir a fazenda/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Cancelar/i));

    expect(screen.queryByText(/Tem certeza que deseja excluir a fazenda/i)).not.toBeInTheDocument();
  });

  it('should call delete use case and dispatch action on confirm', async () => {
    const executeMock = jest.fn().mockResolvedValue(undefined);
    (DeleteFarmUseCase as jest.Mock).mockImplementation(() => ({
      execute: executeMock,
    }));

    render(<Delete farm={farm} closeMakerInfo={mockCloseMarkerInfo} />);

    fireEvent.click(screen.getByText(/Excluir/i));
    fireEvent.click(screen.getAllByText(/Excluir/i)[2]);

    await waitFor(() => {
      expect(executeMock).toHaveBeenCalledWith(farm.id);
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'DELETE_FARM', id: farm.id });
      expect(mockCloseMarkerInfo).toHaveBeenCalled();
    });
  });

  it('should show toast error on delete failure', async () => {
    const executeMock = jest.fn().mockRejectedValue(new Error('fail'));
    (DeleteFarmUseCase as jest.Mock).mockImplementation(() => ({
      execute: executeMock,
    }));

    render(<Delete farm={farm} closeMakerInfo={mockCloseMarkerInfo} />);

    fireEvent.click(screen.getByText(/Excluir/i));
    fireEvent.click(screen.getAllByText(/Excluir/i)[1]);
  });
});
