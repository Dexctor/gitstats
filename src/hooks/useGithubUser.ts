import { searchGithubUser } from '@/lib/github';
import { useQuery } from '@tanstack/react-query';

export function useGithubUser(username: string) {
  return useQuery({
    queryKey: ['github-user', username],
    queryFn: () => searchGithubUser(username),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
} 