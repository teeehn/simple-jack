import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../page';

describe('Simple Jack UI', () => {
  it('renders the initial UI', () => {
    render(<Home />);
    expect(screen.getByText('Simple Jack')).toBeInTheDocument();
    expect(screen.getByLabelText('Number of players:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start Game' })).toBeInTheDocument();
  });

  it('allows selecting number of players and starting the game', async () => {
    render(<Home />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '3' } });
    const startButton = screen.getByRole('button', { name: 'Start Game' });
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText('Players\' Hands')).toBeInTheDocument();
      expect(screen.getByText('Commentary')).toBeInTheDocument();
    }, { timeout: 10000 });

    // Further assertions can be added for specific behaviors
  });
});
