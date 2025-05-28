import { render, screen, fireEvent } from '@testing-library/react';
import Add from '../../../src/App/Add';

jest.mock('../../../src/App/Add/components/Form', () => ({ handleClose }: any) => (
  <div data-testid="form-mock">
    FormMock
    <button onClick={handleClose}>Close</button>
  </div>
));

describe('<Add />', () => {
  it('should open dialog when "Adicionar" button is clicked', () => {
    render(<Add />);

    expect(screen.queryByText(/Nova fazenda/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByText(/Adicionar/i));

    expect(screen.getByText(/Nova fazenda/i)).toBeInTheDocument();
    expect(screen.getByTestId('form-mock')).toBeInTheDocument();
  });

  it('should close dialog when handleClose is called from Form', () => {
    render(<Add />);

    fireEvent.click(screen.getByText(/Adicionar/i));
    expect(screen.getByText(/Nova fazenda/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByText(/Nova fazenda/i)).not.toBeInTheDocument();
  });
});
