import { SlotProps } from '@adobe-commerce/elsie/lib';

export interface CompanyFormInputsContext {
  formActions: {
    handleChange: (event: Event) => void;
  };
}

export type FormRef = {
  handleValidationSubmit: () => boolean;
  isDataValid: boolean;
};

export interface CompanyFormProps {
  loading?: boolean;
  showFormLoader?: boolean;
  slots?: {
    CompanyFormInputs?: SlotProps<CompanyFormInputsContext>;
  };
  fieldsConfig?: any[];
  className?: string;
  children?: any;
  onSubmit?: (event: SubmitEvent, isValid: boolean) => Promise<void | null | undefined>;
  onChange?: (values: Record<string, FormDataEntryValue>, inputValue: Record<string, string>, event: Event) => void;
}