/********************************************************************
 * ADOBE CONFIDENTIAL
 * __________________
 *
 *  Copyright 2024 Adobe
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

// @ts-nocheck
import { render, screen, fireEvent } from '@adobe-commerce/elsie/lib/tests';
import '@testing-library/jest-dom';
import { CompanyProfile } from './CompanyProfile';
import { useCompanyProfile } from '../../hooks/containers/useCompanyProfile';
import { useInLineAlert } from '../../hooks/useInLineAlert';
import { getCompany, updateCompany } from '../../api';

jest.mock('../../hooks/containers/useCompanyProfile');
jest.mock('../../hooks/useInLineAlert');
jest.mock('../../api/getCompany');
jest.mock('../../api/updateCompany');
jest.mock('../../components/EditCompanyProfile');

const useCompanyProfileMock = {
  company: {
    id: '1',
    name: 'Test Company',
    email: 'test@company.com',
    legal_name: 'Test Company Legal',
    vat_tax_id: '12345',
    reseller_id: '67890',
    legal_address: {
      street: ['123 Main St'],
      city: 'Test City',
      region: { region: 'CA' },
      postcode: '12345',
      country_code: 'US'
    },
    canEdit: true
  },
  loading: false,
  saving: false,
  showEditForm: false,
  handleShowEditForm: jest.fn(),
  handleHideEditForm: jest.fn(),
  handleUpdateCompany: jest.fn(),
};

const useInLineAlertMock = {
  inLineAlertProps: null,
  handleSetInLineAlert: jest.fn(),
};

beforeEach(() => {
  (useCompanyProfile as jest.Mock).mockReturnValue(useCompanyProfileMock);
  (useInLineAlert as jest.Mock).mockReturnValue(useInLineAlertMock);
});

describe('CompanyProfile Container', () => {
  it('renders loading state correctly', () => {
    (useCompanyProfile as jest.Mock).mockReturnValue({
      ...useCompanyProfileMock,
      loading: true,
    });

    render(<CompanyProfile />);

    expect(screen.getByTestId('companyProfileLoader')).toBeInTheDocument();
  });

  it('renders company profile with header by default', () => {
    render(<CompanyProfile />);

    expect(screen.getByText('Company Profile')).toBeInTheDocument();
    expect(screen.getByText('Test Company')).toBeInTheDocument();
    expect(screen.getByText('test@company.com')).toBeInTheDocument();
  });

  it('renders without header when withHeader is false', () => {
    render(<CompanyProfile withHeader={false} />);

    expect(screen.queryByText('Company Profile')).not.toBeInTheDocument();
    expect(screen.getByText('Test Company')).toBeInTheDocument();
  });

  it('shows edit form when showEditForm is true', () => {
    (useCompanyProfile as jest.Mock).mockReturnValue({
      ...useCompanyProfileMock,
      showEditForm: true,
    });

    render(<CompanyProfile />);

    expect(screen.getByText('Edit Company Profile')).toBeInTheDocument();
  });

  it('applies custom className correctly', () => {
    const { container } = render(<CompanyProfile className="custom-class" />);

    expect(container.firstChild).toHaveClass('account-company-profile');
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('handles company profile card interactions', () => {
    render(<CompanyProfile />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(useCompanyProfileMock.handleShowEditForm).toHaveBeenCalled();
  });

  it('renders with no company data', () => {
    (useCompanyProfile as jest.Mock).mockReturnValue({
      ...useCompanyProfileMock,
      company: null,
    });

    render(<CompanyProfile />);

    expect(screen.getByText('Company profile not available. Please contact your administrator.')).toBeInTheDocument();
  });

  it('handles edit form submission', () => {
    (useCompanyProfile as jest.Mock).mockReturnValue({
      ...useCompanyProfileMock,
      showEditForm: true,
      saving: true,
    });

    render(<CompanyProfile />);

    expect(screen.getByText('Edit Company Profile')).toBeInTheDocument();
  });

  it('passes slots correctly to CompanyProfileCard', () => {
    const mockSlots = { test: <div>Test Slot</div> };
    
    render(<CompanyProfile slots={mockSlots} />);

    // CompanyProfileCard should receive the slots prop
    expect(screen.getByText('Test Company')).toBeInTheDocument();
  });
});