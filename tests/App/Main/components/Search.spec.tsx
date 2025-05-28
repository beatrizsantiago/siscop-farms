import { render, screen, fireEvent, act } from '@testing-library/react';
import { useFarmContext } from '../../../../src/App/context';
import Search from '.../../../src/App/Main/components/Search';

jest.mock('@App/context', () => ({
  useFarmContext: jest.fn(),
}));

describe('<Search />', () => {
  let onSearchMock: jest.Mock;

  beforeEach(() => {
    onSearchMock = jest.fn();
    (useFarmContext as jest.Mock).mockReturnValue({
      onSearch: onSearchMock,
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('renders the input field', () => {
    render(<Search />);
    expect(screen.getByPlaceholderText('Pesquisar fazenda')).toBeInTheDocument();
  });

  it('updates input value and triggers search with debounce', async () => {
    render(<Search />);
    const input = screen.getByPlaceholderText('Pesquisar fazenda');

    fireEvent.change(input, { target: { value: 'Green' } });
    expect(input).toHaveValue('Green');

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(onSearchMock).toHaveBeenCalledWith('Green');
  });

  it('clears previous timer on fast typing and calls only once', () => {
    render(<Search />);
    const input = screen.getByPlaceholderText('Pesquisar fazenda');

    fireEvent.change(input, { target: { value: 'G' } });
    fireEvent.change(input, { target: { value: 'Gr' } });
    fireEvent.change(input, { target: { value: 'Gre' } });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(onSearchMock).toHaveBeenCalledTimes(1);
    expect(onSearchMock).toHaveBeenCalledWith('Gre');
  });
});
