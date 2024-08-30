import fetcher from '@/lib/fetcher';
import type { Credit } from '@prisma/client';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import type { ApiResponse } from 'types';

const useCredit = (slug?: string) => {
  const { query, isReady } = useRouter();

  const teamSlug = slug || (isReady ? query.slug : null);

  const { data, error, isLoading } = useSWR<ApiResponse<Credit>>(
    teamSlug ? `/api/teams/${teamSlug}/credit` : null,
    fetcher
  );

  return {
    isLoading,
    isError: error,
    credit: data?.data,
  };
};

export default useCredit;
