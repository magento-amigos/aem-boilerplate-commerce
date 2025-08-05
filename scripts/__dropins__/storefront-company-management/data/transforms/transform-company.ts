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

import { getCompanyResponse, updateCompanyResponse } from '../../types';
import { CompanyModel } from '../models/company';
import { merge } from '@adobe-commerce/elsie/lib';

export const transformCompany = (
  response: getCompanyResponse | updateCompanyResponse
): CompanyModel => {
  // Handle both getCompany and updateCompany response structures
  const companyData = 'updateCompany' in response.data 
    ? response.data.updateCompany.company 
    : response.data.company;
  
  const customerData = 'customer' in response.data ? response.data.customer : undefined;

  // Transform legal address
  const legalAddress = companyData?.legal_address ? {
    street: companyData.legal_address.street || [],
    city: companyData.legal_address.city || '',
    region: companyData.legal_address.region ? {
      region: companyData.legal_address.region.region || '',
      regionCode: companyData.legal_address.region.region_code || '',
      regionId: companyData.legal_address.region.region_id || 0,
    } : undefined,
    countryCode: companyData.legal_address.country_code || '',
    postcode: companyData.legal_address.postcode || '',
    telephone: companyData.legal_address.telephone,
  } : undefined;

  // Determine permissions
  const customerRole = customerData?.role;
  const userPermissions = customerRole?.permissions?.map((p: any) => p.text) || [];
  const canEdit = userPermissions.includes('Magento_Company::company_edit') || 
                  userPermissions.includes('Magento_Company::edit_company_profile') ||
                  customerRole?.name === 'Company Administrator';

  const model: CompanyModel = {
    id: companyData?.id || '',
    name: companyData?.name || '',
    email: companyData?.email || '',
    legal_name: companyData?.legal_name,
    vat_tax_id: companyData?.vat_tax_id,
    reseller_id: companyData?.reseller_id,
    legal_address: legalAddress,
    company_admin: companyData?.company_admin,
    canEdit,
    customerRole,
    customerStatus: customerData?.status,
  };

  return model;
};