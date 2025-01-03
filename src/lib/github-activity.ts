export const fetchGitHubActivity = async (username: string, period: string = '1y') => {
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  
  if (!token || typeof token !== 'string') {
    console.error('GitHub Token is not properly configured');
    throw new Error('GitHub token configuration error');
  }

  const periodInMonths = {
    '6m': 6,
    '1y': 12,
    '2y': 24,
    'all': 48
  }[period];

  const since = new Date();
  since.setMonth(since.getMonth() - (periodInMonths ?? 12));

  try {
    const fetchPage = async (page: number) => {
      const response = await fetch(
        `https://api.github.com/users/${username}/events?per_page=100&page=${page}&since=${since.toISOString()}`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API Error: ${response.statusText}`);
      }

      return response.json();
    };

    // Récupérer plusieurs pages si nécessaire
    const pages = period === 'all' ? 3 : 1;
    const allEvents = [];
    
    for (let i = 1; i <= pages; i++) {
      const events = await fetchPage(i);
      allEvents.push(...events);
      if (events.length < 100) break; // Arrêter si on a moins que la taille de page maximale
    }

    // Grouper les événements par mois
    const monthlyStats = allEvents.reduce((acc: any, event) => {
      const date = new Date(event.created_at);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      if (!acc[monthKey]) {
        acc[monthKey] = {
          date: monthKey,
          commits: 0,
          pullRequests: 0,
          issues: 0
        };
      }

      switch (event.type) {
        case 'PushEvent':
          acc[monthKey].commits += event.payload?.commits?.length || 0;
          break;
        case 'PullRequestEvent':
          if (event.payload?.action === 'opened' || event.payload?.action === 'reopened') {
            acc[monthKey].pullRequests += 1;
          }
          break;
        case 'IssuesEvent':
          if (event.payload?.action === 'opened' || event.payload?.action === 'reopened') {
            acc[monthKey].issues += 1;
          }
          break;
      }

      return acc;
    }, {});

    return Object.values(monthlyStats);
  } catch (error) {
    console.error('Error fetching GitHub activity:', error);
    throw error;
  }
}; 