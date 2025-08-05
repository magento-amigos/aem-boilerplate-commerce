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

import { handleNetworkError } from '../../lib/network-error';
import { fetchGraphQl } from '../fetch-graphql';
import { handleFetchError } from '../../lib/fetch-error';
import { UPDATE_COMPANY } from './graphql/updateCompany.graphql';
import { transformCompany } from '../../data/transforms';
import { CompanyModel } from '../../data/models/company';
import { updateCompanyResponse } from '../../types';

export const updateCompany = async (input: any): Promise<CompanyModel> => {
  return await fetchGraphQl(UPDATE_COMPANY, {
    method: 'POST',
    variables: { input },
  })
    .then((response: updateCompanyResponse) => {
      if (response.errors?.length) return handleFetchError(response.errors);

      return transformCompany(response);
    })
    .catch(handleNetworkError);
};