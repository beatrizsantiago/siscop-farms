import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useFarmContext } from '../../../../src/App/context';
import useGetProducts from '../../../../src/hooks/useGetProducts';
import FormContainer from '../../../../src/App/Add/components/Form';
import AddFarmUseCase from '../../../../src/usecases/farms/addFarm';

jest.mock('../../../../src/hooks/useGetProducts');
jest.mock('../../../../src/usecases/farms/addFarm');

jest.mock('../../../../src/App/context', () => ({
  useFarmContext: jest.fn(),
}));

describe('<FormContainer />', () => {
  const mockDispatch = jest.fn();
  const mockHandleClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useFarmContext as jest.Mock).mockReturnValue({ dispatch: mockDispatch });

    (useGetProducts as jest.Mock).mockReturnValue({
      products: [
        { id: '1', name: 'Tomato', unit_value: 2, cycle_days: 5 },
        { id: '2', name: 'Lettuce', unit_value: 1.5, cycle_days: 3 },
      ],
      loading: false,
    });
  });

  it('should submit the form when all fields are filled', async () => {
    const responseMock = {
      id: 'farm-123',
      name: 'Test Farm',
      geolocation: { _lat: -23.5, _long: -46.6 },
      available_products: ['1'],
    };

    (AddFarmUseCase as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue(responseMock),
    }));

    render(<FormContainer handleClose={mockHandleClose} />);

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'Test Farm' } });

    fireEvent.mouseDown(screen.getByLabelText(/Produtos da fazenda/i));
    fireEvent.click(screen.getByText('Tomato'));

    fireEvent.click(screen.getByTestId('google-map'));

    fireEvent.click(screen.getByText(/Cadastrar/i));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'ADD_FARM',
        item: responseMock,
      });

      expect(mockHandleClose).toHaveBeenCalled();
    });
  });
});
