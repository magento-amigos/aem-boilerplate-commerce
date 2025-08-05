import { CompanyModel } from '../../data/models';

export interface UseCompanyInformationProps {
    handleSetInLineAlert?: (alert?: {
        type: 'success' | 'error';
        text: string;
    }) => void;
}
export declare const useCompanyInformation: ({ handleSetInLineAlert }: UseCompanyInformationProps) => {
    company: CompanyModel | null;
    loading: boolean;
    saving: boolean;
    showEditForm: boolean;
    handleShowEditForm: () => void;
    handleHideEditForm: () => void;
    handleUpdateCompany: (data: Partial<CompanyModel>) => Promise<void>;
};
//# sourceMappingURL=useCompanyInformation.d.ts.map