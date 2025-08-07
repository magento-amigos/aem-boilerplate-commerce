/********************************************************************
 * ADOBE CONFIDENTIAL
 * __________________
 *
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 *******************************************************************/

import { initialize, CompanyDropinConfig } from './initialize';

describe('Company/api/initialize', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with empty config', async () => {
    const result = await initialize();
    
    expect(result).toEqual({
      success: true,
      config: {},
    });
  });

  test('should initialize with language definitions', async () => {
    const config: CompanyDropinConfig = {
      langDefinitions: {
        en_US: {
          companyName: 'Company Name',
          email: 'Email',
        },
      },
    };

    const result = await initialize(config);
    
    expect(result).toEqual({
      success: true,
      config,
    });
  });

  test('should initialize with data models', async () => {
    const config: CompanyDropinConfig = {
      models: {
        Company: { id: 'string', name: 'string' },
      },
    };

    const result = await initialize(config);
    
    expect(result).toEqual({
      success: true,
      config,
    });
  });

  test('should initialize with complete config', async () => {
    const config: CompanyDropinConfig = {
      langDefinitions: {
        en_US: {
          companyName: 'Company Name',
        },
      },
      models: {
        Company: { id: 'string', name: 'string' },
      },
    };

    const result = await initialize(config);
    
    expect(result).toEqual({
      success: true,
      config,
    });
  });
});
