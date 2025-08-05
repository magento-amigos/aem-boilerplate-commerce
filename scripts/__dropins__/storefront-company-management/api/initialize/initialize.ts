import { FetchGraphQL } from '@adobe-commerce/fetch-graphql';

const { setEndpoint, setFetchGraphQlHeader, setFetchGraphQlHeaders: setHeaders } = new FetchGraphQL().getMethods();

export interface CompanyDropinConfig {
  langDefinitions?: Record<string, Record<string, string>>;
  models?: Record<string, any>;
}

export const initialize = async (config: CompanyDropinConfig = {}) => {
  // Set language definitions if provided
  if (config.langDefinitions) {
    // This would be handled by the UI provider
    console.log('Language definitions set:', config.langDefinitions);
  }

  // Set data models if provided
  if (config.models) {
    console.log('Data models configured:', config.models);
  }

  return {
    success: true,
    config,
  };
};

export const setFetchGraphQlHeaders = (headers: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => {
  if (typeof headers === 'function') {
    // Get current headers and merge
    setHeaders(headers);
  } else {
    // Set headers directly
    Object.entries(headers).forEach(([key, value]) => {
      setFetchGraphQlHeader(key, value);
    });
  }
};