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

import { getCompany } from './getCompany';
import { fetchGraphQl } from '../fetch-graphql';
import { transformCompany } from '../../data/transforms/transform-company';

// Mock dependencies
jest.mock('../fetch-graphql');
jest.mock('../../data/transforms/transform-company');

// Mock sessionStorage
const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

const mockFetchGraphQl = fetchGraphQl as jest.MockedFunction<typeof fetchGraphQl>;
const mockTransformCompany = transformCompany as jest.MockedFunction<typeof transformCompany>;

describe('getCompany', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockGraphQLResponse = {
    data: {
      company: {
        id: '1',
        name: 'Acme Corporation',
        email: 'info@acme.com',
        legal_name: 'Acme Corporation LLC',
        vat_tax_id: 'VAT123456789',
        reseller_id: 'RES987654321',
        legal_address: {
          street: ['123 Business Ave', 'Suite 100'],
          city: 'San Francisco',
          region: {
            region: 'California',
            region_code: 'CA',
            region_id: 12,
          },
          country_code: 'US',
          postcode: '94105',
          telephone: '+1-555-123-4567',
        },
        company_admin: {
          id: '1',
          firstname: 'John',
          lastname: 'Doe',
          email: 'john.doe@acme.com',
        },
        sales_representative: {
          firstname: 'Jane',
          lastname: 'Smith',
          email: 'jane.smith@adobe.com',
        },
        payment_methods: ['banktransfer', 'checkmo', 'payflowpro'],
      },
      customer: {
        role: {
          id: '1',
          name: 'Company Administrator',
          permissions: [
            { id: '1', text: 'Magento_Company::edit_company_profile' },
          ],
        },
        status: 'ACTIVE',
      },
    },
  };

  const mockTransformedCompany = {
    id: '1',
    name: 'Acme Corporation',
    email: 'info@acme.com',
    legal_name: 'Acme Corporation LLC',
    vat_tax_id: 'VAT123456789',
    reseller_id: 'RES987654321',
    legal_address: {
      street: ['123 Business Ave', 'Suite 100'],
      city: 'San Francisco',
      region: {
        region: 'California',
        regionCode: 'CA',
        regionId: 12,
      },
      countryCode: 'US',
      postcode: '94105',
      telephone: '+1-555-123-4567',
    },
    company_admin: {
      id: '1',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@acme.com',
    },
    sales_representative: {
      firstname: 'Jane',
      lastname: 'Smith',
      email: 'jane.smith@adobe.com',
    },
    payment_methods: ['banktransfer', 'checkmo', 'payflowpro'],
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

  describe('successful request', () => {
    beforeEach(() => {
      mockFetchGraphQl.mockResolvedValue(mockGraphQLResponse);
      mockTransformCompany.mockReturnValue(mockTransformedCompany);
    });

    it('should fetch company data from GraphQL', async () => {
      const result = await getCompany();

      expect(mockFetchGraphQl).toHaveBeenCalledWith(
        expect.stringContaining('GET_COMPANY'),
        { method: 'GET', cache: 'no-cache' }
      );
      expect(mockTransformCompany).toHaveBeenCalledWith(mockGraphQLResponse);
      expect(result).toEqual(mockTransformedCompany);
    });
  });

  describe('error handling', () => {
    it('should handle GraphQL errors', async () => {
      const errorResponse = {
        errors: [{ message: 'Company not found', extensions: { category: 'graphql' } }],
        data: null,
      };
      mockFetchGraphQl.mockResolvedValue(errorResponse);

      await expect(getCompany()).rejects.toThrow();
      expect(mockTransformCompany).not.toHaveBeenCalled();
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network connection failed');
      mockFetchGraphQl.mockRejectedValue(networkError);

      await expect(getCompany()).rejects.toThrow('Network connection failed');
      expect(mockTransformCompany).not.toHaveBeenCalled();
    });

    it('should handle transformation errors', async () => {
      mockFetchGraphQl.mockResolvedValue(mockGraphQLResponse);
      mockTransformCompany.mockImplementation(() => {
        throw new Error('Transformation failed');
      });

      await expect(getCompany()).rejects.toThrow('Transformation failed');
    });
  });

  describe('GraphQL query structure', () => {
    beforeEach(() => {
      mockFetchGraphQl.mockResolvedValue(mockGraphQLResponse);
      mockTransformCompany.mockReturnValue(mockTransformedCompany);
    });

    it('should use the correct GraphQL query', async () => {
      await getCompany();

      const [query] = mockFetchGraphQl.mock.calls[0];
      expect(query).toContain('GET_COMPANY');
      expect(query).toContain('company {');
      expect(query).toContain('...COMPANY_FULL_FRAGMENT');
      expect(query).toContain('customer {');
      expect(query).toContain('role {');
      expect(query).toContain('permissions {');
    });

    it('should use correct fetch options', async () => {
      await getCompany();

      const [, options] = mockFetchGraphQl.mock.calls[0];
      expect(options).toEqual({
        method: 'GET',
        cache: 'no-cache',
      });
    });
  });
});
