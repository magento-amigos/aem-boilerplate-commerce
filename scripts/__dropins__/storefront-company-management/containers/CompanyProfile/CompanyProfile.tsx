import { classes, Container } from '@adobe-commerce/elsie/lib';
import { Header } from '@adobe-commerce/elsie/components';
import { CompanyProfileCard } from '../../components/CompanyProfileCard';
import { EditCompanyProfile } from '../../components/EditCompanyProfile';
import { CompanyCardLoader } from '../../components/CompanyLoaders';
import { useCompanyProfile } from '../../hooks/containers/useCompanyProfile';
import { useInLineAlert } from '../../hooks/useInLineAlert';
import { CompanyProfileProps } from '../../types/companyProfile.types';

export const CompanyProfile: Container<CompanyProfileProps> = ({
  className,
  withHeader = true,
  slots,
}) => {
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

  if (loading) {
    return (
      <div data-testid="companyProfileLoader">
        <CompanyCardLoader withCard />
      </div>
    );
  }

  return (
    <div className={classes(['account-company-profile', className])}>
      {withHeader ? (
        <Header
          title="Company Profile"
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