import fetcher from '@/lib/fetcher';
import useSWR, { mutate } from 'swr';
import type { ApiResponse, NumberWithDetails } from 'types';

// Hook to fetch all numbers for a specific team
const useNumbers = (teamSlug: string) => {
  const url = `/api/teams/${teamSlug}/numbers`;

  const { data, error, isLoading } = useSWR<ApiResponse<NumberWithDetails[]>>(
    url,
    fetcher
  );

  const mutateNumbers = async () => {
    mutate(url);
  };

  return {
    isLoading,
    isError: error,
    numbers: data?.data,
    mutateNumbers,
  };
};

export default useNumbers;
