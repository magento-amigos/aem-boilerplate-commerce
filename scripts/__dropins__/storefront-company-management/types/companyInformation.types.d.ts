import { SlotProps } from '@adobe-commerce/elsie/lib';
import { CompanyModel } from '../data/models';

export interface CompanyDataProps {
  name: string;
  label: string;
  value: string;
}

export interface CompanyDataContext {
  companyData: CompanyDataProps[];
}

export interface InLineAlertProps {
  type?: 'success' | 'error';
  text?: string; 
  icon?: string;
}

export interface CompanyProfileProps {
  className?: string;
  withHeader?: boolean;
  slots?: {
    CompanyData?: SlotProps<CompanyDataContext>;
  };
}

export interface CompanyProfileCardProps {
  company?: CompanyModel | null;
  slots?: {
    CompanyData?: SlotProps<CompanyDataContext>;
  };
  showEditForm: boolean;
  handleShowEditForm: () => void;
}

export interface EditCompanyProfileProps {
  inLineAlertProps?: InLineAlertProps;
  company?: CompanyModel | null;
  loading?: boolean;
  onSubmit?: (data: Partial<CompanyModel>) => Promise<void>;
  onCancel?: () => void;
}