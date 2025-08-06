import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import {
  Button,
  Card,
  Header,
  InLineAlert,
  Input,
  Field,
} from '@adobe-commerce/elsie/components';
import { useText } from '@adobe-commerce/elsie/i18n';
import { EditCompanyProfileProps } from '../../types/companyProfile.types';
import './EditCompanyProfile.css';

export const EditCompanyProfile: FunctionComponent<EditCompanyProfileProps> = ({
  inLineAlertProps,
  company,
  loading = false,
  onSubmit,
  onCancel,
}) => {
  const translations = useText({
    title: 'Company.EditCompanyProfile.title',
    companyName: 'Company.shared.fields.companyName',
    email: 'Company.shared.fields.email',
    legalName: 'Company.shared.fields.legalName',
    vatTaxId: 'Company.shared.fields.vatTaxId',
    resellerId: 'Company.shared.fields.resellerId',
    cancel: 'Company.shared.buttons.cancel',
    save: 'Company.shared.buttons.save',
    saving: 'Company.shared.buttons.saving',
  });
  const [formData, setFormData] = useState({
    name: company?.name || '',
    email: company?.email || '',
    legal_name: company?.legal_name || '',
    vat_tax_id: company?.vat_tax_id || '',
    reseller_id: company?.reseller_id || '',
  });

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    if (onSubmit) {
      await onSubmit(formData);
    }
  };

  const handleInputChange = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card variant="secondary" className={'account-edit-company-profile'}>
      <Header
        title={translations.title}
        divider={false}
        className={'account-edit-company-profile__title'}
      />
      {inLineAlertProps?.text ? (
        <InLineAlert
          className="account-edit-company-profile__notification"
          type={inLineAlertProps.type}
          variant="secondary"
          heading={inLineAlertProps.text}
          icon={inLineAlertProps.icon}
          data-testid="editCompanyInLineAlert"
        />
      ) : null}
      <form
        className="account-edit-company-profile-form"
        onSubmit={handleSubmit}
      >
        <Field label={translations.companyName} required className="account-edit-company-profile-form__field">
          <Input
            name="name"
            type="text"
            value={formData.name}
            onValue={handleInputChange('name')}
            disabled={loading}
            variant="primary"
            size="medium"
          />
        </Field>

        <Field label={translations.email} required className="account-edit-company-profile-form__field">
          <Input
            name="email"
            type="email"
            value={formData.email}
            onValue={handleInputChange('email')}
            disabled={loading}
            variant="primary"
            size="medium"
          />
        </Field>

        <Field label={translations.legalName} className="account-edit-company-profile-form__field">
          <Input
            name="legal_name"
            type="text"
            value={formData.legal_name}
            onValue={handleInputChange('legal_name')}
            disabled={loading}
            variant="primary"
            size="medium"
          />
        </Field>

        <Field label={translations.vatTaxId} className="account-edit-company-profile-form__field">
          <Input
            name="vat_tax_id"
            type="text"
            value={formData.vat_tax_id}
            onValue={handleInputChange('vat_tax_id')}
            disabled={loading}
            variant="primary"
            size="medium"
          />
        </Field>

        <Field label={translations.resellerId} className="account-edit-company-profile-form__field">
          <Input
            name="reseller_id"
            type="text"
            value={formData.reseller_id}
            onValue={handleInputChange('reseller_id')}
            disabled={loading}
            variant="primary"
            size="medium"
          />
        </Field>

        <div className="account-edit-company-profile__actions">
          <Button
            disabled={loading}
            // @ts-ignore
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            {translations.cancel}
          </Button>
          <Button disabled={loading} type="submit" variant="primary">
            {loading ? translations.saving : translations.save}
          </Button>
        </div>
      </form>
    </Card>
  );
};