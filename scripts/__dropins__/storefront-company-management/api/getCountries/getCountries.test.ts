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

import { getCountries } from './getCountries';
import { fetchGraphQl } from '../fetch-graphql';
import { transformCountries } from '../../data/transforms/transform-countries';

// Mock dependencies
jest.mock('../fetch-graphql');
jest.mock('../../data/transforms/transform-countries');

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
const mockTransformCountries = transformCountries as jest.MockedFunction<typeof transformCountries>;

describe('getCountries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockGraphQLResponse = {
    data: {
      countries: [
        {
          id: 'US',
          two_letter_abbreviation: 'US',
          three_letter_abbreviation: 'USA',
          full_name_locale: 'United States',
          full_name_english: 'United States',
          available_regions: [
            { id: 12, code: 'CA', name: 'California' },
            { id: 43, code: 'TX', name: 'Texas' },
          ],
        },
        {
          id: 'UG',
          two_letter_abbreviation: 'UG',
          three_letter_abbreviation: 'UGA',
          full_name_locale: 'Uganda',
          full_name_english: 'Uganda',
          available_regions: [],
        },
      ],
      storeConfig: {
        countries_with_required_region: ['US', 'CA'],
        optional_zip_countries: ['IE'],
      },
    },
  };

  const mockTransformedData = {
    availableCountries: [
      {
        value: 'US',
        text: 'United States',
        availableRegions: [
          { id: 12, code: 'CA', name: 'California' },
          { id: 43, code: 'TX', name: 'Texas' },
        ],
      },
      {
        value: 'UG',
        text: 'Uganda',
        availableRegions: [],
      },
    ],
    countriesWithRequiredRegion: ['US', 'CA'],
    optionalZipCountries: ['IE'],
  };

  describe('when data is not cached', () => {
    beforeEach(() => {
      mockSessionStorage.getItem.mockReturnValue(null);
      mockFetchGraphQl.mockResolvedValue(mockGraphQLResponse);
      mockTransformCountries.mockReturnValue(mockTransformedData);
    });

    it('should fetch countries from GraphQL and cache the result', async () => {
      const result = await getCountries();

      expect(mockFetchGraphQl).toHaveBeenCalledWith(
        expect.stringContaining('query getCountries'),
        { method: 'GET', cache: 'no-cache' }
      );
      expect(mockTransformCountries).toHaveBeenCalledWith(mockGraphQLResponse);
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        '_company_countries',
        JSON.stringify(mockTransformedData)
      );
      expect(result).toEqual(mockTransformedData);
    });

    it('should handle GraphQL errors', async () => {
      const errorResponse = {
        errors: [{ message: 'GraphQL error occurred', extensions: { category: 'graphql' } }],
        data: null,
      };
      mockFetchGraphQl.mockResolvedValue(errorResponse);

      await expect(getCountries()).rejects.toThrow();
      expect(mockSessionStorage.setItem).not.toHaveBeenCalled();
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      mockFetchGraphQl.mockRejectedValue(networkError);

      await expect(getCountries()).rejects.toThrow('Network error');
      expect(mockSessionStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('when data is cached', () => {
    beforeEach(() => {
      mockSessionStorage.getItem.mockReturnValue(JSON.stringify(mockTransformedData));
    });

    it('should return cached data without making GraphQL request', async () => {
      const result = await getCountries();

      expect(mockSessionStorage.getItem).toHaveBeenCalledWith('_company_countries');
      expect(mockFetchGraphQl).not.toHaveBeenCalled();
      expect(mockTransformCountries).not.toHaveBeenCalled();
      expect(result).toEqual(mockTransformedData);
    });
  });

  describe('cache key', () => {
    it('should use the correct cache key', async () => {
      mockSessionStorage.getItem.mockReturnValue(JSON.stringify(mockTransformedData));
      
      await getCountries();

      expect(mockSessionStorage.getItem).toHaveBeenCalledWith('_company_countries');
    });
  });

  describe('GraphQL query structure', () => {
    beforeEach(() => {
      mockSessionStorage.getItem.mockReturnValue(null);
      mockFetchGraphQl.mockResolvedValue(mockGraphQLResponse);
      mockTransformCountries.mockReturnValue(mockTransformedData);
    });

    it('should use the correct GraphQL query', async () => {
      await getCountries();

      const [query] = mockFetchGraphQl.mock.calls[0];
      expect(query).toContain('query getCountries');
      expect(query).toContain('countries');
      expect(query).toContain('id');
      expect(query).toContain('two_letter_abbreviation');
      expect(query).toContain('available_regions');
      expect(query).toContain('storeConfig');
      expect(query).toContain('countries_with_required_region');
      expect(query).toContain('optional_zip_countries');
    });
  });
});
