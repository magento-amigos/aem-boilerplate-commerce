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

// https://storybook.js.org/docs/7.0/preact/writing-stories/introduction  
import type { Meta, StoryObj } from '@storybook/preact';
import { CompanyProfile } from './CompanyProfile';
import { CompanyProfileProps } from '../../types';

export default {
  title: 'Containers/CompanyProfile',
  component: CompanyProfile,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    withHeader: true,
    className: 'company-profile',
  },
  argTypes: {
    className: {
      control: 'text',
      description:
        'CSS class for additional styling customization of the CompanyProfile component.'
    },
    withHeader: {
      control: 'boolean',
      description: 'Defines if the container header is visible or not.',
    },
  },
} as Meta<CompanyProfileProps>;

export const Default: StoryObj<CompanyProfileProps> = {
  render: (args) => (
    <div style={{ margin: '0 20px' }}>
      <CompanyProfile {...args} />
    </div>
  ),
};

/**
 * CompanyProfile without header for embedded usage
 */
export const WithoutHeader: StoryObj<CompanyProfileProps> = {
  args: {
    withHeader: false,
    className: 'company-profile-embedded',
  },
  render: (args) => (
    <div style={{ margin: '0 20px' }}>
      <CompanyProfile {...args} />
    </div>
  ),
};

/**
 * CompanyProfile with custom styling
 */
export const CustomStyling: StoryObj<CompanyProfileProps> = {
  args: {
    withHeader: true,
    className: 'company-profile-custom',
  },
  render: (args) => (
    <div style={{ margin: '0 20px', backgroundColor: '#f5f5f5', padding: '20px' }}>
      <CompanyProfile {...args} />
    </div>
  ),
};
