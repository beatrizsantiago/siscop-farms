import { render, screen } from '@testing-library/react';
import ErrorLabel from '../../src/components/ErrorLabel';

describe('<ErrorLabel /> component', () => {
  it('should render the error message', () => {
    const errorMessage = 'This field is required';
    
    render(<ErrorLabel error={errorMessage} />);
    
    const errorText = screen.getByText(errorMessage);
    
    expect(errorText).toBeInTheDocument();
  });
});
