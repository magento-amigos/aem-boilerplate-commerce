import { events } from '@dropins/tools/event-bus.js';
import { getHeaders, getConfigValue } from '@dropins/tools/lib/aem/configs.js';
import { initializers } from '@dropins/tools/initializer.js';
import {
  initialize,
  setFetchGraphQlHeaders,
  setFetchGraphQlHeader as setCompanyGraphQlHeader,
  removeFetchGraphQlHeader as removeCompanyGraphQlHeader,
} from '@dropins/storefront-company-switcher/api.js';
import {
  setFetchGraphQlHeader as setCatalogGraphQlHeader,
  removeFetchGraphQlHeader as removeCatalogGraphQlHeader,
} from '@dropins/storefront-pdp/api.js';
import {
  setFetchGraphQlHeader as setCartGraphQlHeader,
  removeFetchGraphQlHeader as removeCartGraphQlHeader,
} from '@dropins/storefront-cart/api.js';
import {
  setFetchGraphQlHeader as setSearchGraphQlHeader,
  removeFetchGraphQlHeader as removeSearchGraphQlHeader,
} from '@dropins/storefront-product-discovery/api.js';
import {
  setFetchGraphQlHeader as setOrderGraphQlHeader,
  removeFetchGraphQlHeader as removeOrderGraphQlHeader,
} from '@dropins/storefront-order/api.js';
import {
  setFetchGraphQlHeader as setAccountGraphQlHeader,
  removeFetchGraphQlHeader as removeAccountGraphQlHeader,
} from '@dropins/storefront-account/api.js';

import { initializeDropin } from './index.js';
import { fetchPlaceholders } from '../commerce.js';

const headerKey = getConfigValue('company-switcher.company-header-key');
const companySessionKey = getConfigValue('company-switcher.company-session-key');

const setCompanyHeaderFns = [
  setCompanyGraphQlHeader,
  setCatalogGraphQlHeader,
  setCartGraphQlHeader,
  setSearchGraphQlHeader,
  setOrderGraphQlHeader,
  setAccountGraphQlHeader,
];

const removeCompanyHeaderFns = [
  removeCompanyGraphQlHeader,
  removeCatalogGraphQlHeader,
  removeCartGraphQlHeader,
  removeSearchGraphQlHeader,
  removeOrderGraphQlHeader,
  removeAccountGraphQlHeader,
];

function removeCompanyHeaders() {
  removeCompanyHeaderFns.forEach((removeFn) => {
    removeFn(headerKey);
  });
}

function setCompanyHeaders(companyId) {
  if (companyId == null) {
    removeCompanyHeaders();
    return;
  }

  setCompanyHeaderFns.forEach((setFn) => {
    setFn(headerKey, companyId);
  });
}

function handleAuthenticated(authenticated) {
  if (!authenticated) {
    sessionStorage.removeItem(companySessionKey);
    removeCompanyHeaders();
  }
}

function handleCompanyContextChanged(companyId) {
  setCompanyHeaders(companyId);
  sessionStorage.setItem(companySessionKey, companyId);
}

function restoreCompanyContext() {
  const companyId = sessionStorage.getItem(companySessionKey);
  if (companyId) {
    setCompanyHeaders(companyId);
  }
  events.emit('companyContext/restored', companyId);
}

await initializeDropin(async () => {
  setFetchGraphQlHeaders((prev) => ({ ...prev, ...getHeaders('company-switcher') }));

  const labels = await fetchPlaceholders('placeholders/company-switcher.json').catch(() => ({}));
  const langDefinitions = {
    default: {
      ...labels,
    },
  };

  restoreCompanyContext();
  events.on('companyContext/changed', handleCompanyContextChanged, { eager: true });
  events.on('authenticated', handleAuthenticated, { eager: true });

  return initializers.mountImmediately(initialize, { langDefinitions });
})();
