import React from 'react';
import { render } from '@testing-library/react';
import VariantManager from '../components/product/VariantManager';

test('renders variant manager', () => {
  const { getByText } = render(<VariantManager />);
  expect(getByText('Attributes')).toBeTruthy();
});
