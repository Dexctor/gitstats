import { Octokit } from '@octokit/rest';
import { cache } from 'react';

// Create authenticated Octokit instance
const createOctokit = () => {
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  
  if (!token || typeof token !== 'string') {
    console.error('GitHub Token is not properly configured');
    throw new Error('GitHub token configuration error');
  }
  
  return new Octokit({
    auth: token,
    headers: {
      accept: 'application/vnd.github.v3+json',
    },
  });
};

// Cache GitHub API responses
const memoryCache = new Map();

export const searchGithubUser = cache(async (username: string) => {
  try {
    const octokit = createOctokit();
    // Encoder le nom d'utilisateur pour gérer les caractères spéciaux
    const encodedUsername = encodeURIComponent(username);
    const cacheKey = `user:${encodedUsername}`;

    // Check cache first
    const cached = memoryCache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Fetch user data and repos in parallel
    const [user, repos, events] = await Promise.all([
      octokit.users.getByUsername({ username: encodedUsername }),
      octokit.repos.listForUser({ username: encodedUsername, per_page: 100 }),
      octokit.activity.listPublicEventsForUser({ username: encodedUsername, per_page: 10 })
    ]);

    const data = {
      user: user.data,
      repos: repos.data,
      events: events.data
    };

    // Cache the response
    memoryCache.set(cacheKey, JSON.stringify(data));
    setTimeout(() => memoryCache.delete(cacheKey), 5 * 60 * 1000); // Cache for 5 minutes

    return data;
  } catch (error) {
    console.error('[Production] GitHub API Error:', error);
    throw error;
  }
}); 