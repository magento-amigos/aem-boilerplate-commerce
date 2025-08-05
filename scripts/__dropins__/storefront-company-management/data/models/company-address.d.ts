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
export interface CompanyAddressInput extends CompanyLegalAddressInput {
}
export interface CompanyAddressModel extends CompanyLegalAddressModel {
}
//# sourceMappingURL=company-address.d.ts.map