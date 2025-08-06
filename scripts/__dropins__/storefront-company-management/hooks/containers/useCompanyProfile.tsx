import { useCallback, useEffect, useState } from 'preact/hooks';
import { getCompany, updateCompany } from '../../api';
import { CompanyModel } from '../../data/models';

export interface UseCompanyProfileProps {
  handleSetInLineAlert?: (alert?: { type: 'success' | 'error'; text: string }) => void;
}

export const useCompanyProfile = ({ 
  handleSetInLineAlert 
}: UseCompanyProfileProps) => {
  const [company, setCompany] = useState<CompanyModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const fetchCompany = useCallback(() => {
    getCompany().then((companyData: CompanyModel | null) => {
      setCompany(companyData);
      setLoading(false);
    }).catch((error) => {
      console.error('Failed to load company:', error);
      setLoading(false);
      if (handleSetInLineAlert) {
        handleSetInLineAlert({
          type: 'error',
          text: 'Failed to load company profile'
        });
      }
    });
  }, [handleSetInLineAlert]);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  const handleShowEditForm = useCallback(() => {
    setShowEditForm(true);
    if (handleSetInLineAlert) {
      handleSetInLineAlert(); // Clear any existing alerts
    }
  }, [handleSetInLineAlert]);

  const handleHideEditForm = useCallback(() => {
    setShowEditForm(false);
  }, []);

  const handleUpdateCompany = useCallback(async (data: Partial<CompanyModel>) => {
    try {
      setSaving(true);
      
      const updatedCompany = await updateCompany(data);
      
      // Preserve permissions from current company data since update response doesn't include them
      if (company) {
        updatedCompany.canEdit = company.canEdit;
        updatedCompany.customerRole = company.customerRole;
        updatedCompany.customerStatus = company.customerStatus;
      }
      
      setCompany(updatedCompany);
      setShowEditForm(false);
      
      if (handleSetInLineAlert) {
        handleSetInLineAlert({
          type: 'success',
          text: 'Company profile updated successfully'
        });
      }
    } catch (error) {
      console.error('Failed to update company:', error);
      if (handleSetInLineAlert) {
        handleSetInLineAlert({
          type: 'error',
          text: 'Failed to update company profile'
        });
      }
    } finally {
      setSaving(false);
    }
  }, [company, handleSetInLineAlert]);

  return {
    company,
    loading,
    saving,
    showEditForm,
    handleShowEditForm,
    handleHideEditForm,
    handleUpdateCompany,
  };
};