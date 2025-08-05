import { CompanyProfile } from '../../scripts/__dropins__/storefront-company-management/containers/CompanyProfile.js';
import { render as companyRenderer } from '../../scripts/__dropins__/storefront-company-management/render.js';
import {
  CUSTOMER_LOGIN_PATH,
  checkIsAuthenticated,
  rootLink,
} from '../../scripts/commerce.js';

// Initialize
import '../../scripts/initializers/company.js';

export default async function decorate(block) {
  if (!checkIsAuthenticated()) {
    window.location.href = rootLink(CUSTOMER_LOGIN_PATH);
  } else {
    await companyRenderer.render(CompanyProfile, {})(block);
  }
}