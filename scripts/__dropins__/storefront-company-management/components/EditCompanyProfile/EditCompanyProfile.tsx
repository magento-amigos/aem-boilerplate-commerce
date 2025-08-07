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


import { FunctionComponent } from 'preact';
import { useState, useEffect, useMemo } from 'preact/hooks';
import {
  Button,
  Card,
  Header,
  InLineAlert,
  Input,
  Field,
  Picker,
} from '@adobe-commerce/elsie/components';
import { useText } from '@adobe-commerce/elsie/i18n';
import { getCountries } from '../../api';
import { Country } from '../../data/models';
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
    legalAddress: 'Company.shared.fields.legalAddress',
    streetAddress: 'Company.shared.fields.streetAddress',
    city: 'Company.shared.fields.city',
    country: 'Company.shared.fields.country',
    stateProvince: 'Company.shared.fields.stateProvince',
    zipPostalCode: 'Company.shared.fields.zipPostalCode',
    phoneNumber: 'Company.shared.fields.phoneNumber',
    cancel: 'Company.shared.buttons.cancel',
    save: 'Company.shared.buttons.save',
    saving: 'Company.shared.buttons.saving',
    required: 'Company.shared.validation.required',
    invalidEmail: 'Company.shared.validation.invalidEmail',
    companyNameRequired: 'Company.shared.validation.companyNameRequired',
    emailRequired: 'Company.shared.validation.emailRequired',

  });
  
  const [formData, setFormData] = useState({
    name: company?.name || '',
    email: company?.email || '',
    legal_name: company?.legal_name || '',
    vat_tax_id: company?.vat_tax_id || '',
    reseller_id: company?.reseller_id || '',
    legal_address: {
      street: company?.legal_address?.street?.[0] || '',
      street_2: company?.legal_address?.street?.[1] || '',
      city: company?.legal_address?.city || '',
      region: company?.legal_address?.region?.region || '',
      region_code: company?.legal_address?.region?.regionCode || '',
      country_code: company?.legal_address?.countryCode || '',
      postcode: company?.legal_address?.postcode || '',
      telephone: company?.legal_address?.telephone || '',
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  // Country and region data
  const [countriesData, setCountriesData] = useState<{
    availableCountries: Country[];
    countriesWithRequiredRegion: string[];
    optionalZipCountries: string[];
  } | null>(null);
  const [regionsData, setRegionsData] = useState<any[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);

  // Load countries data on component mount
  useEffect(() => {
    getCountries().then(({
      availableCountries,
      countriesWithRequiredRegion,
      optionalZipCountries,
    }) => {
      setCountriesData({
        availableCountries,
        countriesWithRequiredRegion,
        optionalZipCountries,
      });
      setLoadingCountries(false);
    }).catch((error) => {
      console.error('Failed to load countries:', error);
      setLoadingCountries(false);
    });
  }, []);

  // Load regions when country changes
  useEffect(() => {
    if (formData.legal_address.country_code && countriesData) {
      const selectedCountry = countriesData.availableCountries.find(
        country => country.value === formData.legal_address.country_code
      );
      
      if (selectedCountry?.availableRegions && selectedCountry.availableRegions.length > 0) {
        const regions = selectedCountry.availableRegions.map(region => ({
          text: region.name,
          value: `${region.code},${region.id}`,
        }));
        setRegionsData(regions);
      } else {
        setRegionsData([]);
      }
    } else {
      setRegionsData([]);
    }
  }, [formData.legal_address.country_code, countriesData]);

  // Memoized options for dropdowns
  const countryOptions = useMemo(() => {
    return countriesData?.availableCountries || [];
  }, [countriesData]);

  const regionOptions = useMemo(() => {
    return regionsData;
  }, [regionsData]);

  // Check if region is required for selected country
  const isRegionRequired = useMemo(() => {
    if (!formData.legal_address.country_code || !countriesData) return false;
    return countriesData.countriesWithRequiredRegion.includes(formData.legal_address.country_code);
  }, [formData.legal_address.country_code, countriesData]);

  // Check if region should be a dropdown (has options) or text input (no options)
  const hasRegionOptions = useMemo(() => {
    return regionOptions.length > 0;
  }, [regionOptions]);

  // Validation functions
  const validateField = (name: string, value: string): string | null => {
    switch (name) {
      case 'name':
        if (!value.trim()) {
          return translations.companyNameRequired;
        }
        break;
      case 'email':
        if (!value.trim()) {
          return translations.emailRequired;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return translations.invalidEmail;
        }
        break;
      case 'legal_address.street':
      case 'legal_address.city':
      case 'legal_address.postcode':
      case 'legal_address.telephone':
        if (!value.trim()) {
          return translations.required;
        }
        break;
      case 'legal_address.country_code':
        if (!value.trim()) {
          return translations.required;
        }
        break;
      case 'legal_address.region':
        if (isRegionRequired && !value.trim()) {
          return translations.required;
        }
        break;
    }
    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Validate required fields
    const nameError = validateField('name', formData.name);
    if (nameError) {
      newErrors.name = nameError;
      isValid = false;
    }

    const emailError = validateField('email', formData.email);
    if (emailError) {
      newErrors.email = emailError;
      isValid = false;
    }

    // Validate required address fields
    const streetError = validateField('legal_address.street', formData.legal_address.street);
    if (streetError) {
      newErrors['legal_address.street'] = streetError;
      isValid = false;
    }

    const cityError = validateField('legal_address.city', formData.legal_address.city);
    if (cityError) {
      newErrors['legal_address.city'] = cityError;
      isValid = false;
    }

    const postcodeError = validateField('legal_address.postcode', formData.legal_address.postcode);
    if (postcodeError) {
      newErrors['legal_address.postcode'] = postcodeError;
      isValid = false;
    }

    const telephoneError = validateField('legal_address.telephone', formData.legal_address.telephone);
    if (telephoneError) {
      newErrors['legal_address.telephone'] = telephoneError;
      isValid = false;
    }

    const countryError = validateField('legal_address.country_code', formData.legal_address.country_code);
    if (countryError) {
      newErrors['legal_address.country_code'] = countryError;
      isValid = false;
    }

    // Validate region field
    const regionError = validateField('legal_address.region', formData.legal_address.region);
    if (regionError) {
      newErrors['legal_address.region'] = regionError;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      legal_name: true,
      vat_tax_id: true,
      reseller_id: true,
      'legal_address.street': true,
      'legal_address.street_2': true,
      'legal_address.city': true,
      'legal_address.region': true,
      'legal_address.region_code': true,
      'legal_address.country_code': true,
      'legal_address.postcode': true,
      'legal_address.telephone': true,
    });

    if (!validateForm()) {
      return;
    }

    if (onSubmit) {
      // Transform form data to match API expectations
      const transformedData = {
        name: formData.name,
        email: formData.email,
        legal_name: formData.legal_name,
        vat_tax_id: formData.vat_tax_id,
        reseller_id: formData.reseller_id,
        legal_address: {
          street: [formData.legal_address.street, formData.legal_address.street_2].filter(Boolean),
          city: formData.legal_address.city,
          region: {
            region: formData.legal_address.region,
            region_code: formData.legal_address.region_code,
          },
          country_code: formData.legal_address.country_code,
          postcode: formData.legal_address.postcode,
          telephone: formData.legal_address.telephone,
        },
      };
      await onSubmit(transformedData);
    }
  };

  const handleInputChange = (field: string) => (value: string) => {
    if (field.startsWith('legal_address.')) {
      const addressField = field.split('.')[1];
      
      // Special handling for country change - reset region when country changes
      if (addressField === 'country_code') {
        setFormData(prev => ({
          ...prev,
          legal_address: {
            ...prev.legal_address,
            [addressField]: value,
            region: '', // Reset region text
            region_code: '', // Reset region code
          },
        }));
        
        // Clear region errors when country changes
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors['legal_address.region'];
          delete newErrors['legal_address.region_code'];
          return newErrors;
        });
        
        // Clear region touched state when country changes
        setTouched(prev => {
          const newTouched = { ...prev };
          delete newTouched['legal_address.region'];
          delete newTouched['legal_address.region_code'];
          return newTouched;
        });
      } else if (addressField === 'region') {
        // Handle region field (both text input and dropdown use this)
        setFormData(prev => ({
          ...prev,
          legal_address: {
            ...prev.legal_address,
            region: value,
            // For text input regions, use the same value for region_code
            // For dropdown regions, this gets overridden in the handleSelect
            region_code: hasRegionOptions ? prev.legal_address.region_code : value,
          },
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          legal_address: {
            ...prev.legal_address,
            [addressField]: value,
          },
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    let value = '';
    if (field.startsWith('legal_address.')) {
      const addressField = field.split('.')[1];
      const addressValue = formData.legal_address[addressField as keyof typeof formData.legal_address];
      value = typeof addressValue === 'string' ? addressValue : '';
    } else {
      const fieldValue = formData[field as keyof typeof formData];
      value = typeof fieldValue === 'string' ? fieldValue : '';
    }
    
    const error = validateField(field, value);
    
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }
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
        <Field 
          label={translations.companyName} 
          required 
          className="account-edit-company-profile-form__field"
          error={touched.name && errors.name ? errors.name : undefined}
        >
          <Input
            name="name"
            type="text"
            value={formData.name}
            onValue={handleInputChange('name')}
            onBlur={() => handleBlur('name')}
            disabled={loading}
            variant="primary"
            size="medium"
          />
        </Field>

        <Field 
          label={translations.email} 
          required 
          className="account-edit-company-profile-form__field"
          error={touched.email && errors.email ? errors.email : undefined}
        >
          <Input
            name="email"
            type="email"
            value={formData.email}
            onValue={handleInputChange('email')}
            onBlur={() => handleBlur('email')}
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

        {/* Legal Address Section */}
        <div className="account-edit-company-profile-form__section">
          <h3 className="account-edit-company-profile-form__section-title">{translations.legalAddress}</h3>
          
          <Field 
            label={translations.streetAddress} 
            required 
            className="account-edit-company-profile-form__field"
            error={touched['legal_address.street'] && errors['legal_address.street'] ? errors['legal_address.street'] : undefined}
          >
            <Input
              name="legal_address_street"
              type="text"
              value={formData.legal_address.street}
              onValue={handleInputChange('legal_address.street')}
              onBlur={() => handleBlur('legal_address.street')}
              disabled={loading}
              variant="primary"
              size="medium"
            />
          </Field>

          <Field 
            label={translations.streetAddress + ' 2'} 
            className="account-edit-company-profile-form__field"
          >
            <Input
              name="legal_address_street_2"
              type="text"
              value={formData.legal_address.street_2}
              onValue={handleInputChange('legal_address.street_2')}
              disabled={loading}
              variant="primary"
              size="medium"
            />
          </Field>

          <Field 
            label={translations.city} 
            required 
            className="account-edit-company-profile-form__field"
            error={touched['legal_address.city'] && errors['legal_address.city'] ? errors['legal_address.city'] : undefined}
          >
            <Input
              name="legal_address_city"
              type="text"
              value={formData.legal_address.city}
              onValue={handleInputChange('legal_address.city')}
              onBlur={() => handleBlur('legal_address.city')}
              disabled={loading}
              variant="primary"
              size="medium"
            />
          </Field>

          <Field 
            label={translations.country} 
            required 
            className="account-edit-company-profile-form__field"
            error={touched['legal_address.country_code'] && errors['legal_address.country_code'] ? errors['legal_address.country_code'] : undefined}
          >
            <Picker
              name="legal_address_country_code"
              floatingLabel={`${translations.country} *`}
              placeholder={translations.country}
              options={countryOptions}
              value={formData.legal_address.country_code}
              handleSelect={(event: Event) => {
                const target = event.target as HTMLSelectElement;
                handleInputChange('legal_address.country_code')(target.value);
              }}
              onBlur={() => handleBlur('legal_address.country_code')}
              disabled={loading || loadingCountries}
            />
          </Field>

          {/* Region field: Single field that renders as dropdown or input based on options */}
          <Field 
            label={translations.stateProvince} 
            required={isRegionRequired}
            className="account-edit-company-profile-form__field"
            error={touched['legal_address.region'] && errors['legal_address.region'] ? errors['legal_address.region'] : undefined}
          >
            {hasRegionOptions ? (
              <Picker
                key={`region_picker_${formData.legal_address.country_code}`}
                name="legal_address_region"
                floatingLabel={`${translations.stateProvince} ${isRegionRequired ? '*' : ''}`}
                placeholder={translations.stateProvince}
                options={regionOptions}
                value={formData.legal_address.region_code ? regionOptions.find(r => r.value.split(',')[0] === formData.legal_address.region_code)?.value || '' : ''}
                handleSelect={(event: Event) => {
                  const target = event.target as HTMLSelectElement;
                  const [regionCode] = target.value.split(',');
                  const regionName = regionOptions.find(r => r.value === target.value)?.text || '';
                  handleInputChange('legal_address.region')(regionName);
                  // Also update region_code for API compatibility
                  setFormData(prev => ({
                    ...prev,
                    legal_address: {
                      ...prev.legal_address,
                      region: regionName,
                      region_code: regionCode,
                    },
                  }));
                }}
                onBlur={() => handleBlur('legal_address.region')}
                disabled={loading || loadingCountries}
              />
            ) : (
              <Input
                key={`region_input_${formData.legal_address.country_code}`}
                name="legal_address_region"
                type="text"
                value={formData.legal_address.region}
                onValue={handleInputChange('legal_address.region')}
                onBlur={() => handleBlur('legal_address.region')}
                disabled={loading || loadingCountries}
                variant="primary"
                size="medium"
              />
            )}
          </Field>
          


          <Field 
            label={translations.zipPostalCode} 
            required 
            className="account-edit-company-profile-form__field"
            error={touched['legal_address.postcode'] && errors['legal_address.postcode'] ? errors['legal_address.postcode'] : undefined}
          >
            <Input
              name="legal_address_postcode"
              type="text"
              value={formData.legal_address.postcode}
              onValue={handleInputChange('legal_address.postcode')}
              onBlur={() => handleBlur('legal_address.postcode')}
              disabled={loading}
              variant="primary"
              size="medium"
            />
          </Field>

          <Field 
            label={translations.phoneNumber} 
            required 
            className="account-edit-company-profile-form__field"
            error={touched['legal_address.telephone'] && errors['legal_address.telephone'] ? errors['legal_address.telephone'] : undefined}
          >
            <Input
              name="legal_address_telephone"
              type="tel"
              value={formData.legal_address.telephone}
              onValue={handleInputChange('legal_address.telephone')}
              onBlur={() => handleBlur('legal_address.telephone')}
              disabled={loading}
              variant="primary"
              size="medium"
            />
          </Field>
        </div>

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
