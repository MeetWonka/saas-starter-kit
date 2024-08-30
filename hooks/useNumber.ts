import fetcher from '@/lib/fetcher';
import useSWR, { mutate } from 'swr';
import type { ApiResponse, NumberWithDetails } from 'types';

// Hook to fetch all numbers for a specific team
const useNumber = (teamSlug: string, numberId: string) => {
  const url = `/api/teams/${teamSlug}/numbers/${numberId}`;

  const { data, error, isLoading } = useSWR<ApiResponse<NumberWithDetails>>(
    url,
    fetcher
  );

  const mutateNumber = async () => {
    mutate(url);
  };

  return {
    isLoading,
    isError: error,
    number: data?.data,
    mutateNumber,
  };
};

export default useNumber;
