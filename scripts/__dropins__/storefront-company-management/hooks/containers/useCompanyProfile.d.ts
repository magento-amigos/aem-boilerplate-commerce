import { CompanyModel } from '../../data/models/company';

export declare const useCompanyProfile: ({ handleSetInLineAlert }: UseCompanyProfileProps) => {
    company: CompanyModel | null;
    loading: boolean;
    saving: boolean;
    showEditForm: boolean;
    handleShowEditForm: () => void;
    handleHideEditForm: () => void;
    handleUpdateCompany: (formValues: Record<string, any>) => Promise<void>;
};
//# sourceMappingURL=useCompanyProfile.d.ts.map