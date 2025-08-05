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
import { EditCompanyProfileProps } from '../../types';

export const EditCompanyProfile: FunctionComponent<EditCompanyProfileProps> = ({
  inLineAlertProps,
  company,
  loading = false,
  onSubmit,
  onCancel,
}) => {
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
        title="Edit Company Profile"
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
        <Field label="Company Name" required>
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

        <Field label="Email" required>
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

        <Field label="Legal Name">
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

        <Field label="VAT/Tax ID">
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

        <Field label="Reseller ID">
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
            Cancel
          </Button>
          <Button disabled={loading} type="submit" variant="primary">
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Card>
  );
};