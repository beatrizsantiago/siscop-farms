import { render, screen, fireEvent } from '@testing-library/react';
import Update from '../../../src/App/Update';
import Farm from '../../../src/domain/entities/Farm';

jest.mock('../../../src/App/Update/components/Form', () => () => <div data-testid="mock-form">Mocked Form</div>);

const mockFarm = new Farm(
  'farm-123',
  'Green Fields',
  { _lat: 10, _long: 20 },
  ['prod-1']
);

describe('<Update />', () => {
  it('should open the dialog with the form when "Editar" button is clicked', () => {
    render(<Update farm={mockFarm} />);

    expect(screen.queryByTestId('mock-form')).not.toBeInTheDocument();

    const editButton = screen.getByRole('button', { name: /editar/i });
    fireEvent.click(editButton);

    expect(screen.getByText(/Atualizar/i)).toBeInTheDocument();
    expect(screen.getByText(/Green Fields/i)).toBeInTheDocument();
    expect(screen.getByTestId('mock-form')).toBeInTheDocument();
  });
});
