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
import { CompanyCardLoader, CompanyFormLoader } from './CompanyLoaders';

/**
 * Storybook meta configuration for CompanyCardLoader component.
 */
const cardLoaderMeta: Meta = {
  title: 'Components/CompanyLoaders/CompanyCardLoader',
  component: CompanyCardLoader,
  argTypes: {
    withCard: {
      description: 'Whether to wrap the loader in a Card component',
      control: 'boolean',
      defaultValue: false,
    },
    testId: {
      description: 'Test ID for the loader component',
      control: 'text',
      defaultValue: 'company-card-loader',
    },
  },
};

export default cardLoaderMeta;

type CardLoaderStory = StoryObj<typeof CompanyCardLoader>;

/**
 * Basic card loader without card wrapper.
 */
export const BasicCardLoader: CardLoaderStory = {
  args: {
    withCard: false,
    testId: 'company-card-loader',
  },
};

/**
 * Card loader wrapped in a Card component.
 */
export const CardLoaderWithCard: CardLoaderStory = {
  args: {
    withCard: true,
    testId: 'company-card-loader-with-card',
  },
};

/**
 * Storybook meta configuration for CompanyFormLoader component.
 */
export const FormLoaderMeta: Meta = {
  title: 'Components/CompanyLoaders/CompanyFormLoader',
  component: CompanyFormLoader,
  argTypes: {
    testId: {
      description: 'Test ID for the form loader component',
      control: 'text',
      defaultValue: 'company-form-loader',
    },
  },
};

type FormLoaderStory = StoryObj<typeof CompanyFormLoader>;

/**
 * Basic form loader for edit form loading states.
 */
export const BasicFormLoader: FormLoaderStory = {
  args: {
    testId: 'company-form-loader',
  },
};

/**
 * Combined loader states story showing both loaders together for comparison.
 */
export const LoaderComparison = () => (
  <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
    <div>
      <h3>Card Loader</h3>
      <CompanyCardLoader testId="comparison-card-loader" />
    </div>
    <div>
      <h3>Card Loader with Card</h3>
      <CompanyCardLoader withCard testId="comparison-card-loader-with-card" />
    </div>
    <div>
      <h3>Form Loader</h3>
      <CompanyFormLoader testId="comparison-form-loader" />
    </div>
  </div>
);

LoaderComparison.storyName = 'All Loaders Comparison';