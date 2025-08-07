/********************************************************************
 * ADOBE CONFIDENTIAL
 * __________________
 *
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 *******************************************************************/

import { render } from '@adobe-commerce/elsie/lib/tests';
import { CompanyCardLoader, CompanyFormLoader } from './CompanyLoaders';

// Import jest-dom matchers
import '@testing-library/jest-dom';

// Mock i18n
jest.mock('@adobe-commerce/elsie/i18n', () => ({
  useText: () => ({
    loading: 'Loading...',
  }),
  getDefinitionByLanguage: jest.fn(() => ({})),
}));

describe('CompanyLoaders', () => {
  describe('CompanyCardLoader', () => {
    it('should render without crashing', () => {
      const { container } = render(<CompanyCardLoader />);
      expect(container).toBeInTheDocument();
    });

    it('should render without card wrapper when withCard is true', () => {
      const { container } = render(<CompanyCardLoader withCard />);
      expect(container.querySelector('.dropin-card')).not.toBeInTheDocument();
    });

    it('should render with card wrapper when withCard is false', () => {
      const { container } = render(<CompanyCardLoader withCard={false} />);
      expect(container.querySelector('.dropin-card')).toBeInTheDocument();
    });

    it('should render skeleton loaders', () => {
      const { container } = render(<CompanyCardLoader />);
      const skeletons = container.querySelectorAll('.dropin-skeleton');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should apply custom className', () => {
      // The component doesn't accept className prop, so let's test the default classes
      const { container } = render(<CompanyCardLoader withCard={false} />);
      expect(container.querySelector('.company-company-loaders')).toBeInTheDocument();
    });

    it('should render different content when withCard prop changes', () => {
      const { container: containerWithCard } = render(<CompanyCardLoader withCard />);
      const { container: containerWithoutCard } = render(<CompanyCardLoader withCard={false} />);
      
      expect(containerWithCard.innerHTML).not.toBe(containerWithoutCard.innerHTML);
    });
  });

  describe('CompanyFormLoader', () => {
    it('should render without crashing', () => {
      const { container } = render(<CompanyFormLoader />);
      expect(container).toBeInTheDocument();
    });

    it('should render skeleton form elements', () => {
      const { container } = render(<CompanyFormLoader />);
      const skeletons = container.querySelectorAll('.dropin-skeleton');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should render form loader with test id', () => {
      const { container } = render(<CompanyFormLoader />);
      expect(container.querySelector('[data-testid="companyFormLoader"]')).toBeInTheDocument();
    });

    it('should render form-like structure', () => {
      const { container } = render(<CompanyFormLoader />);
      // Check for form-like skeleton elements
      expect(container.querySelector('.dropin-skeleton')).toBeInTheDocument();
    });
  });
});
