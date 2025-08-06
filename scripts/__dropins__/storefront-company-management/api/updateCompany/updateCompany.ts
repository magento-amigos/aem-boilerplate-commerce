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
  // Transform field names to match GraphQL schema expectations
  const transformedInput: any = {};
  
  // Map frontend field names to GraphQL schema field names
  if (input.name !== undefined) {
    transformedInput.company_name = input.name;
  }
  if (input.email !== undefined) {
    transformedInput.company_email = input.email;
  }
  if (input.legal_name !== undefined) {
    transformedInput.legal_name = input.legal_name;
  }
  if (input.vat_tax_id !== undefined) {
    transformedInput.vat_tax_id = input.vat_tax_id;
  }
  if (input.reseller_id !== undefined) {
    transformedInput.reseller_id = input.reseller_id;
  }
  
  // Copy any other fields that don't need transformation
  Object.keys(input).forEach(key => {
    if (!['name', 'email', 'legal_name', 'vat_tax_id', 'reseller_id'].includes(key)) {
      transformedInput[key] = input[key];
    }
  });

  return await fetchGraphQl(UPDATE_COMPANY, {
    method: 'POST',
    variables: { input: transformedInput },
  })
    .then((response: updateCompanyResponse) => {
      if (response.errors?.length) return handleFetchError(response.errors);

      return transformCompany(response);
    })
    .catch(handleNetworkError);
};