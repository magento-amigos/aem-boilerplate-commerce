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

import { render, screen, waitFor } from '@adobe-commerce/elsie/lib/tests';
import { CompanyProfile } from './CompanyProfile';
import '@testing-library/jest-dom';
import { useCompanyProfile } from '../../hooks/containers/useCompanyProfile';
import { checkIsCompanyEnabled } from '../../api/checkIsCompanyEnabled';

// Mock the useCompanyProfile hook
jest.mock('../../hooks/containers/useCompanyProfile');

// Mock the checkIsCompanyEnabled function
jest.mock('../../api/checkIsCompanyEnabled');

// Mock i18n
jest.mock('@adobe-commerce/elsie/i18n', () => ({
  useText: () => ({
    containerTitle: 'Company Profile',
    companyNotEnabled: 'Company functionality is not enabled',
  }),
  getDefinitionByLanguage: jest.fn(() => ({})),
}));

const mockUseCompanyProfile = useCompanyProfile as jest.MockedFunction<typeof useCompanyProfile>;
const mockCheckIsCompanyEnabled = checkIsCompanyEnabled as jest.MockedFunction<typeof checkIsCompanyEnabled>;

const mockCompany = {
  id: '1',
  name: 'Test Company',
  email: 'test@company.com',
  legal_name: 'Test Company Legal',
  vat_tax_id: '12345',
  reseller_id: '67890',
  legal_address: {
    street: ['123 Main St'],
    city: 'Test City',
    region: {
      region: 'California',
      regionCode: 'CA',
      regionId: 12,
    },
    countryCode: 'US',
    postcode: '12345',
    telephone: '+1-555-123-4567',
  },
  canEdit: true,
  customerRole: {
    id: '1',
    name: 'Company Administrator',
    permissions: [
      { id: '1', text: 'Magento_Company::edit_company_profile' },
    ],
  },
  customerStatus: 'ACTIVE',
};

describe('CompanyProfile Container', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock for company enabled
    mockCheckIsCompanyEnabled.mockResolvedValue({
      companyEnabled: true,
    });
    mockUseCompanyProfile.mockReturnValue({
      company: mockCompany,
      loading: false,
      saving: false,
      showEditForm: false,
      handleShowEditForm: jest.fn(),
      handleHideEditForm: jest.fn(),
      handleUpdateCompany: jest.fn(),
    });
  });

  it('renders company profile with header by default', () => {
    const { container } = render(<CompanyProfile />);
    expect(container).toBeInTheDocument();
    expect(screen.getByText('Company Profile')).toBeInTheDocument();
  });

  it('renders without header when withHeader is false', () => {
    const { container } = render(<CompanyProfile withHeader={false} />);
    expect(container).toBeInTheDocument();
    expect(screen.queryByText('Company Profile')).not.toBeInTheDocument();
  });

  it('applies custom className correctly', () => {
    const { container } = render(<CompanyProfile className="custom-class" />);
    const profileDiv = container.querySelector('.account-company-profile');
    expect(profileDiv).toHaveClass('account-company-profile');
    expect(profileDiv).toHaveClass('custom-class');
  });

  it('handles loading state', () => {
    mockUseCompanyProfile.mockReturnValue({
      company: null,
      loading: true,
      saving: false,
      showEditForm: false,
      handleShowEditForm: jest.fn(),
      handleHideEditForm: jest.fn(),
      handleUpdateCompany: jest.fn(),
    });

    const { container } = render(<CompanyProfile />);
    expect(container).toBeInTheDocument();
  });

  it('redirects to /customer/account when company functionality is not enabled', async () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, href: '' };

    mockCheckIsCompanyEnabled.mockResolvedValue({
      companyEnabled: false,
      error: 'Company functionality not available',
    });

    const { container } = render(<CompanyProfile />);

    await waitFor(() => {
      expect(window.location.href).toBe('/customer/account');
    });

    expect(container.firstChild).toBeNull();
    expect(mockCheckIsCompanyEnabled).toHaveBeenCalledTimes(1);

    // Restore original location
    window.location = originalLocation;
  });

  it('shows loader while checking company status', () => {
    // Mock checkIsCompanyEnabled to never resolve (simulating loading)
    mockCheckIsCompanyEnabled.mockImplementation(() => new Promise(() => {}));

    render(<CompanyProfile />);

    expect(screen.getByTestId('companyProfileLoader')).toBeInTheDocument();
  });

  it('proceeds normally when company is enabled', async () => {
    mockCheckIsCompanyEnabled.mockResolvedValue({
      companyEnabled: true,
    });

    const { container } = render(<CompanyProfile />);

    await waitFor(() => {
      expect(container.querySelector('.account-company-profile')).toBeInTheDocument();
    });

    expect(screen.getByText('Company Profile')).toBeInTheDocument();
    expect(mockCheckIsCompanyEnabled).toHaveBeenCalledTimes(1);
  });
});
