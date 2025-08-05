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

export interface Company {
  id: string;
  name: string;
  email: string;
  legal_name?: string;
  vat_tax_id?: string;
  reseller_id?: string;
  legal_address?: CompanyLegalAddressModel;
  company_admin?: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
  };
}

export interface CompanyModel extends Company {
  // Extended properties for UI and permissions (from Customer context)
  canEdit?: boolean;
  customerRole?: CompanyRole;
  customerStatus?: string;
}