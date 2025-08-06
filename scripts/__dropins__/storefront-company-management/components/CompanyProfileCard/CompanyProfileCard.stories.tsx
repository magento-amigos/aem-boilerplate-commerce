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

// https://storybook.js.org/docs/7.0/preact/writing-stories/introduction
import type { Meta, StoryObj } from '@storybook/preact';
import { CompanyProfileCard } from './CompanyProfileCard';
import { CompanyProfileCardProps } from '../../types/companyProfile.types';
import { action } from '@storybook/addon-actions';

/**
 * Storybook meta configuration for CompanyProfileCard component.
 */
const meta: Meta<CompanyProfileCardProps> = {
  title: 'Components/CompanyProfileCard',
  component: CompanyProfileCard,
  argTypes: {
    company: {
      description: 'Company information object containing basic details and permissions',
      control: 'object',
      defaultValue: {
        id: '1',
        name: 'Example Company',
        email: 'contact@example.com',
        canEdit: true,
      },
    },
    showEditForm: {
      description: 'Boolean flag indicating if the edit form is currently displayed',
      control: 'boolean',
      defaultValue: false,
    },
    slots: {
      description: 'Slot configuration for customizing company data display',
      control: 'object',
    },
    handleShowEditForm: {
      description: 'Function to show the edit form. Triggered when Edit button is clicked.',
      action: 'showEditForm',
    },
  },
};

export default meta;

type Story = StoryObj<CompanyProfileCardProps>;

/**
 * Basic story for the CompanyInformationCard component with standard company data.
 */
export const Basic: Story = {
  args: {
    company: {
      id: '1',
      name: 'Acme Corporation',
      email: 'info@acme.com',
      legal_name: 'Acme Corporation LLC',
      vat_tax_id: 'VAT123456789',
      reseller_id: 'RES987654321',
      legal_address: {
        street: ['123 Business Ave', 'Suite 100'],
        city: 'San Francisco',
        region: {
          region: 'California',
          regionCode: 'CA',
          regionId: 12,
        },
        countryCode: 'US',
        postcode: '94105',
        telephone: '+1-555-0199',
      },
      canEdit: true,
      customerRole: {
        id: '1',
        name: 'Company Administrator',
        permissions: [
          { id: '1', text: 'Magento_Company::edit_company_profile' },
        ],
      },
      customerStatus: 'ACTIVE',
    },
    showEditForm: false,
    handleShowEditForm: () => {
      action('showEditForm')();
      console.log('Show edit form clicked');
    },
  },
};

/**
 * Story showing the card when edit form is active (condensed view).
 */
export const WithEditFormActive: Story = {
  args: {
    ...Basic.args,
    showEditForm: true,
  },
};

/**
 * Story showing the card for a user without edit permissions.
 */
export const ReadOnlyView: Story = {
  args: {
    ...Basic.args,
    company: {
      ...Basic.args!.company!,
      canEdit: false,
      customerRole: {
        id: '2',
        name: 'Company User',
        permissions: [],
      },
    },
  },
};

/**
 * Story showing the card with minimal company information.
 */
export const MinimalInformation: Story = {
  args: {
    ...Basic.args,
    company: {
      id: '1',
      name: 'Small Business',
      email: 'contact@smallbiz.com',
      canEdit: true,
    },
  },
};

/**
 * Story showing the card when no company data is available.
 */
export const NoCompanyData: Story = {
  args: {
    ...Basic.args,
    company: null,
  },
};