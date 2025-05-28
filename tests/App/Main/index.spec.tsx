import { render, screen } from '@testing-library/react';
import Main from '../../../src/App/Main';

jest.mock('../../../src/App/Add', () => () => <div data-testid="add-component" />);
jest.mock('../../../src/App/Map', () => () => <div data-testid="map-component" />);
jest.mock('../../../src/App/Main/components/Search', () => () => <input placeholder="Search farms" />);

describe('<Main />', () => {
  it('renders Search, Add, and Map components correctly', () => {
    render(<Main />);

    expect(screen.getByPlaceholderText('Search farms')).toBeInTheDocument();

    expect(screen.getByTestId('add-component')).toBeInTheDocument();
    expect(screen.getByTestId('map-component')).toBeInTheDocument();
  });
});
