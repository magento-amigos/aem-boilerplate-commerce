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

import { useState, useCallback, useEffect } from 'preact/hooks';
import { InLineAlertProps } from '../types/companyProfile.types';
import {
  CheckWithCircle as Success,
  Warning,
  WarningWithCircle as Error,
} from '@adobe-commerce/elsie/icons';

export type AlertType = 'success' | 'warning' | 'error';

export interface AlertOptions {
  type: AlertType;
  text: string;
  autoHide?: boolean;
  autoHideDelay?: number;
}

export interface UseInLineAlertReturn {
  inLineAlertProps: InLineAlertProps;
  handleSetInLineAlert: (notification?: AlertOptions) => void;
  clearAlert: () => void;
  showSuccess: (text: string, autoHide?: boolean) => void;
  showWarning: (text: string, autoHide?: boolean) => void;
  showError: (text: string, autoHide?: boolean) => void;
}

const iconsList = {
  success: <Success />,
  warning: <Warning />,
  error: <Error />,
};

export const useInLineAlert = (): UseInLineAlertReturn => {
  const [inLineAlertProps, setInLineAlertProps] = useState<InLineAlertProps>({});
  const [autoHideTimer, setAutoHideTimer] = useState<NodeJS.Timeout | null>(null);

  const clearAlert = useCallback(() => {
    setInLineAlertProps({});
    if (autoHideTimer) {
      clearTimeout(autoHideTimer);
      setAutoHideTimer(null);
    }
  }, [autoHideTimer]);

  const handleSetInLineAlert = useCallback(
    (notification?: AlertOptions) => {
      // Clear existing timer
      if (autoHideTimer) {
        clearTimeout(autoHideTimer);
        setAutoHideTimer(null);
      }

      if (!notification?.type) {
        setInLineAlertProps({});
        return;
      }

      const icon = iconsList[notification.type];

      setInLineAlertProps({
        type: notification.type,
        text: notification.text,
        icon,
      });

      // Auto-hide if requested
      if (notification.autoHide !== false) {
        const delay = notification.autoHideDelay || (notification.type === 'success' ? 3000 : 5000);
        const timer = setTimeout(() => {
          setInLineAlertProps({});
          setAutoHideTimer(null);
        }, delay);
        setAutoHideTimer(timer);
      }
    },
    [autoHideTimer]
  );

  const showSuccess = useCallback(
    (text: string, autoHide: boolean = true) => {
      handleSetInLineAlert({ type: 'success', text, autoHide });
    },
    [handleSetInLineAlert]
  );

  const showWarning = useCallback(
    (text: string, autoHide: boolean = false) => {
      handleSetInLineAlert({ type: 'warning', text, autoHide });
    },
    [handleSetInLineAlert]
  );

  const showError = useCallback(
    (text: string, autoHide: boolean = false) => {
      handleSetInLineAlert({ type: 'error', text, autoHide });
    },
    [handleSetInLineAlert]
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoHideTimer) {
        clearTimeout(autoHideTimer);
      }
    };
  }, [autoHideTimer]);

  return {
    inLineAlertProps,
    handleSetInLineAlert,
    clearAlert,
    showSuccess,
    showWarning,
    showError,
  };
};

export default useInLineAlert;
