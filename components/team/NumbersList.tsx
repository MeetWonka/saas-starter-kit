import { Error, Loading } from '@/components/shared';
import { Button } from 'react-daisyui';
import useNumbers from 'hooks/useNumbers';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const NumbersList = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { t } = useTranslation('common');
  const { numbers, isLoading, isError, mutateNumbers } = useNumbers(slug as string);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error message={isError.message} />;
  }

  return (
    <div>
      <h1>{t('numbers')}</h1>
      <Button onClick={() => router.push(`/teams/${slug}/numbers/new`)}>
        {t('add-number')}
      </Button>
      <ul>
        {numbers?.map((number) => (
          <li key={number.id}>
            <span>{number.phoneNumber} - {number.displayName}</span>
            <Button
              color="primary"
              onClick={() => router.push(`/teams/${slug}/numbers/${number.id}`)}
            >
              {t('edit')}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NumbersList;
