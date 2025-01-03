import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserSearch from '../UserSearch';

describe('UserSearch', () => {
  it('should handle search correctly', async () => {
    const onUserFound = jest.fn();
    render(<UserSearch onUserFound={onUserFound} />);
    
    const input = screen.getByPlaceholderText('Search for a GitHub user...');
    fireEvent.change(input, { target: { value: 'testuser' } });
    
    await waitFor(() => {
      expect(onUserFound).toHaveBeenCalled();
    });
  });
}); 