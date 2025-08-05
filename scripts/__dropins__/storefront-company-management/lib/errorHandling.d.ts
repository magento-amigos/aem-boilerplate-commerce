export interface CompanyError {
    source: string;
    type: 'network' | 'validation' | 'permission' | 'general';
    error: Error | string;
    context?: Record<string, any>;
}
/**
 * Handle and emit company-related errors
 */
export declare const handleCompanyError: (error: Error | string, type?: CompanyError['type'], context?: Record<string, any>) => never;
/**
 * Handle GraphQL errors and convert to user-friendly messages
 */
export declare const handleGraphQLErrors: (errors: any[]) => never;
/**
 * Handle network errors (timeouts, connection issues, etc.)
 */
export declare const handleNetworkError: (error: Error) => never;
/**
 * Handle permission errors
 */
export declare const handlePermissionError: (message: string) => never;
/**
 * Handle validation errors
 */
export declare const handleValidationError: (message: string, field?: string) => never;
//# sourceMappingURL=errorHandling.d.ts.map