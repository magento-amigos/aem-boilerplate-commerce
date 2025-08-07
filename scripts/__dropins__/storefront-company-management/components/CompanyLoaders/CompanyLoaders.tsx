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

import { Skeleton, SkeletonRow, Card } from '@adobe-commerce/elsie/components';
import './CompanyLoaders.css';
import { classes } from '@adobe-commerce/elsie/lib';

export const CompanyCardLoader = ({
  testId,
  withCard = true,
}: {
  testId?: string;
  withCard?: boolean;
}) => {
  const defaultSkeleton = (
    <Skeleton data-testid={testId || 'companySkeletonLoader'}>
      <SkeletonRow
        variant="heading"
        size="xlarge"
        fullWidth={false}
        lines={1}
      />
      <SkeletonRow variant="heading" size="xlarge" fullWidth={true} lines={1} />
      <SkeletonRow variant="heading" size="xlarge" fullWidth={true} lines={1} />
    </Skeleton>
  );

  if (withCard) {
    return defaultSkeleton;
  }

  return (
    <Card
      variant="secondary"
      className={classes([
        'company-company-loaders',
        'company-company-loaders--card-loader',
      ])}
    >
      {defaultSkeleton}
    </Card>
  );
};

export const CompanyFormLoader = () => {
  return (
    <Skeleton data-testid="companyFormLoader">
      <SkeletonRow variant="heading" size="medium" />
      <SkeletonRow variant="empty" size="medium" />
      <SkeletonRow size="large" />
      <SkeletonRow size="large" />
      <SkeletonRow size="large" fullWidth={true} />
      <SkeletonRow size="large" fullWidth={true} lines={3} />
      <SkeletonRow size="large" />
      <SkeletonRow size="large" />
      <SkeletonRow size="large" />
      <SkeletonRow size="large" />
      <SkeletonRow size="large" />
      <SkeletonRow size="large" />
      <SkeletonRow size="large" fullWidth={true} />
    </Skeleton>
  );
};
