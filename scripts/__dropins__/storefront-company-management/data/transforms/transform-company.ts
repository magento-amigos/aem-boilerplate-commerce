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

import { getCompanyResponse } from '../../types/api/getCompany.types';
import { updateCompanyResponse } from '../../types/api/updateCompany.types';
import { CompanyModel } from '../models/company';

export const transformCompany = (
  response: getCompanyResponse | updateCompanyResponse
): CompanyModel => {
  // Validate response structure
  if (!response?.data) {
    throw new Error('Invalid response: missing data');
  }

  // Handle both getCompany and updateCompany response structures
  const companyData: any = 'updateCompany' in response.data 
    ? response.data.updateCompany?.company 
    : response.data.company;
  
  if (!companyData) {
    throw new Error('Invalid response: missing company data');
  }
  
  const customerData = 'customer' in response.data ? response.data.customer : undefined;

  // Transform legal address with validation
  const legalAddress = companyData.legal_address ? {
    street: Array.isArray(companyData.legal_address.street) 
      ? companyData.legal_address.street.filter((line: string) => line && line.trim() !== '') 
      : [],
    city: (companyData.legal_address.city || '').trim(),
    region: companyData.legal_address.region ? {
      region: (companyData.legal_address.region.region || '').trim(),
      regionCode: (companyData.legal_address.region.region_code || '').trim(),
      regionId: companyData.legal_address.region.region_id ? Number(companyData.legal_address.region.region_id) : 0,
    } : undefined,
    countryCode: (companyData.legal_address.country_code || '').toUpperCase().trim(),
    postcode: (companyData.legal_address.postcode || '').trim(),
    telephone: companyData.legal_address.telephone ? 
      companyData.legal_address.telephone.trim() : undefined,
  } : undefined;

  // Determine permissions
  const customerRole = customerData?.role;
  const userPermissions = customerRole?.permissions?.map((p: any) => p.text) || [];
  const canEdit = userPermissions.includes('Magento_Company::company_edit') || 
                  userPermissions.includes('Magento_Company::edit_company_profile') ||
                  customerRole?.name === 'Company Administrator';

  // Build the model with proper validation
  const model: CompanyModel = {
    id: (companyData.id || '').toString(),
    name: (companyData.name || '').trim(),
    email: (companyData.email || '').trim().toLowerCase(),
    legal_name: companyData.legal_name ? companyData.legal_name.trim() : undefined,
    vat_tax_id: companyData.vat_tax_id ? companyData.vat_tax_id.trim() : undefined,
    reseller_id: companyData.reseller_id ? companyData.reseller_id.trim() : undefined,
    legal_address: legalAddress,
    company_admin: companyData.company_admin ? {
      id: (companyData.company_admin.id || '').toString(),
      firstname: (companyData.company_admin.firstname || '').trim(),
      lastname: (companyData.company_admin.lastname || '').trim(),
      email: (companyData.company_admin.email || '').trim().toLowerCase(),
      job_title: companyData.company_admin.job_title ? companyData.company_admin.job_title.trim() : undefined,
    } : undefined,

    // Transform sales representative
    sales_representative: companyData.sales_representative ? {
      firstname: (companyData.sales_representative.firstname || '').trim(),
      lastname: (companyData.sales_representative.lastname || '').trim(),
      email: (companyData.sales_representative.email || '').trim().toLowerCase(),
    } : undefined,

    // Transform payment methods (array of strings)
    payment_methods: companyData.payment_methods ? 
      companyData.payment_methods
        .filter((method: any) => method && typeof method === 'string')
        .map((method: string) => method.trim())
        .filter((method: string) => method.length > 0) : undefined,
    canEdit,
    customerRole,
    customerStatus: customerData?.status,
  };

  // Validate required fields
  if (!model.id) {
    throw new Error('Company ID is required');
  }
  
  if (!model.name) {
    throw new Error('Company name is required');
  }
  
  if (!model.email) {
    throw new Error('Company email is required');
  }

  return model;
};
