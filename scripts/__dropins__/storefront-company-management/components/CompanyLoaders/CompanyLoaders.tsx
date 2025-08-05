import { FunctionComponent } from 'preact';
import { Card, Skeleton, SkeletonRow } from '@adobe-commerce/elsie/components';

export const CompanyCardLoader: FunctionComponent<{
  testId?: string;
  withCard?: boolean;
}> = ({ testId, withCard = true }) => {
  const content = (
    <Skeleton rowGap="medium" data-testid={testId}>
      <div className="company-card-loader__header">
        <SkeletonRow size="large" variant="heading" />
        <SkeletonRow size="small" variant="row" />
      </div>
      <div className="company-card-loader__content">
        <div className="company-card-loader__section">
          <SkeletonRow size="medium" variant="heading" />
          <SkeletonRow size="medium" lines={5} multilineGap="small" />
        </div>
        <div className="company-card-loader__section">
          <SkeletonRow size="medium" variant="heading" />
          <SkeletonRow size="medium" lines={3} multilineGap="small" />
        </div>
      </div>
    </Skeleton>
  );

  return withCard ? (
    <Card variant="primary" className="company-card-loader">
      {content}
    </Card>
  ) : (
    content
  );
};

export const CompanyFormLoader: FunctionComponent = () => {
  return (
    <Card variant="primary" className="company-form-loader">
      <Skeleton rowGap="medium">
        <SkeletonRow size="large" variant="heading" />
        <SkeletonRow size="medium" lines={5} multilineGap="medium" />
        <div className="company-form-loader__actions">
          <SkeletonRow size="small" variant="row" />
          <SkeletonRow size="small" variant="row" />
        </div>
      </Skeleton>
    </Card>
  );
};