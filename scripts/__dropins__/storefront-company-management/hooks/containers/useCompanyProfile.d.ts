import { CompanyModel } from '../../data/models';

export interface UseCompanyProfileProps {
    handleSetInLineAlert?: (alert?: {
        type: 'success' | 'error';
        text: string;
    }) => void;
}
export declare const useCompanyProfile: ({ handleSetInLineAlert }: UseCompanyProfileProps) => {
    company: CompanyModel | null;
    loading: boolean;
    saving: boolean;
    showEditForm: boolean;
    handleShowEditForm: () => void;
    handleHideEditForm: () => void;
    handleUpdateCompany: (data: Partial<CompanyModel>) => Promise<void>;
};
//# sourceMappingURL=useCompanyProfile.d.ts.map