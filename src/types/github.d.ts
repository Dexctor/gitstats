// Créer un nouveau fichier pour les types GitHub
export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  email: string | null;
  created_at: string;
}

export interface GitHubStats {
  totalStars: number;
  totalForks: number;
  totalWatchers: number;
  repoCount: number;
  topLanguages: Array<{ name: string; count: number }>;
  totalPullRequests: number;
  openIssues: number;
  contributionsLastYear: Array<{ date: string; count: number }>;
} 

export interface Activity {
  date: string;
  type?: 'commit' | 'pr' | 'issue' | 'review';
  id?: string;
  repo?: string;
  // autres propriétés selon vos besoins
} 

export interface ActivityEvent {
  id: string;
  type: 'PushEvent' | 'PullRequestEvent' | 'IssuesEvent' | 'CreateEvent' | 'DeleteEvent' | 'WatchEvent' | string;
  created_at: string;
  actor: {
    login: string;
    avatar_url: string;
  };
  repo: {
    name: string;
    url: string;
  };
  payload?: {
    action?: string;
    ref?: string;
    ref_type?: string;
    push_id?: number;
    size?: number;
    distinct_size?: number;
    commits?: Array<{
      sha: string;
      message: string;
      url: string;
    }>;
    pull_request?: {
      url: string;
      title: string;
      state: string;
    };
    issue?: {
      url: string;
      title: string;
      state: string;
    };
  };
}

export interface UserData {
  user: GitHubUser;
  stats: GitHubStats;
  activities?: ActivityEvent[];
  repos?: any[]; // You can define a more specific type if needed
} 