import React from 'react';
import { render } from '@testing-library/react';
import ImageUploader from '../components/product/ImageUploader';

test('renders image uploader', () => {
  const { getByText } = render(<ImageUploader initialImages={[]} />);
  expect(getByText('Drag & drop images here')).toBeTruthy();
});
