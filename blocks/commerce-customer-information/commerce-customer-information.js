import CustomerInformation from '@dropins/storefront-account/containers/CustomerInformation.js';
import { render as accountRenderer } from '@dropins/storefront-account/render.js';
import { fetchGraphQl } from '@dropins/storefront-company-management/api.js';
import {
  CUSTOMER_LOGIN_PATH,
  checkIsAuthenticated,
  rootLink,
} from '../../scripts/commerce.js';

// Initialize
import '../../scripts/initializers/account.js';

export default async function decorate(block) {
  if (!checkIsAuthenticated()) {
    window.location.href = rootLink(CUSTOMER_LOGIN_PATH);
  } else {
    await accountRenderer.render(CustomerInformation, {})(block);

    // Add company information below the customer information
    try {
      const response = await fetchGraphQl('query { company { name } customer { job_title telephone } }', { 
        method: 'GET', 
        cache: 'no-cache' 
      });

      const company = response?.data?.company;
      const customer = response?.data?.customer;

      // Only add company info if company data exists
      if (company?.name) {
        const companyInfoHTML = `
          <div class="account-company-information-card">
            <div class="account-company-information-card__content">
              <div class="account-company-information-card__field">
                <strong>Company:</strong> ${company.name}
              </div>
              <div class="account-company-information-card__field">
                <strong>Job Title:</strong> ${customer?.job_title || ''}
              </div>
              <div class="account-company-information-card__field">
                <strong>Work Phone Number:</strong> ${customer?.telephone || ''}
              </div>
            </div>
          </div>
        `;

        // Insert company info after the customer information card
        const companyInfoElement = document.createRange().createContextualFragment(companyInfoHTML);
        block.appendChild(companyInfoElement);
      }
    } catch (error) {
      console.error('Error loading company information:', error);
      // Silently fail - don't show company info if there's an error
    }
  }
}
