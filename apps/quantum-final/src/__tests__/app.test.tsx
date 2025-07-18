import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders without crashing and shows main layout', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
