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


import { classes, Container } from '@adobe-commerce/elsie/lib';
import { Header } from '@adobe-commerce/elsie/components';
import { useText } from '@adobe-commerce/elsie/i18n';
import { CompanyProfileCard } from '../../components/CompanyProfileCard';
import { EditCompanyProfile } from '../../components/EditCompanyProfile';
import { CompanyCardLoader } from '../../components/CompanyLoaders';
import { useCompanyProfile } from '../../hooks/containers/useCompanyProfile';
import { useInLineAlert } from '../../hooks/useInLineAlert';
import { CompanyProfileProps } from '../../types/companyProfile.types';
import { checkIsCompanyEnabled } from '../../api/checkIsCompanyEnabled';
import { useEffect, useState } from 'preact/hooks';

export const CompanyProfile: Container<CompanyProfileProps> = ({
  className,
  withHeader = true,
  slots,
}) => {
  const [companyEnabled, setCompanyEnabled] = useState<boolean | null>(null);
  const translations = useText({
    containerTitle: 'Company.CompanyProfile.containerTitle',
  });
  const { inLineAlertProps, handleSetInLineAlert } = useInLineAlert();
  const {
    company,
    loading,
    saving,
    showEditForm,
    handleShowEditForm,
    handleHideEditForm,
    handleUpdateCompany,
  } = useCompanyProfile({ handleSetInLineAlert });

  useEffect(() => {
    const checkCompany = async () => {
      const result = await checkIsCompanyEnabled();
      setCompanyEnabled(result.companyEnabled);
    };
    checkCompany();
  }, []);

  if (companyEnabled === false) {
    // Redirect to customer account when company functionality is not enabled
    window.location.href = '/customer/account';
    return null;
  }

  if (loading || companyEnabled === null)
    return (
      <div data-testid="companyProfileLoader">
        <CompanyCardLoader withCard />
      </div>
    );

  return (
    <div className={classes(['account-company-profile', className])}>
      {withHeader ? (
        <Header
          title={translations.containerTitle}
          divider={false}
          className={'company-profile__title'}
        />
      ) : null}
      <CompanyProfileCard
        company={company}
        slots={slots}
        showEditForm={showEditForm}
        handleShowEditForm={handleShowEditForm}
      />
      {showEditForm ? (
        <EditCompanyProfile
          inLineAlertProps={inLineAlertProps}
          company={company}
          loading={saving}
          onSubmit={handleUpdateCompany}
          onCancel={handleHideEditForm}
        />
      ) : null}
    </div>
  );
};
