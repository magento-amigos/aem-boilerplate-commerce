/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, modify, and distribute this
 * file in accordance with the terms of the Adobe license agreement
 * accompanying it.
 *******************************************************************/
/**
 * Represents a company entity
 */
export interface Company {
    id: string;
    name: string;
}
/**
 * Represents a company option for the picker component
 */
export interface CompanyOption {
    text: string;
    value: string;
}
/**
 * Contains customer's current company and available companies
 */
export interface CustomerCompanyInfo {
    currentCompany: Company | null;
    customerCompanies: CompanyOption[];
}
/**
 * Return type for the useCompanyData hook
 */
export interface UseCompanyDataReturn {
    companies: CompanyOption[];
    currentCompany: CompanyOption;
    handleCompanyChange: (event: Event) => void;
}
/**
 * GraphQL response data structure
 */
export interface GraphQLResponseData {
    company: Company | null;
    customer: {
        companies: {
            items: Company[];
        };
    };
}
/**
 * GraphQL response wrapper
 */
export interface GraphQLResponse {
    data: GraphQLResponseData;
}
//# sourceMappingURL=company.d.ts.map