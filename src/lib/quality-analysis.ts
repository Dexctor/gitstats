interface Repository {
  name: string;
  contents_url?: string;
  default_branch: string;
  size: number;
  topics: string[];
  has_issues: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  language: string;
}

export function calculateTestsPresence(repos: Repository[]) {
  return repos.reduce((score, repo) => {
    // Vérifier la présence de fichiers de test
    const hasTestFolder = repo.topics?.includes('testing') || repo.topics?.includes('tests');
    const hasTestFiles = repo.name.includes('test') || repo.name.includes('spec');
    
    return score + (hasTestFolder ? 0.7 : 0) + (hasTestFiles ? 0.3 : 0);
  }, 0) / Math.max(repos.length, 1);
}

export function calculateDocQuality(repos: Repository[]) {
  return repos.reduce((score, repo) => {
    // Vérifier la présence de documentation
    const hasReadme = true; // Supposons que tous les repos ont un README
    const hasWiki = repo.has_wiki;
    const hasPages = repo.has_pages;
    const hasTopics = repo.topics?.length > 0;
    
    return score + (hasReadme ? 0.4 : 0) + (hasWiki ? 0.2 : 0) + 
           (hasPages ? 0.2 : 0) + (hasTopics ? 0.2 : 0);
  }, 0) / Math.max(repos.length, 1);
}

export function calculateContributionValue(stats: any) {
  const {
    totalStars = 0,
    totalForks = 0,
    activity = { commits: 0, pullRequests: 0, reviews: 0 }
  } = stats;

  const impactScore = (totalStars * 2 + totalForks * 3) / 100;
  const activityScore = (activity.commits + activity.pullRequests * 3 + activity.reviews * 2) / 100;

  return (impactScore + activityScore) / 2;
}

export function calculateCommunityEngagement(events: any[]) {
  const totalEvents = events.length;
  if (!totalEvents) return 0;

  const interactionEvents = events.filter(event => 
    ['IssueCommentEvent', 'PullRequestReviewCommentEvent', 'CommitCommentEvent']
    .includes(event.type)
  ).length;

  return interactionEvents / totalEvents;
} 