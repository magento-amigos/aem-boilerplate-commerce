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

import { updateCompany } from './updateCompany';
import { fetchGraphQl } from '../fetch-graphql';
import { transformCompany } from '../../data/transforms/transform-company';

// Mock dependencies
jest.mock('../fetch-graphql');
jest.mock('../../data/transforms/transform-company');

const mockFetchGraphQl = fetchGraphQl as jest.MockedFunction<typeof fetchGraphQl>;
const mockTransformCompany = transformCompany as jest.MockedFunction<typeof transformCompany>;

describe('updateCompany', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockCompanyInput = {
    name: 'Updated Company Name',
    email: 'updated@company.com',
    legal_name: 'Updated Legal Name LLC',
    vat_tax_id: 'VAT123456',
    reseller_id: 'RES789',
    legal_address: {
      street: ['123 Updated Street', 'Suite 200'],
      city: 'Updated City',
      region: {
        region: 'California',
        region_code: 'CA',
      },
      country_code: 'US',
      postcode: '94105',
      telephone: '+1-555-123-4567',
    },
  };

  const mockGraphQLResponse = {
    data: {
      updateCompany: {
        company: {
          id: '1',
          name: 'Updated Company Name',
          email: 'updated@company.com',
          legal_name: 'Updated Legal Name LLC',
          vat_tax_id: 'VAT123456',
          reseller_id: 'RES789',
          legal_address: {
            street: ['123 Updated Street', 'Suite 200'],
            city: 'Updated City',
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
            email: 'john.doe@company.com',
          },
        },
      },
    },
  };

  const mockTransformedCompany = {
    id: '1',
    name: 'Updated Company Name',
    email: 'updated@company.com',
    legal_name: 'Updated Legal Name LLC',
    vat_tax_id: 'VAT123456',
    reseller_id: 'RES789',
    legal_address: {
      street: ['123 Updated Street', 'Suite 200'],
      city: 'Updated City',
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
      email: 'john.doe@company.com',
    },
    canEdit: true,
  };

  describe('successful update', () => {
    beforeEach(() => {
      mockFetchGraphQl.mockResolvedValue(mockGraphQLResponse);
      mockTransformCompany.mockReturnValue(mockTransformedCompany);
    });

    it('should update company with basic information', async () => {
      const basicInput = {
        name: 'New Name',
        email: 'new@email.com',
      };

      const result = await updateCompany(basicInput);

      expect(mockFetchGraphQl).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE_COMPANY'),
        expect.objectContaining({
          method: 'POST',
          variables: expect.objectContaining({
            input: expect.objectContaining({
              company_name: 'New Name',
              company_email: 'new@email.com',
            }),
          }),
        })
      );
      expect(mockTransformCompany).toHaveBeenCalledWith(mockGraphQLResponse);
      expect(result).toEqual(mockTransformedCompany);
    });

    it('should update company with complete legal address', async () => {
      const result = await updateCompany(mockCompanyInput);

      const [, options] = mockFetchGraphQl.mock.calls[0];
      const variables = options!.variables!;

      expect(variables!.input).toEqual({
        company_name: 'Updated Company Name',
        company_email: 'updated@company.com',
        legal_name: 'Updated Legal Name LLC',
        vat_tax_id: 'VAT123456',
        reseller_id: 'RES789',
        legal_address: {
          street: ['123 Updated Street', 'Suite 200'],
          city: 'Updated City',
          region: {
            region: 'California',
            region_code: 'CA',
          },
          country_id: 'US', // Note: should be transformed to country_id
          postcode: '94105',
          telephone: '+1-555-123-4567',
        },
      });
      expect(result).toEqual(mockTransformedCompany);
    });

    it('should handle custom regions correctly', async () => {
      const customRegionInput = {
        ...mockCompanyInput,
        legal_address: {
          ...mockCompanyInput.legal_address,
          region: {
            region: 'Central Region',
            region_code: 'Central Region', // Same as region for custom
          },
          country_code: 'UG',
        },
      };

      await updateCompany(customRegionInput);

      const [, options] = mockFetchGraphQl.mock.calls[0];
      const variables = options!.variables!;

      expect(variables.input.legal_address.region).toEqual({
        region: 'Central Region',
        region_code: 'Central Region',
        region_id: 0, // Should add region_id: 0 for custom regions
      });
    });

    it('should handle predefined regions correctly', async () => {
      const predefinedRegionInput = {
        ...mockCompanyInput,
        legal_address: {
          ...mockCompanyInput.legal_address,
          region: {
            region: 'California',
            region_code: 'CA', // Different from region for predefined
          },
        },
      };

      await updateCompany(predefinedRegionInput);

      const [, options] = mockFetchGraphQl.mock.calls[0];
      const variables = options!.variables!;

      expect(variables.input.legal_address.region).toEqual({
        region: 'California',
        region_code: 'CA',
        // Should NOT have region_id for predefined regions
      });
    });

    it('should filter out empty street lines', async () => {
      const inputWithEmptyStreets = {
        ...mockCompanyInput,
        legal_address: {
          ...mockCompanyInput.legal_address,
          street: ['123 Main St', '', 'Suite 100', ''],
        },
      };

      await updateCompany(inputWithEmptyStreets);

      const [, options] = mockFetchGraphQl.mock.calls[0];
      const variables = options!.variables!;

      expect(variables.input.legal_address.street).toEqual(['123 Main St', 'Suite 100']);
    });
  });

  describe('error handling', () => {
    it('should handle GraphQL errors', async () => {
      const errorResponse = {
        errors: [{ message: 'Company update failed', extensions: { category: 'graphql' } }],
        data: null,
      };
      mockFetchGraphQl.mockResolvedValue(errorResponse);

      await expect(updateCompany(mockCompanyInput)).rejects.toThrow();
      expect(mockTransformCompany).not.toHaveBeenCalled();
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network connection failed');
      mockFetchGraphQl.mockRejectedValue(networkError);

      await expect(updateCompany(mockCompanyInput)).rejects.toThrow('Network connection failed');
      expect(mockTransformCompany).not.toHaveBeenCalled();
    });
  });

  describe('input transformation', () => {
    beforeEach(() => {
      mockFetchGraphQl.mockResolvedValue(mockGraphQLResponse);
      mockTransformCompany.mockReturnValue(mockTransformedCompany);
    });

    it('should transform field names correctly', async () => {
      const input = {
        name: 'Test Company',
        email: 'test@company.com',
      };

      await updateCompany(input);

      const [, options] = mockFetchGraphQl.mock.calls[0];
      const variables = options!.variables!;

      expect(variables.input).toEqual({
        company_name: 'Test Company', // name -> company_name
        company_email: 'test@company.com', // email -> company_email
      });
    });

    it('should transform country_code to country_id', async () => {
      const input = {
        legal_address: {
          country_code: 'US',
          city: 'San Francisco',
          street: ['123 Main St'],
        },
      };

      await updateCompany(input);

      const [, options] = mockFetchGraphQl.mock.calls[0];
      const variables = options!.variables!;

      expect(variables.input.legal_address.country_id).toBe('US');
      expect(variables.input.legal_address.country_code).toBeUndefined();
    });
  });

  describe('GraphQL query structure', () => {
    beforeEach(() => {
      mockFetchGraphQl.mockResolvedValue(mockGraphQLResponse);
      mockTransformCompany.mockReturnValue(mockTransformedCompany);
    });

    it('should use the correct mutation', async () => {
      await updateCompany({ name: 'Test' });

      const [query] = mockFetchGraphQl.mock.calls[0];
      expect(query).toContain('UPDATE_COMPANY');
      expect(query).toContain('$input: CompanyUpdateInput!');
      expect(query).toContain('updateCompany(input: $input)');
      expect(query).toContain('...COMPANY_FULL_FRAGMENT');
    });
  });

  describe('edge case coverage', () => {
    beforeEach(() => {
      mockFetchGraphQl.mockResolvedValue(mockGraphQLResponse);
      mockTransformCompany.mockReturnValue(mockTransformedCompany);
    });

    it('should handle street array with street_2 addition', async () => {
      const input = {
        legal_address: {
          street: ['123 Main St', 'Apt 1'], // Already an array
          street_2: 'Unit B', // Additional street info
          city: 'Test City',
        },
      };

      await updateCompany(input);

      const [, options] = mockFetchGraphQl.mock.calls[0];
      const variables = options!.variables!;

      // Should push street_2 to existing array
      expect(variables.input.legal_address.street).toEqual(['123 Main St', 'Apt 1', 'Unit B']);
    });

    it('should handle region with different region and region_code', async () => {
      const input = {
        legal_address: {
          region: 'California',
          region_code: 'CA',
          city: 'Los Angeles',
        },
      };

      await updateCompany(input);

      const [, options] = mockFetchGraphQl.mock.calls[0];
      const variables = options!.variables!;

      // Should handle dropdown case where region !== region_code
      expect(variables.input.legal_address.region).toEqual({
        region: 'California',
        region_code: 'CA',
      });
    });

    it('should handle fallback region case', async () => {
      const input = {
        legal_address: {
          region: 'Custom Region',
          city: 'Test City',
        },
      };

      await updateCompany(input);

      const [, options] = mockFetchGraphQl.mock.calls[0];
      const variables = options!.variables!;

      // Should handle case where only region string is provided
      expect(variables.input.legal_address.region).toEqual({
        region: 'Custom Region',
        region_code: 'Custom Region',
        region_id: 0,
      });
    });

    it('should copy additional fields not in transformation list', async () => {
      const input = {
        name: 'Test Company',
        custom_field: 'custom_value',
        another_field: { nested: 'data' },
      };

      await updateCompany(input);

      const [, options] = mockFetchGraphQl.mock.calls[0];
      const variables = options!.variables!;

      // Should copy additional fields
      expect(variables.input.company_name).toBe('Test Company');
      expect(variables.input.custom_field).toBe('custom_value');
      expect(variables.input.another_field).toEqual({ nested: 'data' });
    });

    it('should handle string street input normally', async () => {
      const input = {
        legal_address: {
          street: '123 Main St', // String instead of array
          street_2: 'Suite 200',
          city: 'Test City',
        },
      };

      await updateCompany(input);

      const [, options] = mockFetchGraphQl.mock.calls[0];
      const variables = options!.variables!;

      // Should create array from string inputs
      expect(variables.input.legal_address.street).toEqual(['123 Main St', 'Suite 200']);
    });

    it('should filter out empty street values', async () => {
      const input = {
        legal_address: {
          street: ['123 Main St', '', '   ', null, undefined],
          city: 'Test City',
        },
      };

      await updateCompany(input);

      const [, options] = mockFetchGraphQl.mock.calls[0];
      const variables = options!.variables!;

      // Should filter out empty/invalid street values
      expect(variables.input.legal_address.street).toEqual(['123 Main St']);
    });
  });
});
