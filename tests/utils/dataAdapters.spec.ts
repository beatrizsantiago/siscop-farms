import { capitalizeFirstLetter } from '../../src/utils/dataAdapters';

describe('capitalizeFirstLetter', () => {
  it('should capitalize the first letter of a string', () => {
    const result = capitalizeFirstLetter('hello');
    expect(result).toBe('Hello');
  });

  it('should return an empty string if input is empty', () => {
    const result = capitalizeFirstLetter('');
    expect(result).toBe('');
  });

  it('should not change already capitalized strings', () => {
    const result = capitalizeFirstLetter('Hello');
    expect(result).toBe('Hello');
  });
});
