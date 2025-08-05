/**
 * Convert snake_case to camelCase
 */
export declare const toCamelCase: (str: string) => string;
/**
 * Convert camelCase to snake_case
 */
export declare const toSnakeCase: (str: string) => string;
/**
 * Recursively convert object keys between camelCase and snake_case
 */
export declare const convertObjectCase: (obj: any, caseType: 'camelCase' | 'snakeCase', keyMapping?: Record<string, string>) => any;
//# sourceMappingURL=convertCase.d.ts.map