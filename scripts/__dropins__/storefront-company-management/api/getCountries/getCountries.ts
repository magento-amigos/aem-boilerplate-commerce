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

import { GET_COUNTRIES_QUERY } from './graphql/getCountries.graphql';
import { fetchGraphQl } from '../fetch-graphql';
import { handleNetworkError } from '../../lib/network-error';
import { handleFetchError } from '../../lib/fetch-error';
import { transformCountries } from '../../data/transforms/transform-countries';
import { CountriesFormResponse } from '../../types/api/getCountries.types';
import { Country } from '../../data/models/country';

export const getCountries = async (): Promise<{
  availableCountries: Country[] | [];
  countriesWithRequiredRegion: string[];
  optionalZipCountries: string[];
}> => {
  const sessionStorageKey = '_company_countries';

  const sessionStorageCache = sessionStorage.getItem(sessionStorageKey);

  if (sessionStorageCache) {
    return JSON.parse(sessionStorageCache);
  }

  return await fetchGraphQl(GET_COUNTRIES_QUERY, {
    method: 'GET',
    cache: 'no-cache',
  })
    .then((response: CountriesFormResponse) => {
      if (response.errors?.length) return handleFetchError(response.errors);

      const transformedData = transformCountries(response);

      sessionStorage.setItem(
        sessionStorageKey,
        JSON.stringify(transformedData)
      );

      return transformedData;
    })
    .catch(handleNetworkError);
};
