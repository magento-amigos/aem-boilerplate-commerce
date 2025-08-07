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

import { handleNetworkError } from '../../lib/network-error';
import { fetchGraphQl } from '../fetch-graphql';
import { handleFetchError } from '../../lib/fetch-error';
import { GET_COMPANY } from './graphql/getCompany.graphql';
import { transformCompany } from '../../data/transforms';
import { CompanyModel } from '../../data/models/company';
import { getCompanyResponse } from '../../types/api/getCompany.types';

export const getCompany = async (): Promise<CompanyModel> => {
  return await fetchGraphQl(GET_COMPANY, {
    method: 'GET',
    cache: 'no-cache',
  })
    .then((response: getCompanyResponse) => {
      if (response.errors?.length) return handleFetchError(response.errors);

      return transformCompany(response);
    })
    .catch(handleNetworkError);
};
