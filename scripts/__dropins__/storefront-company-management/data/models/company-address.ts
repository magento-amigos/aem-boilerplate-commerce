// Updated to match Adobe Commerce B2B CompanyLegalAddress schema
export interface CompanyLegalAddressInput {
  street: string[];
  city: string;
  region?: {
    region?: string;
    region_code?: string;
    region_id?: number;
  };
  country_code: string;
  postcode: string;
  telephone?: string;
}

export interface CompanyLegalAddressModel {
  street?: string[];
  city?: string;
  region?: {
    region?: string;
    regionCode?: string;
    regionId?: number;
  };
  countryCode?: string;
  postcode?: string;
  telephone?: string;
}

// Legacy interface for backward compatibility
export interface CompanyAddressInput extends CompanyLegalAddressInput {}
export interface CompanyAddressModel extends CompanyLegalAddressModel {}