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


import {
  setEndpoint,
  setFetchGraphQlHeader,
  removeFetchGraphQlHeader,
  setFetchGraphQlHeaders,
  fetchGraphQl,
  getConfig,
} from './fetch-graphql';

describe('fetch-graphql', () => {
  test('should return a methods', async () => {
    expect(typeof setEndpoint).toBe('function');
    expect(typeof setFetchGraphQlHeader).toBe('function');
    expect(typeof removeFetchGraphQlHeader).toBe('function');
    expect(typeof setFetchGraphQlHeaders).toBe('function');
    expect(typeof fetchGraphQl).toBe('function');
    expect(typeof getConfig).toBe('function');
  });
});
