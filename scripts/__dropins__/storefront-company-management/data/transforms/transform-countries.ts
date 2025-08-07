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

import { CountriesFormResponse } from '../../types/api/getCountries.types';
import { Country } from '../models/country';

export const transformCountries = (
  response: CountriesFormResponse
): {
  availableCountries: Country[] | [];
  countriesWithRequiredRegion: string[];
  optionalZipCountries: string[];
} => {
  if (!response?.data?.countries?.length) {
    return {
      availableCountries: [],
      countriesWithRequiredRegion: [],
      optionalZipCountries: [],
    };
  }

  const { countries, storeConfig } = response.data;

  const countriesWithRequiredRegion =
    storeConfig?.countries_with_required_region.split(',');
  const optionalZipCountries = storeConfig?.optional_zip_countries.split(',');

  const availableCountries = countries
    .filter(({ two_letter_abbreviation, full_name_locale }) =>
      Boolean(two_letter_abbreviation && full_name_locale)
    )
    .map((country) => {
      const { two_letter_abbreviation, full_name_locale, available_regions } = country;

      const hasRegions = Array.isArray(available_regions) && available_regions.length > 0;
      return {
        value: two_letter_abbreviation,
        text: full_name_locale,
        availableRegions: hasRegions ? available_regions : undefined,
      };
    })
    .sort((a, b) => a.text.localeCompare(b.text));

  return {
    availableCountries,
    countriesWithRequiredRegion,
    optionalZipCountries,
  };
};
