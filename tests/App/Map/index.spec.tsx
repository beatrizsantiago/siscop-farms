import { fireEvent, render, screen } from '@testing-library/react';
import { useFarmContext } from '../../../src/App/context';
import Map from '../../../src/App/Map';

jest.mock('@react-google-maps/api', () => ({
  GoogleMap: ({ children }: any) => <div data-testid="google-map">{children}</div>,
  Marker: ({ onClick, title }: any) => (
    <button onClick={onClick} data-testid="marker">
      Marker: {title}
    </button>
  ),
}));

jest.mock('../../../src/App/Map/components/MakerInfo', () => ({ farm, onClose }: any) => (
  <div data-testid="maker-info">
    Info for {farm.name}
    <button onClick={onClose}>Close</button>
  </div>
));

jest.mock('../../../src/App/context', () => ({
  useFarmContext: jest.fn(),
}));

const mockFarms = [
  {
    id: '1',
    name: 'Farm One',
    geolocation: { _lat: -10, _long: -20 },
    available_products: ['prod1'],
  },
  {
    id: '2',
    name: 'Farm Two',
    geolocation: { _lat: -30, _long: -40 },
    available_products: ['prod2'],
  },
];

describe('<Map />', () => {
  beforeEach(() => {
    (useFarmContext as jest.Mock).mockReturnValue({
      state: { farms: mockFarms },
    });
  });

  it('renders the map and markers', () => {
    render(<Map />);
    expect(screen.getByTestId('google-map')).toBeInTheDocument();
    expect(screen.getAllByTestId('marker')).toHaveLength(2);
    expect(screen.getByText('Marker: Farm One')).toBeInTheDocument();
    expect(screen.getByText('Marker: Farm Two')).toBeInTheDocument();
  });

  it('displays info window when a marker is clicked', () => {
    render(<Map />);
    fireEvent.click(screen.getByText('Marker: Farm One'));
    expect(screen.getByTestId('maker-info')).toHaveTextContent('Info for Farm One');

    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByTestId('maker-info')).not.toBeInTheDocument();
  });
});

