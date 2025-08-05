export interface CompanyEventData {
  company?: any;
  message?: string;
  error?: any;
}

declare global {
  namespace EventBus {
    interface EventMap {
      'company/loaded': CompanyEventData;
      'company/updated': CompanyEventData;
      'company/edit-started': CompanyEventData;
      'company/edit-cancelled': CompanyEventData;
      'company/success': CompanyEventData;
      'company/error': CompanyEventData;
    }
  }
}