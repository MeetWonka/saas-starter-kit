import { Card } from '@/components/shared';
import { Credit } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import React from 'react';


const DisplayCredit = ({ credit }: { credit?: Credit }) => {
  const { t } = useTranslation('common');

  return (
    <Card>
      <Card.Body>
        <Card.Header>
          <Card.Title>{t('credit-balance')} : &nbsp;&nbsp;&nbsp;{credit?.amount.toFixed(2)}</Card.Title>
        </Card.Header>
      </Card.Body>
    </Card>
  );
};

export default DisplayCredit;