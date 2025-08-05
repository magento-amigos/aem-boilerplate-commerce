import { FunctionComponent } from 'preact';
import { Card, Button } from '@adobe-commerce/elsie/components';
import { classes, Slot } from '@adobe-commerce/elsie/lib';
import { CompanyProfileCardProps } from '../../types';

export const CompanyProfileCard: FunctionComponent<CompanyProfileCardProps> = ({
  company,
  slots,
  showEditForm,
  handleShowEditForm,
}) => {
  if (!company) {
    return (
      <Card variant="secondary" className="account-company-profile-card">
        <div className="account-company-profile-card__wrapper">
          <div className="account-company-profile-card__content">
            <p>Company profile not available. Please contact your administrator.</p>
          </div>
        </div>
      </Card>
    );
  }

  const companyData = [
    { name: 'name', label: 'Company Name', value: company.name || '' },
    { name: 'email', label: 'Email', value: company.email || '' },
    { name: 'legal_name', label: 'Legal Name', value: company.legal_name || '' },
    { name: 'vat_tax_id', label: 'VAT/Tax ID', value: company.vat_tax_id || '' },
    { name: 'reseller_id', label: 'Reseller ID', value: company.reseller_id || '' },
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
              Edit
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
                <>
                  <p><strong>Legal Address:</strong></p>
                  {company.legal_address.street?.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                  <p>
                    {company.legal_address.city}, {company.legal_address.region?.region} {company.legal_address.postcode}
                  </p>
                  <p>{company.legal_address.countryCode}</p>
                  {company.legal_address.telephone && (
                    <p>Phone: {company.legal_address.telephone}</p>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  );
};