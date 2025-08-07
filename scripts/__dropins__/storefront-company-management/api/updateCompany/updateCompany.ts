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
  
  // Transform legal address
  if (input.legal_address !== undefined) {
    // Handle street field - ensure it's always a flat array of strings
    let streetArray;
    if (Array.isArray(input.legal_address.street)) {
      // If street is already an array, use it directly and add street_2 if present
      streetArray = [...input.legal_address.street];
      if (input.legal_address.street_2) {
        streetArray.push(input.legal_address.street_2);
      }
    } else {
      // If street is a string, create array normally
      streetArray = [input.legal_address.street, input.legal_address.street_2].filter(Boolean);
    }
    
    // Remove any empty strings and ensure all elements are strings
    streetArray = streetArray.filter(street => street && typeof street === 'string' && street.trim().length > 0);
    
    // Handle region - different approaches for dropdown vs custom regions
    let regionValue;
    if (input.legal_address.region && typeof input.legal_address.region === 'object') {
      const regionObj = input.legal_address.region;
      
      // Check if this is a custom region (region === region_code) or predefined region
      if (regionObj.region === regionObj.region_code) {
        // Custom region - send as object with region_id: 0
        regionValue = {
          region: regionObj.region,
          region_code: regionObj.region_code,
          region_id: 0
        };
      } else {
        // Predefined region - send as object
        regionValue = {
          region: regionObj.region,
          region_code: regionObj.region_code,
        };
      }
    } else if (input.legal_address.region_code && input.legal_address.region !== input.legal_address.region_code) {
      // If we have different region and region_code (dropdown case)
      regionValue = {
        region: input.legal_address.region || input.legal_address.region_code,
        region_code: input.legal_address.region_code,
      };
    } else if (input.legal_address.region) {
      // If we only have region string (fallback case)
      regionValue = {
        region: input.legal_address.region,
        region_code: input.legal_address.region,
        region_id: 0
      };
    }
    
    transformedInput.legal_address = {
      street: streetArray,
      city: input.legal_address.city,
      region: regionValue,
      country_id: input.legal_address.country_code, // GraphQL expects country_id, not country_code
      postcode: input.legal_address.postcode,
      telephone: input.legal_address.telephone,
    };
  }
  
  // Copy any other fields that don't need transformation
  Object.keys(input).forEach(key => {
    if (!['name', 'email', 'legal_name', 'vat_tax_id', 'reseller_id', 'legal_address'].includes(key)) {
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
