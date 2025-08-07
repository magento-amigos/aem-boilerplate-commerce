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

import { FunctionComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { UIProvider } from '@adobe-commerce/elsie/components';
import { Lang } from '@adobe-commerce/elsie/i18n';
import { events } from '@adobe-commerce/event-bus';

import en_US from '../i18n/en_US.json';

// Langs
const langDefinitions = {
  default: en_US,
};

interface CompanyProviderProps {
  children?: any;
}

export const Provider: FunctionComponent<CompanyProviderProps> = ({
  children,
}) => {
  const [lang, setLang] = useState<Lang>('en_US');

  //   Events
  useEffect(() => {
    const localeEvent = events.on(
      'locale',
      (locale: string) => {
        setLang(locale as Lang);
      },
      { eager: true }
    );
    return () => {
      localeEvent?.off();
    };
  }, []);

  return (
    <UIProvider lang={lang} langDefinitions={langDefinitions}>
      {children}
    </UIProvider>
  );
};
