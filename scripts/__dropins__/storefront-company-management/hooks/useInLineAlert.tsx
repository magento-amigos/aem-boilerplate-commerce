import { useState, useCallback } from 'preact/hooks';
import { InLineAlertProps } from '../types/companyProfile.types';
import {
  CheckWithCircle as Success,
  Warning,
  WarningWithCircle as Error,
} from '@adobe-commerce/elsie/icons';

const iconsList = {
  success: <Success />,
  warning: <Warning />,
  error: <Error />,
};

export const useInLineAlert = () => {
  const [inLineAlertProps, setInLineAlertProps] = useState<InLineAlertProps>(
    {}
  );

  const handleSetInLineAlert = useCallback(
    (notification?: InLineAlertProps) => {
      if (!notification?.type) {
        setInLineAlertProps({});
        return;
      }

      const icon = iconsList[notification.type];

      setInLineAlertProps({
        ...notification,
        icon,
      });
    },
    []
  );

  return { inLineAlertProps, handleSetInLineAlert };
};