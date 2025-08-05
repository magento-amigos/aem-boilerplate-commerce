/**
 * Session storage cache utilities for company data
 */
export declare class SessionCache {
    private static readonly PREFIX;
    /**
     * Generate cache key with prefix
     */
    private static getCacheKey;
    /**
     * Get cached data from session storage
     */
    static get<T>(key: string): T | null;
    /**
     * Set data in session storage cache
     */
    static set<T>(key: string, data: T): void;
    /**
     * Remove data from session storage cache
     */
    static remove(key: string): void;
    /**
     * Clear all company-related cache
     */
    static clear(): void;
}
//# sourceMappingURL=sessionCache.d.ts.map