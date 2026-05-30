import { render } from '@testing-library/react';
import App from './App';

test('renders brand name in navbar', () => {
  const { container } = render(<App />);
  const brandHeading = container.querySelector('h1');
  expect(brandHeading).toBeInTheDocument();
  expect(brandHeading.textContent).toBe('PES.');
});
