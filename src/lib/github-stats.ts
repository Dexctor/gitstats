import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

interface GitHubStats {
  totalStars: number;
  totalForks: number;
  totalWatchers: number;
  repoCount: number;
  languages: {
    topLanguages: Array<{ name: string; count: number; stars: number; percentage: number; popularity: number }>;
    totalBytes: number;
  };
  activity: {
    commits: number;
    pullRequests: number;
    issues: number;
    reviews: number;
    trends: {
      increasing: boolean;
      rate: number;
    };
    contributionHeatmap: Array<{
      date: string;
      total: number;
      commits: number;
      pullRequests: number;
      issues: number;
      reviews: number;
    }>;
  };
}

interface Contribution {
  commits: number;
  pullRequests: number;
  issues: number;
  reviews: number;
}

interface LanguageStats {
  count: number;
  stars: number;
  size: number;
}

interface ContributionsMap {
  [date: string]: Contribution;
}

interface LanguageMap {
  [language: string]: LanguageStats;
}

export function calculateGitHubStats(repos: any[], events: any[]): GitHubStats {
  // Calculs de base
  const baseStats = {
    totalStars: repos.reduce((acc, repo) => acc + repo.stargazers_count, 0),
    totalForks: repos.reduce((acc, repo) => acc + repo.forks_count, 0),
    totalWatchers: repos.reduce((acc, repo) => acc + repo.watchers_count, 0),
    repoCount: repos.length,
  };

  // Analyse détaillée des langages
  const languageStats = repos.reduce<LanguageMap>((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = {
        count: (acc[repo.language]?.count || 0) + 1,
        stars: (acc[repo.language]?.stars || 0) + repo.stargazers_count,
        size: (acc[repo.language]?.size || 0) + repo.size,
      };
    }
    return acc;
  }, {});

  // Analyse des contributions
  const contributions = events.reduce<ContributionsMap>((acc, event) => {
    const date = new Date(event.created_at).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = { commits: 0, pullRequests: 0, issues: 0, reviews: 0 };
    }

    switch (event.type) {
      case 'PushEvent':
        acc[date].commits += event.payload?.commits?.length || 0;
        break;
      case 'PullRequestEvent':
        if (event.payload?.action === 'opened') {
          acc[date].pullRequests += 1;
        }
        break;
      case 'IssuesEvent':
        if (event.payload?.action === 'opened') {
          acc[date].issues += 1;
        }
        break;
      case 'PullRequestReviewEvent':
        acc[date].reviews += 1;
        break;
    }
    return acc;
  }, {});

  // Analyse de l'activité
  const activityMetrics = {
    commits: events.filter(e => e.type === 'PushEvent')
      .reduce((acc, event) => acc + (event.payload?.commits?.length || 0), 0),
    pullRequests: events.filter(e => e.type === 'PullRequestEvent' && e.payload?.action === 'opened').length,
    issues: events.filter(e => e.type === 'IssuesEvent' && e.payload?.action === 'opened').length,
    reviews: events.filter(e => e.type === 'PullRequestReviewEvent').length,
  };

  // Calcul des tendances
  const trends = calculateTrends(contributions);

  return {
    ...baseStats,
    languages: {
      topLanguages: Object.entries(languageStats)
        .map(([name, stats]) => ({
          name,
          count: stats.count,
          stars: stats.stars,
          percentage: (stats.count / baseStats.repoCount) * 100,
          popularity: stats.stars / stats.count,
        }))
        .sort((a, b) => b.count - a.count),
      totalBytes: Object.values(languageStats as LanguageMap)
        .reduce<number>((acc, lang) => acc + lang.size, 0),
    },
    activity: {
      ...activityMetrics,
      trends,
      contributionHeatmap: Object.entries(contributions as ContributionsMap)
        .map(([date, counts]) => ({
          date,
          total: Object.values(counts).reduce<number>((a, b) => a + b, 0),
          ...counts,
        })),
    },
  };
}

function calculateTrends(contributions: ContributionsMap) {
  const dates = Object.keys(contributions).sort();
  if (dates.length < 2) return { increasing: false, rate: 0 };

  const firstWeek = dates.slice(0, 7);
  const lastWeek = dates.slice(-7);

  const firstWeekAvg = firstWeek.reduce((acc, date) => {
    const counts = contributions[date];
    return acc + Object.values(counts).reduce((a, b) => a + b, 0);
  }, 0) / firstWeek.length;

  const lastWeekAvg = lastWeek.reduce((acc, date) => {
    const counts = contributions[date];
    return acc + Object.values(counts).reduce((a, b) => a + b, 0);
  }, 0) / lastWeek.length;

  return {
    increasing: lastWeekAvg > firstWeekAvg,
    rate: ((lastWeekAvg - firstWeekAvg) / firstWeekAvg) * 100,
  };
} 