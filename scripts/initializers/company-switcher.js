import { events } from '@dropins/tools/event-bus.js';
import { getHeaders } from '@dropins/tools/lib/aem/configs.js';
import { initializers } from '@dropins/tools/initializer.js';
import { initialize, setFetchGraphQlHeaders } from '@dropins/storefront-company-switcher/api.js';
import * as pdpFetchGraphQl from '@dropins/storefront-pdp/api.js';
import * as cartFetchGraphQl from '@dropins/storefront-cart/api.js';
import * as searchFetchGraphQl from '@dropins/storefront-product-discovery/api.js';
import * as orderFetchGraphQl from '@dropins/storefront-order/api.js';
import * as accountFetchGraphQl from '@dropins/storefront-account/api.js';
import * as companyFetchGraphQl from '@dropins/storefront-company-switcher/api.js';

import { initializeDropin } from './index.js';
import { fetchPlaceholders } from '../commerce.js';

const headerKey = 'X-Adobe-Company';
const companySessionKey = 'DROPIN__COMPANYSWITCHER__COMPANY__CONTEXT';

const setCompanyHeaderFns = [];
const removeCompanyHeaderFns = [];
[
  pdpFetchGraphQl,
  cartFetchGraphQl,
  searchFetchGraphQl,
  orderFetchGraphQl,
  accountFetchGraphQl,
  companyFetchGraphQl,
].forEach(({ setFetchGraphQlHeader, removeFetchGraphQlHeader }) => {
  setCompanyHeaderFns.push(setFetchGraphQlHeader);
  removeCompanyHeaderFns.push(removeFetchGraphQlHeader);
});

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

export function restoreCompanyContext() {
  const companyId = sessionStorage.getItem(companySessionKey);
  if (companyId) {
    setCompanyHeaders(companyId);
  }
  events.emit('companyContext/restored', companyId);
}

events.on('companyContext/changed', handleCompanyContextChanged, { eager: true });
events.on('authenticated', handleAuthenticated, { eager: true });

await initializeDropin(async () => {
  setFetchGraphQlHeaders((prev) => ({ ...prev, ...getHeaders('company-switcher') }));

  const labels = await fetchPlaceholders('placeholders/company-switcher.json').catch(() => ({}));
  const langDefinitions = {
    default: {
      ...labels,
    },
  };

  return initializers.mountImmediately(initialize, { langDefinitions });
})();
