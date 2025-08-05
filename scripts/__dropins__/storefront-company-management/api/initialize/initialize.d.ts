export interface CompanyDropinConfig {
    langDefinitions?: Record<string, Record<string, string>>;
    models?: Record<string, any>;
}
export declare const initialize: (config?: CompanyDropinConfig) => Promise<{
    success: boolean;
    config: CompanyDropinConfig;
}>;
//# sourceMappingURL=initialize.d.ts.map