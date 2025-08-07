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

import { transformCountries } from './transform-countries';

describe('transformCountries', () => {
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
            { id: 22, code: 'NY', name: 'New York' },
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
        {
          id: 'CA',
          two_letter_abbreviation: 'CA',
          three_letter_abbreviation: 'CAN',
          full_name_locale: 'Canada',
          full_name_english: 'Canada',
          available_regions: [
            { id: 1, code: 'ON', name: 'Ontario' },
            { id: 2, code: 'BC', name: 'British Columbia' },
          ],
        },
      ],
              storeConfig: {
          countries_with_required_region: 'US,CA',
          optional_zip_countries: 'IE,HK',
        },
    },
  };

  describe('successful transformation', () => {
    it('should transform countries data correctly', () => {
      const result = transformCountries(mockGraphQLResponse);

      expect(result).toEqual({
        availableCountries: [
          {
            value: 'CA',
            text: 'Canada',
            availableRegions: [
              { id: 1, code: 'ON', name: 'Ontario' },
              { id: 2, code: 'BC', name: 'British Columbia' },
            ],
          },
          {
            value: 'UG',
            text: 'Uganda',
            availableRegions: undefined,
          },
          {
            value: 'US',
            text: 'United States',
            availableRegions: [
              { id: 12, code: 'CA', name: 'California' },
              { id: 43, code: 'TX', name: 'Texas' },
              { id: 22, code: 'NY', name: 'New York' },
            ],
          },
        ],
        countriesWithRequiredRegion: ['US', 'CA'],
        optionalZipCountries: ['IE', 'HK'],
      });
    });

    it('should handle countries without regions', () => {
      const responseWithoutRegions = {
        data: {
          countries: [
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
            countries_with_required_region: '',
            optional_zip_countries: '',
          },
        },
      };

      const result = transformCountries(responseWithoutRegions);

      expect(result.availableCountries[0]).toEqual({
        value: 'UG',
        text: 'Uganda',
        availableRegions: undefined,
      });
    });

    it('should use full_name_locale as display text', () => {
      const result = transformCountries(mockGraphQLResponse);

      expect(result.availableCountries[0].text).toBe('Canada');
      expect(result.availableCountries[1].text).toBe('Uganda');
      expect(result.availableCountries[2].text).toBe('United States');
    });

    it('should use two_letter_abbreviation as value', () => {
      const result = transformCountries(mockGraphQLResponse);

      expect(result.availableCountries[0].value).toBe('CA');
      expect(result.availableCountries[1].value).toBe('UG');
      expect(result.availableCountries[2].value).toBe('US');
    });
  });

  describe('edge cases', () => {
    it('should handle empty countries array', () => {
      const emptyResponse = {
        data: {
          countries: [],
          storeConfig: {
            countries_with_required_region: '',
            optional_zip_countries: '',
          },
        },
      };

      const result = transformCountries(emptyResponse);

      expect(result).toEqual({
        availableCountries: [],
        countriesWithRequiredRegion: [],
        optionalZipCountries: [],
      });
    });

    it('should handle missing storeConfig', () => {
      const responseWithoutStoreConfig = {
        data: {
          countries: [
            {
              id: 'US',
              two_letter_abbreviation: 'US',
              three_letter_abbreviation: 'USA',
              full_name_locale: 'United States',
              full_name_english: 'United States',
              available_regions: [],
            },
          ],
          storeConfig: {
            countries_with_required_region: '',
            optional_zip_countries: '',
          },
        },
      };

      const result = transformCountries(responseWithoutStoreConfig);

      expect(result.countriesWithRequiredRegion).toEqual(['']);
      expect(result.optionalZipCountries).toEqual(['']);
    });

    it('should handle null/undefined regions', () => {
      const responseWithNullRegions = {
        data: {
          countries: [
            {
              id: 'US',
              two_letter_abbreviation: 'US',
              three_letter_abbreviation: 'USA',
              full_name_locale: 'United States',
              full_name_english: 'United States',
              available_regions: null as any,
            },
          ],
          storeConfig: {
            countries_with_required_region: 'US',
            optional_zip_countries: '',
          },
        },
      };

      const result = transformCountries(responseWithNullRegions);

      expect(result.availableCountries[0].availableRegions).toEqual(undefined);
    });
  });

  describe('regions transformation', () => {
    it('should preserve region structure', () => {
      const result = transformCountries(mockGraphQLResponse);

      const caRegions = result.availableCountries[0].availableRegions;
      expect(caRegions).toHaveLength(2);
      expect(caRegions![0]).toEqual({ id: 1, code: 'ON', name: 'Ontario' });
      expect(caRegions![1]).toEqual({ id: 2, code: 'BC', name: 'British Columbia' });
    });

    it('should handle regions with missing fields', () => {
      const responseWithIncompleteRegions = {
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
                { id: null as any, code: '', name: 'Invalid Region' },
              ],
            },
          ],
          storeConfig: {
            countries_with_required_region: '',
            optional_zip_countries: '',
          },
        },
      };

      const result = transformCountries(responseWithIncompleteRegions);
      const regions = result.availableCountries[0].availableRegions;

      expect(regions).toHaveLength(2);
      expect(regions![0]).toEqual({ id: 12, code: 'CA', name: 'California' });
      expect(regions![1]).toEqual({ id: null, code: '', name: 'Invalid Region' });
    });
  });

  describe('store configuration', () => {
    it('should preserve countries_with_required_region array', () => {
      const result = transformCountries(mockGraphQLResponse);

      expect(result.countriesWithRequiredRegion).toEqual(['US', 'CA']);
    });

    it('should preserve optional_zip_countries array', () => {
      const result = transformCountries(mockGraphQLResponse);

      expect(result.optionalZipCountries).toEqual(['IE', 'HK']);
    });

    it('should handle empty configuration arrays', () => {
      const responseWithEmptyConfig = {
        data: {
          countries: [
            {
              id: 'US',
              two_letter_abbreviation: 'US',
              three_letter_abbreviation: 'USA',
              full_name_locale: 'United States',
              full_name_english: 'United States',
              available_regions: [],
            },
          ],
          storeConfig: {
            countries_with_required_region: '',
            optional_zip_countries: '',
          },
        },
      };

      const result = transformCountries(responseWithEmptyConfig);

      expect(result.countriesWithRequiredRegion).toEqual(['']);
      expect(result.optionalZipCountries).toEqual(['']);
    });
  });
});
