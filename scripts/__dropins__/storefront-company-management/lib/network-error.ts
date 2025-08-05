/********************************************************************
 * ADOBE CONFIDENTIAL
 * __________________
 *
 *  Copyright 2024 Adobe
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

import { events } from '@adobe-commerce/event-bus';

/**
 * A function which can be attached to fetchGraphQL to handle thrown errors in
 * a generic way.
 */
export const handleNetworkError = (error: Error) => {
  const isAbortError =
    error instanceof DOMException && error.name === 'AbortError';

  if (!isAbortError) {
    // @ts-ignore
    events.emit('error', {
      source: 'company',
      type: 'network',
      error,
    });
  }
  throw error;
};