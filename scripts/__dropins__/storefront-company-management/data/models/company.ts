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

import { CompanyLegalAddressModel } from './company-address';

// Adobe Commerce B2B Company GraphQL types
export interface CompanyRole {
  id: string;
  name: string;
  permissions?: {
    id: string;
    text: string;
  }[];
}

export interface CompanyContact {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  job_title?: string;
}

export interface CompanySalesRepresentative {
  firstname: string;
  lastname: string;
  email: string;
}

export interface Company {
  id: string;
  name: string;
  email: string;
  legal_name?: string;
  vat_tax_id?: string;
  reseller_id?: string;
  legal_address?: CompanyLegalAddressModel;
  company_admin?: CompanyContact;
  sales_representative?: CompanySalesRepresentative;
  payment_methods?: string[];
}

export interface CompanyModel extends Company {
  // Extended properties for UI and permissions (from Customer context)
  canEdit?: boolean;
  customerRole?: CompanyRole;
  customerStatus?: string;
}
