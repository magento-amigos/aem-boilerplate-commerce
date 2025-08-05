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

export const COMPANY_LEGAL_ADDRESS_FRAGMENT = /* GraphQL */ `
  fragment COMPANY_LEGAL_ADDRESS_FRAGMENT on CompanyLegalAddress {
    street
    city
    region {
      region
      region_code
      region_id
    }
    country_code
    postcode
    telephone
  }
`;

export const COMPANY_BASIC_INFO_FRAGMENT = /* GraphQL */ `
  fragment COMPANY_BASIC_INFO_FRAGMENT on Company {
    id
    name
    email
    legal_name
    vat_tax_id
    reseller_id
  }
`;

export const COMPANY_ADMIN_FRAGMENT = /* GraphQL */ `
  fragment COMPANY_ADMIN_FRAGMENT on Customer {
    id
    firstname
    lastname
    email
  }
`;

export const COMPANY_ROLE_FRAGMENT = /* GraphQL */ `
  fragment COMPANY_ROLE_FRAGMENT on CompanyRole {
    id
    name
    permissions {
      id
      text
    }
  }
`;

export const COMPANY_FULL_FRAGMENT = /* GraphQL */ `
  fragment COMPANY_FULL_FRAGMENT on Company {
    ...COMPANY_BASIC_INFO_FRAGMENT
    legal_address {
      ...COMPANY_LEGAL_ADDRESS_FRAGMENT
    }
    company_admin {
      ...COMPANY_ADMIN_FRAGMENT
    }
  }
  ${COMPANY_BASIC_INFO_FRAGMENT}
  ${COMPANY_LEGAL_ADDRESS_FRAGMENT}
  ${COMPANY_ADMIN_FRAGMENT}
`;