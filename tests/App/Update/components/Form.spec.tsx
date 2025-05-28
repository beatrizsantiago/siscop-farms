import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FormContainer from '../../../../src/App/Update/components/Form';
import UpdateFarmUseCase from '../../../../src/usecases/farms/updateFarm';
import { useFarmContext } from '../../../../src/App/context';
import useGetProducts from '../../../../src/hooks/useGetProducts';

jest.mock('../../../../src/usecases/farms/updateFarm');
jest.mock('../../../../src/App/context', () => ({
  useFarmContext: jest.fn(),
}));
jest.mock('../../../../src/hooks/useGetProducts');

const mockDispatch = jest.fn();
const mockHandleClose = jest.fn();

const mockFarm = {
  id: 'farm1',
  name: 'Green Fields',
  geolocation: { _lat: 10, _long: 20 },
  available_products: ['prod-1'],
};

const mockProducts = [
  { id: 'prod-1', name: 'Tomato' },
  { id: 'prod-2', name: 'Lettuce' },
];

describe('<FormContainer /> - Update Farm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useFarmContext as jest.Mock).mockReturnValue({ dispatch: mockDispatch });
    (useGetProducts as jest.Mock).mockReturnValue({
      products: mockProducts,
      loading: false,
    });
  });

  it('renders form with initial farm values', () => {
    render(<FormContainer farm={mockFarm} handleClose={mockHandleClose} />);
    expect(screen.getByDisplayValue('Green Fields')).toBeInTheDocument();
    expect(screen.getByText('Tomato')).toBeInTheDocument();
  });

  it('calls update use case and dispatches update on valid submit', async () => {
    const executeMock = jest.fn().mockResolvedValue({
      ...mockFarm,
      name: 'Updated Farm',
    });

    (UpdateFarmUseCase as jest.Mock).mockImplementation(() => ({
      execute: executeMock,
    }));

    render(<FormContainer farm={mockFarm} handleClose={mockHandleClose} />);

    const input = screen.getByLabelText(/Nome/i);
    fireEvent.change(input, { target: { value: 'Updated Farm' } });

    const button = screen.getByRole('button', { name :'Salvar' });
    fireEvent.click(button);

    await waitFor(() => {
      expect(executeMock).toHaveBeenCalledWith({
        id: 'farm1',
        name: 'Updated Farm',
        geolocation: { _lat: 10, _long: 20 },
        available_products: ['prod-1'],
      });

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UPDATE_FARM',
        item: {
          ...mockFarm,
          name: 'Updated Farm',
        },
      });

      expect(mockHandleClose).toHaveBeenCalled();
    });
  });
});
