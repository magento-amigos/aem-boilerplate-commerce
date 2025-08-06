import { FunctionComponent } from 'preact';
import { Card, Button } from '@adobe-commerce/elsie/components';
import { classes, Slot } from '@adobe-commerce/elsie/lib';
import { useText } from '@adobe-commerce/elsie/i18n';
import { CompanyProfileCardProps } from '../../types/companyProfile.types';
import './CompanyProfileCard.css';

export const CompanyProfileCard: FunctionComponent<CompanyProfileCardProps> = ({
  company,
  slots,
  showEditForm,
  handleShowEditForm,
}) => {
  const translations = useText({
    editButton: 'Company.shared.buttons.edit',
    noDataMessage: 'Company.CompanyProfileCard.noDataMessage',
    companyName: 'Company.shared.fields.companyName',
    email: 'Company.shared.fields.email',
    legalName: 'Company.shared.fields.legalName',
    vatTaxId: 'Company.shared.fields.vatTaxId',
    resellerId: 'Company.shared.fields.resellerId',
    legalAddress: 'Company.shared.fields.legalAddress',
  });
  
  if (!company) {
    return (
      <Card variant="secondary" className="account-company-profile-card">
        <div className="account-company-profile-card__wrapper">
          <div className="account-company-profile-card__content">
            <div className="account-company-profile-card__no-data">
              <p>{translations.noDataMessage}</p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  const companyData = [
    { name: 'name', label: translations.companyName, value: company.name || '' },
    { name: 'email', label: translations.email, value: company.email || '' },
    { name: 'legal_name', label: translations.legalName, value: company.legal_name || '' },
    { name: 'vat_tax_id', label: translations.vatTaxId, value: company.vat_tax_id || '' },
    { name: 'reseller_id', label: translations.resellerId, value: company.reseller_id || '' },
  ];

  return (
    <Card
      variant="secondary"
      className={classes([
        'account-company-profile-card',
        [
          'account-company-profile-card-short',
          showEditForm,
        ],
      ])}
    >
      <div className="account-company-profile-card__wrapper">
        <div className="account-company-profile-card__actions">
          {company.canEdit && (
            <Button
              // @ts-ignore
              type="button"
              variant="tertiary"
              onClick={handleShowEditForm}
            >
              {translations.editButton}
            </Button>
          )}
        </div>
        <div className="account-company-profile-card__content">
          {slots?.CompanyData ? (
            <Slot
              name="CompanyData"
              slot={slots?.CompanyData}
              context={{ companyData }}
            />
          ) : (
            <>
              {companyData.map((el, index) => {
                if (!el.value) return null;
                const value = !el.label
                  ? el.value
                  : `${el.label}: ${el.value}`;

                return (
                  <p
                    key={`${el.name}_${index}`}
                    data-testid={`${el.name}_${index}`}
                  >
                    {value}
                  </p>
                );
              })}
              {company.legal_address && (
                <div className="company-legal-address">
                  <p><strong>{translations.legalAddress}:</strong></p>
                  {company.legal_address.street?.map((line: string, i: number) => (
                    <p key={i}>{line}</p>
                  ))}
                  <p>
                    {company.legal_address.city}, {company.legal_address.region?.region} {company.legal_address.postcode}
                  </p>
                  <p>{company.legal_address.countryCode}</p>
                  {company.legal_address.telephone && (
                    <p>Phone: {company.legal_address.telephone}</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  );
};