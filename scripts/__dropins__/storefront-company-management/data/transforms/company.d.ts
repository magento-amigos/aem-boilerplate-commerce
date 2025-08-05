import { Company, CompanyModel } from '../models/company';
import { CompanyLegalAddressModel, CompanyLegalAddressInput } from '../models/company-address';

/**
 * Transform company legal address from GraphQL response to UI model
 */
export declare const transformCompanyLegalAddress: (address?: any) => CompanyLegalAddressModel | undefined;
/**
 * Transform company from GraphQL response to UI model (simplified - permissions handled in getCompany)
 */
export declare const transformCompany: (company: Company) => CompanyModel;
/**
 * Transform company address input for GraphQL mutation
 */
export declare const transformCompanyAddressInput: (address: CompanyLegalAddressModel) => CompanyLegalAddressInput;
/**
 * Transform company input for GraphQL mutation
 * Adobe Commerce B2B uses different field names for updates
 */
export declare const transformCompanyInput: (company: Partial<CompanyModel>) => any;
//# sourceMappingURL=company.d.ts.map