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
import { EditCompanyProfile } from './EditCompanyProfile';
import { EditCompanyProfileProps } from '../../types';
import { action } from '@storybook/addon-actions';

/**
 * Storybook meta configuration for EditCompanyProfile component.
 */
const meta: Meta<EditCompanyProfileProps> = {
  title: 'Components/EditCompanyProfile',
  component: EditCompanyProfile,
  argTypes: {
    inLineAlertProps: {
      description:
        'Inline alert configuration including text, type (success, error, etc.), and an optional icon.',
      control: 'object',
      defaultValue: {
        text: '',
        type: 'success',
        icon: undefined,
      },
    },
    company: {
      description: 'Company information object to populate the form fields',
      control: 'object',
      defaultValue: {
        id: '1',
        name: 'Example Company',
        email: 'contact@example.com',
      },
    },
    loading: {
      description:
        'Boolean flag to indicate whether the form submission is in a loading state.',
      control: 'boolean',
      defaultValue: false,
    },
    onSubmit: {
      description:
        'Function to handle form submission. Triggered when the form is submitted.',
      action: 'submitForm',
    },
    onCancel: {
      description:
        'Function to handle form cancellation. Triggered when Cancel button is clicked.',
      action: 'cancelForm',
    },
  },
};

export default meta;

type Story = StoryObj<EditCompanyInformationProps>;

/**
 * Basic story for the EditCompanyInformation component with default props.
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
      canEdit: true,
    },
    loading: false,
    inLineAlertProps: {},
    onSubmit: async (data) => {
      action('submitForm')(data);
      console.log('Form submitted with data:', data);
      return Promise.resolve();
    },
    onCancel: () => {
      action('cancelForm')();
      console.log('Form cancelled');
    },
  },
};

/**
 * Story with the form in a loading state, simulating a submission in progress.
 */
export const LoadingState: Story = {
  args: {
    ...Basic.args,
    loading: true,
    inLineAlertProps: {
      text: 'Saving your changes...',
      type: 'success',
    },
  },
};

/**
 * Story with a success alert after successful form submission.
 */
export const SuccessState: Story = {
  args: {
    ...Basic.args,
    inLineAlertProps: {
      text: 'Company information updated successfully!',
      type: 'success',
    },
  },
};

/**
 * Story with an error alert showing validation or submission errors.
 */
export const ErrorState: Story = {
  args: {
    ...Basic.args,
    inLineAlertProps: {
      text: 'Failed to update company information. Please try again.',
      type: 'error',
    },
  },
};

/**
 * Story with minimal company information to test form behavior with sparse data.
 */
export const MinimalData: Story = {
  args: {
    ...Basic.args,
    company: {
      id: '1',
      name: 'Small Business',
      email: 'contact@smallbiz.com',
    },
  },
};