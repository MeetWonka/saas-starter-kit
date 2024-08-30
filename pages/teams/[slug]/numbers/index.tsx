import { Error, Loading, WithLoadingAndError } from '@/components/shared';
import { Button } from 'react-daisyui';
import useNumbers from 'hooks/useNumbers';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Table } from '@/components/shared/table/Table';

const NumbersList = () => {
  const router = useRouter();
  const { slug } = router.query as { slug: string };
  const { t } = useTranslation('common');
  const { numbers, isLoading, isError, mutateNumbers } = useNumbers(slug);

  if (isLoading || !numbers) {
    return <Loading />;
  }

  if (isError) {
    return <Error message={isError.message} />;
  }

  return (
    <WithLoadingAndError isLoading={isLoading} error={isError}>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="space-y-3">
            <h2 className="text-xl font-medium leading-none tracking-tight">
              {t('numbers')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('numbers-listed')}
            </p>
          </div>
          <Button
            color="primary"
            size="md"
            onClick={() => router.push(`/teams/${slug}/numbers/new`)}
          >
            {t('add-number')}
          </Button>
        </div>

        <Table
          cols={[t('phone-number'), t('display-name'), t('language'), t('emails'), '']}
          body={
            numbers
              ? numbers.map((number) => {
                  return {
                    id: number.id,
                    cells: [
                      { wrap: true, text: number.phoneNumber },
                      { wrap: true, text: number.displayName },
                      { wrap: true, text: number.language || '-' },
                      { wrap: true, 
                        text: number.emails.map(emailObj => emailObj.email).join(', '), 
                        align: 'right' },
                      {
                        buttons: [
                          {
                            color: 'primary',
                            text: t('edit'),
                            onClick: () => {
                              router.push(`/teams/${slug}/numbers/${number.id}`);
                            },
                          },
                        ],
                      },
                    ],
                  };
                })
              : []
          }
        ></Table>
      </div>
    </WithLoadingAndError>
  );
};

export default NumbersList;