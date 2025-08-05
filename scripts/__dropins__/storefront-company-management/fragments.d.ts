export declare const COMPANY_LEGAL_ADDRESS_FRAGMENT = "\n  fragment COMPANY_LEGAL_ADDRESS_FRAGMENT on CompanyLegalAddress {\n    street\n    city\n    region {\n      region\n      region_code\n      region_id\n    }\n    country_code\n    postcode\n    telephone\n  }\n";
export declare const COMPANY_BASIC_INFO_FRAGMENT = "\n  fragment COMPANY_BASIC_INFO_FRAGMENT on Company {\n    id\n    name\n    email\n    legal_name\n    vat_tax_id\n    reseller_id\n  }\n";
export declare const COMPANY_ADMIN_FRAGMENT = "\n  fragment COMPANY_ADMIN_FRAGMENT on Customer {\n    id\n    firstname\n    lastname\n    email\n  }\n";
export declare const COMPANY_ROLE_FRAGMENT = "\n  fragment COMPANY_ROLE_FRAGMENT on CompanyRole {\n    id\n    name\n    permissions {\n      id\n      text\n    }\n  }\n";
export declare const COMPANY_FULL_FRAGMENT: string;
//# sourceMappingURL=fragments.d.ts.map