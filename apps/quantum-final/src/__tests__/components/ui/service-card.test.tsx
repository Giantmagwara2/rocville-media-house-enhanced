
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ServiceCard } from '../../components/ui/service-card';

const mockService = {
  title: 'AI Consultation',
  description: 'Expert AI consulting services',
  icon: '🤖',
  features: ['Strategy', 'Implementation', 'Support'],
  link: '/services/ai-consultation'
};

const ServiceCardWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('ServiceCard', () => {
  it('renders service information correctly', () => {
    render(
      <ServiceCardWrapper>
        <ServiceCard {...mockService} />
      </ServiceCardWrapper>
    );

    expect(screen.getByText('AI Consultation')).toBeInTheDocument();
    expect(screen.getByText('Expert AI consulting services')).toBeInTheDocument();
    expect(screen.getByText('🤖')).toBeInTheDocument();
  });

  it('displays all features', () => {
    render(
      <ServiceCardWrapper>
        <ServiceCard {...mockService} />
      </ServiceCardWrapper>
    );

    mockService.features.forEach(feature => {
      expect(screen.getByText(feature)).toBeInTheDocument();
    });
  });

  it('handles hover interactions', () => {
    render(
      <ServiceCardWrapper>
        <ServiceCard {...mockService} />
      </ServiceCardWrapper>
    );

    const card = screen.getByRole('article');
    fireEvent.mouseEnter(card);
    
    expect(card).toHaveClass('hover:shadow-2xl');
  });
});
