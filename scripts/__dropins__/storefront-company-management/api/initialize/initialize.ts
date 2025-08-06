import { FetchGraphQL } from '@adobe-commerce/fetch-graphql';

const { setEndpoint, setFetchGraphQlHeader, setFetchGraphQlHeaders } = new FetchGraphQL().getMethods();

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

