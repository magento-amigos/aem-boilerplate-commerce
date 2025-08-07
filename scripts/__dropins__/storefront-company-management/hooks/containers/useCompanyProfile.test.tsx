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

import { renderHook, act } from '@adobe-commerce/elsie/lib/tests';
import { useCompanyProfile } from './useCompanyProfile';
import { getCompany, updateCompany } from '../../api';
import { CompanyModel } from '../../data/models/company';

// Mock the API
jest.mock('../../api', () => ({
  getCompany: jest.fn(),
  updateCompany: jest.fn(),
}));

const mockGetCompany = getCompany as jest.Mock;
const mockUpdateCompany = updateCompany as jest.Mock;

const mockCompany: CompanyModel = {
  id: '1',
  name: 'Test Company',
  email: 'test@company.com',
  legal_name: 'Test Company LLC',
  vat_tax_id: 'VAT123',
  reseller_id: 'RES123',
  legal_address: {
    street: ['123 Test St'],
    city: 'Test City',
    region: { region: 'Test Region', regionCode: 'TR', regionId: 1 },
    countryCode: 'US',
    postcode: '12345',
    telephone: '555-1234',
  },
  company_admin: {
    id: '1',
    firstname: 'John',
    lastname: 'Doe',
    email: 'john@company.com',
  },
  sales_representative: {
    firstname: 'Jane',
    lastname: 'Smith',
    email: 'jane@company.com',
  },
  payment_methods: ['banktransfer'],
  canEdit: true,
  customerRole: { id: '1', name: 'Admin', permissions: [] },
  customerStatus: 'ACTIVE',
};

describe('useCompanyProfile', () => {
  const mockHandleSetInLineAlert = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCompany.mockResolvedValue(mockCompany);
    mockUpdateCompany.mockResolvedValue(mockCompany);
  });

  describe('initialization', () => {
    it('should initialize with default state', async () => {
      const { result } = renderHook(() => useCompanyProfile({ handleSetInLineAlert: mockHandleSetInLineAlert }));

      expect(result.current.loading).toBe(true);
      expect(result.current.saving).toBe(false);
      expect(result.current.showEditForm).toBe(false);
      expect(result.current.company).toBeNull();

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.company).toEqual(mockCompany);
    });
  });

  describe('form state management', () => {
    it('should handle show and hide edit form', async () => {
      const { result } = renderHook(() => useCompanyProfile({ handleSetInLineAlert: mockHandleSetInLineAlert }));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      act(() => {
        result.current.handleShowEditForm();
      });
      expect(result.current.showEditForm).toBe(true);

      act(() => {
        result.current.handleHideEditForm();
      });
      expect(result.current.showEditForm).toBe(false);
    });
  });

  describe('company update', () => {
    it('should handle successful company update', async () => {
      const { result } = renderHook(() => useCompanyProfile({ handleSetInLineAlert: mockHandleSetInLineAlert }));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      act(() => {
        result.current.handleShowEditForm();
      });

      await act(async () => {
        await result.current.handleUpdateCompany(mockCompany);
      });

      expect(mockUpdateCompany).toHaveBeenCalledWith(mockCompany);
      expect(result.current.company).toEqual(mockCompany);
      expect(result.current.showEditForm).toBe(false);
      expect(mockHandleSetInLineAlert).toHaveBeenCalledWith({
        type: 'success',
        text: 'Company profile updated successfully',
      });
    });

    it('should handle update company error', async () => {
      mockUpdateCompany.mockRejectedValueOnce(new Error('Update failed'));
      
      const { result } = renderHook(() => useCompanyProfile({ handleSetInLineAlert: mockHandleSetInLineAlert }));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      await act(async () => {
        try {
          await result.current.handleUpdateCompany(mockCompany);
        } catch (error) {
          // Expected error
        }
      });

      expect(result.current.saving).toBe(false);
      expect(mockHandleSetInLineAlert).toHaveBeenCalledWith({
        type: 'error',
        text: 'Failed to update company profile',
      });
    });
  });

  describe('error handling', () => {
    it('should handle getCompany API error', async () => {
      mockGetCompany.mockRejectedValueOnce(new Error('Failed to fetch company'));
      
      const { result } = renderHook(() => useCompanyProfile({ handleSetInLineAlert: mockHandleSetInLineAlert }));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.company).toBeNull();
      expect(mockHandleSetInLineAlert).toHaveBeenCalledWith({
        type: 'error',
        text: 'Failed to load company profile',
      });
    });
  });
});
