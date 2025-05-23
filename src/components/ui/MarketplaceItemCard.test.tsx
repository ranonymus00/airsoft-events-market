import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MarketplaceItemCard from './MarketplaceItemCard';
import { MarketplaceItem } from '../../types';

const mockItem: MarketplaceItem = {
  id: 'test-item-1',
  title: 'Test Item',
  description: 'A test item description',
  price: 99.99,
  condition: 'New',
  category: 'Guns',
  images: ['test-image.jpg'],
  seller: {
    id: 'user-1',
    username: 'testuser',
    email: 'test@example.com',
    avatar: 'test-avatar.jpg',
    teams: [],
    createdAt: '2024-03-15',
  },
  location: 'Test Location',
  createdAt: new Date().toISOString(),
  isTradeAllowed: true,
};

describe('MarketplaceItemCard', () => {
  const renderItemCard = () => {
    return render(
      <BrowserRouter>
        <MarketplaceItemCard item={mockItem} />
      </BrowserRouter>
    );
  };

  it('renders item title', () => {
    renderItemCard();
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('renders item price', () => {
    renderItemCard();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('renders item location', () => {
    renderItemCard();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
  });

  it('renders trade allowed badge when trade is allowed', () => {
    renderItemCard();
    expect(screen.getByText('Trade Allowed')).toBeInTheDocument();
  });

  it('renders item condition', () => {
    renderItemCard();
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders item category', () => {
    renderItemCard();
    expect(screen.getByText('Guns')).toBeInTheDocument();
  });
});