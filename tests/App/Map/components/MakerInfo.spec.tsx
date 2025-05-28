import { render, screen } from '@testing-library/react';
import MakerInfo from '../../../../src/App/Map/components/MakerInfo';
import Farm from '../../../../src/domain/entities/Farm';

jest.mock('@App/Delete', () => () => <button>Delete</button>);
jest.mock('@App/Update', () => () => <button>Update</button>);

const mockFarm = new Farm(
  'farm-123',
  'Sunny Farm',
  { _lat: -10.123, _long: -20.456 },
  ['prod-1', 'prod-2']
);

describe('<MakerInfo />', () => {
  it('renders the farm name and action buttons', () => {
    render(<MakerInfo farm={mockFarm} onClose={jest.fn()} />);

    expect(screen.getByTestId('info-window')).toBeInTheDocument();
    expect(screen.getByText('Sunny Farm')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
  });
});
