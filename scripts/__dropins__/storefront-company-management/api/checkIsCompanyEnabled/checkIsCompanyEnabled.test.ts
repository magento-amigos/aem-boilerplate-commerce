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

import { checkIsCompanyEnabled } from './checkIsCompanyEnabled';
import { fetchGraphQl } from '../fetch-graphql';

// Mock the fetchGraphQl function
jest.mock('../fetch-graphql', () => ({
  fetchGraphQl: jest.fn(),
}));

const mockFetchGraphQl = fetchGraphQl as jest.MockedFunction<typeof fetchGraphQl>;

describe('checkIsCompanyEnabled', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return companyEnabled: true when isCompanyEmailAvailable query succeeds', async () => {
    // Mock successful response
    mockFetchGraphQl.mockResolvedValue({
      data: {
        isCompanyEmailAvailable: {
          is_email_available: true,
        },
      },
      errors: undefined,
    });

    const result = await checkIsCompanyEnabled();

    expect(result).toEqual({
      companyEnabled: true,
    });

    expect(mockFetchGraphQl).toHaveBeenCalledWith(
      expect.stringContaining('query checkIsCompanyEnabled')
    );
  });

  it('should return companyEnabled: true even when email is not available', async () => {
    // Mock successful response but email not available
    mockFetchGraphQl.mockResolvedValue({
      data: {
        isCompanyEmailAvailable: {
          is_email_available: false,
        },
      },
      errors: undefined,
    });

    const result = await checkIsCompanyEnabled();

    expect(result).toEqual({
      companyEnabled: true,
    });
  });

  it('should return companyEnabled: false when query has errors (Company functionality not available)', async () => {
    // Mock GraphQL error response
    mockFetchGraphQl.mockResolvedValue({
      data: null,
      errors: [
        {
          message: 'Cannot query field "isCompanyEmailAvailable" on type "Query".',
          extensions: { category: 'graphql' },
        },
      ],
    });

    const result = await checkIsCompanyEnabled();

    expect(result).toEqual({
      companyEnabled: false,
      error: 'Company functionality not available',
    });
  });

  it('should return companyEnabled: false when fetchGraphQl throws an error', async () => {
    // Mock network error
    mockFetchGraphQl.mockRejectedValue(new Error('Network error'));

    const result = await checkIsCompanyEnabled();

    expect(result).toEqual({
      companyEnabled: false,
      error: 'Company functionality not available',
    });
  });

  it('should call fetchGraphQl with correct query', async () => {
    mockFetchGraphQl.mockResolvedValue({
      data: {
        isCompanyEmailAvailable: {
          is_email_available: true,
        },
      },
      errors: undefined,
    });

    await checkIsCompanyEnabled();

    expect(mockFetchGraphQl).toHaveBeenCalledWith(
      expect.stringContaining('isCompanyEmailAvailable(email: "test@test.com")')
    );
    expect(mockFetchGraphQl).toHaveBeenCalledWith(
      expect.stringContaining('is_email_available')
    );
  });
});