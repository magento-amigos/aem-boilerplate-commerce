/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, modify, and distribute this
 * file in accordance with the terms of the Adobe license agreement
 * accompanying it.
 *******************************************************************/
interface Company {
    id: string;
    name: string;
}
interface CompanyOption {
    text: string;
    value: string;
}
interface CustomerCompanyInfo {
    currentCompany: Company | null;
    customerCompanies: CompanyOption[];
}
/**
 * Fetches customer company information including the current company and all available companies
 *
 * @returns Promise containing current company and list of available companies
 * @throws Will not throw errors - returns empty data on failure
 */
export declare const getCustomerCompanyInfo: () => Promise<CustomerCompanyInfo>;
export {};
//# sourceMappingURL=customerCompanies.d.ts.map