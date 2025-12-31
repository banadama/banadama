import React from 'react';
import { render } from '@testing-library/react';
import ProductCard from '../components/product/ProductCard';

test('renders product card', () => {
  const product = { id: '1', name: 'Test', mainImage: '', basePrice: 10, stockQuantity: 5, status: 'ACTIVE', sku: 'SKU1' };
  const { getByText } = render(<ProductCard product={product} />);
  expect(getByText('Test')).toBeTruthy();
});
