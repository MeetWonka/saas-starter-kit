import { Error, Loading } from '@/components/shared';
import { AccessControl } from '@/components/shared/AccessControl';
import { RemoveTeam, TeamSettings, TeamTab, DisplayCredit } from '@/components/team';
import env from '@/lib/env';
import useTeam from 'hooks/useTeam';
import useCredit from 'hooks/useCredit';
import type { GetServerSidePropsContext } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { TeamFeature } from 'types';

const Settings = ({ teamFeatures }: { teamFeatures: TeamFeature }) => {
  const { t } = useTranslation('common');
  const { isLoading, isError, team } = useTeam();
  const {  isLoading: isCreditLoading, isError: isCreditError, credit } = useCredit();

  if (isLoading || isCreditLoading) {
    return <Loading />;
  }

  if (isError || isCreditError) {
    return <Error message={isError?.message || isCreditError?.message} />;
  }

  if (!team) {
    return <Error message={t('team-not-found')} />;
  }


  if (isLoading) {
    return <Loading />;
  }

  if (isCreditLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error message={isError.message} />;
  }

  if (!team) {
    return <Error message={t('team-not-found')} />;
  }

  return (
    <>
      <TeamTab activeTab="settings" team={team} teamFeatures={teamFeatures} />
      <div className="space-y-6">
        <DisplayCredit credit={credit} />
        <TeamSettings team={team} />
        <AccessControl resource="team" actions={['delete']}>
          <RemoveTeam team={team} allowDelete={teamFeatures.deleteTeam} />
        </AccessControl>
      </div>
    </>
  );
};

export async function getServerSideProps({
  locale,
}: GetServerSidePropsContext) {
  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
      teamFeatures: env.teamFeatures,
    },
  };
}

export default Settings;
