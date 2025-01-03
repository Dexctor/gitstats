'use client'

import { motion } from 'framer-motion';
import { MapPin, Link as LinkIcon, Building, Calendar, Star, GitFork, Eye, GitPullRequest, GitCommit, MessageCircle, ChevronDown, ChevronUp, GitBranch, Activity } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import GitHubStats from './GitHubStats';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { useMemo, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImpactSection } from '@/components/ImpactSection';
import { analyzeTechProgression } from '@/lib/tech-analysis';
import { calculateStreak, calculateImpactScore } from '@/lib/impact-utils';
import { calculateGitHubStats } from '@/lib/github-stats';
import { 
  calculateTestsPresence, 
  calculateDocQuality, 
  calculateContributionValue,
  calculateCommunityEngagement 
} from '@/lib/quality-analysis';

interface UserProfileProps {
  userData: any;
}

interface TopRepo {
  name: string;
  description: string;
  stars: number;
  forks: number;
  lastActivity: string;
  url: string;
  language: string;
}

interface Contribution {
  type: 'issue' | 'pr' | 'star' | 'follower';
  title: string;
  date: string;
  url: string;
}

interface ActivityEvent {
  id: string;
  type: string;
  date: string;
  created_at?: string;
  repo: string | { name: string; url: string; id: string };
  details?: string;
}

// Ajouter defaultStats
const defaultStats = {
  totalStars: 0,
  totalForks: 0,
  totalWatchers: 0,
  repoCount: 0,
  languages: {
    topLanguages: [],
    totalBytes: 0
  },
  activity: {
    commits: 0,
    pullRequests: 0,
    issues: 0,
    reviews: 0,
    trends: { increasing: false, rate: 0 },
    contributionHeatmap: []
  }
};

export default function UserProfile({ userData }: UserProfileProps) {
  const { user, repos, events } = userData;
  const [showAllRepos, setShowAllRepos] = useState(false);
  const [displayCount, setDisplayCount] = useState(3);
  const REPOS_PER_PAGE = 6; // Nombre de repos à charger à chaque fois

  // Reset state when userData changes (new user searched)
  useEffect(() => {
    setShowAllRepos(false);
    setDisplayCount(3);
  }, [userData.user?.login]); // Reset when username changes

  // Calculer les vraies statistiques avec dépendance sur userData
  const stats = useMemo(() => {
    console.log('Calculating stats for:', userData?.user?.login);
    if (!userData?.repos || !userData?.events) return defaultStats;
    
    const calculatedStats = calculateGitHubStats(userData.repos, userData.events);
    
    // Enrichir les statistiques avec des métriques supplémentaires
    return {
      ...calculatedStats,
      qualityMetrics: {
        testsPresence: calculateTestsPresence(userData.repos),
        documentationQuality: calculateDocQuality(userData.repos),
        codeReviewParticipation: calculatedStats.activity.reviews / calculatedStats.activity.pullRequests,
      },
      impactMetrics: {
        projectReach: calculatedStats.totalStars + calculatedStats.totalForks * 2,
        contributionValue: calculateContributionValue(calculatedStats),
        communityEngagement: calculateCommunityEngagement(userData.events),
      }
    };
  }, [userData]);

  // Modifier le calcul des top repos pour ne pas limiter à 3
  const topRepos = useMemo(() => {
    return (userData?.repos || [])
      .map((repo: any) => ({
        name: repo.name,
        description: repo.description,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        lastActivity: repo.pushed_at,
        url: repo.html_url,
        language: repo.language,
      }))
      .sort((a: TopRepo, b: TopRepo) => {
        const scoreA = a.stars * 2 + a.forks + (new Date(a.lastActivity).getTime() / 1000000000);
        const scoreB = b.stars * 2 + b.forks + (new Date(b.lastActivity).getTime() / 1000000000);
        return scoreB - scoreA;
      });
  }, [userData?.repos]); // Dépendre de userData.repos

  // Calculer les repos à afficher
  const displayedRepos = useMemo(() => {
    if (!showAllRepos) {
      return topRepos.slice(0, 3);
    }
    return topRepos.slice(0, displayCount);
  }, [topRepos, showAllRepos, displayCount]);

  const hasMoreRepos = topRepos.length > displayedRepos.length;

  const handleLoadMore = () => {
    if (showAllRepos) {
      setShowAllRepos(false);
      setDisplayCount(3);
    } else {
      setShowAllRepos(true);
      setDisplayCount(REPOS_PER_PAGE);
    }
  };

  const handleLoadMoreRepos = () => {
    setDisplayCount(prev => Math.min(prev + REPOS_PER_PAGE, topRepos.length));
  };

  // Fonction pour obtenir la classe de couleur du langage
  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      JavaScript: 'bg-yellow-400',
      TypeScript: 'bg-blue-400',
      Python: 'bg-green-400',
      Java: 'bg-red-400',
      // Ajouter d'autres langages selon les besoins
      default: 'bg-gray-400'
    };
    return colors[language] || colors.default;
  };

  const renderActivityIcon = (type: string) => {
    switch (type) {
      case 'PushEvent':
        return <GitCommit className="w-4 h-4 text-green-500" />;
      case 'PullRequestEvent':
        return <GitPullRequest className="w-4 h-4 text-purple-500" />;
      case 'IssuesEvent':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'CreateEvent':
        return <GitBranch className="w-4 h-4 text-orange-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const techData = useMemo(() => {
    return analyzeTechProgression(repos);
  }, [repos]);

  // Calculer les métriques d'impact avec les vraies données
  const impactMetrics = useMemo(() => {
    const totalPRs = userData?.events?.filter((event: { type: string; }) => 
      event.type === 'PullRequestEvent'
    ).length || 0;

    const mergedPRs = userData?.events?.filter((event: { type: string; payload: { action: string; pull_request: { merged: any; }; }; }) => 
      event.type === 'PullRequestEvent' && 
      event.payload?.action === 'closed' &&
      event.payload?.pull_request?.merged
    ).length || 0;

    const uniqueRepos = new Set(
      userData?.events?.map((event: { repo: { name: any; }; }) => event.repo.name)
    ).size;

    const totalContributions = stats.activity.commits + 
      stats.activity.pullRequests + 
      stats.activity.issues;

    return {
      prMergeRate: totalPRs ? Math.round((mergedPRs / totalPRs) * 100) : 0,
      totalContributions,
      projectsImpacted: uniqueRepos,
      contributionStreak: calculateStreak(userData?.events),
      impactScore: calculateImpactScore({
        commits: stats.activity.commits,
        prs: totalPRs,
        mergeRate: totalPRs ? (mergedPRs / totalPRs) : 0,
        repos: repos.length
      })
    };
  }, [userData, stats, repos.length]);

  // Ajouter une fonction utilitaire pour gérer les dates de manière sécurisée
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  useEffect(() => {
    console.log('userData changed:', userData);
    console.log('calculated stats:', stats);
  }, [userData, stats]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="p-6 mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Image
              src={user.avatar_url}
              alt={`${user.name}'s avatar`}
              width={120}
              height={120}
              className="rounded-full"
              priority
              quality={85}
            />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold dark:text-gray-100">{user.name}</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-4">@{user.login}</p>
              {user.bio && <p className="text-gray-700 dark:text-gray-200 mb-4">{user.bio}</p>}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="dark:text-gray-300">{user.location}</span>
                  </div>
                )}
                {user.blog && (
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <a 
                      href={user.blog} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                    >
                      {user.blog}
                    </a>
                  </div>
                )}
                {user.company && (
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="dark:text-gray-300">{user.company}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="dark:text-gray-300">
                    Joined on {format(new Date(user.created_at), 'MMMM dd, yyyy', { locale: enUS })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Top Repositories Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold dark:text-gray-100">
              {showAllRepos ? "All Repositories" : "Top Repositories"}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLoadMore}
              className="flex items-center gap-2"
            >
              {showAllRepos ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span>Show Less</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span>Show More</span>
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {displayedRepos.map((repo: TopRepo, index: number) => (
              <motion.a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="h-full p-4 hover:shadow-lg transition-shadow dark:bg-gray-800">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg dark:text-gray-100 truncate">
                        {repo.name}
                      </h3>
                      {repo.language && (
                        <span className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`} />
                      )}
                    </div>
                    
                    {repo.description && (
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                        {repo.description}
                      </p>
                    )}
                    
                    <div className="mt-auto">
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          <span>{repo.stars}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <GitFork className="w-4 h-4" />
                          <span>{repo.forks}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDistanceToNow(new Date(repo.lastActivity), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.a>
            ))}
          </div>

          {hasMoreRepos && showAllRepos && (
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadMoreRepos}
                className="flex items-center gap-2"
                disabled={displayCount >= topRepos.length}
              >
                <ChevronDown className="w-4 h-4" />
                <span>
                  {`Load More Repositories (${displayCount}/${topRepos.length})`}
                </span>
              </Button>
            </div>
          )}
        </motion.div>

        {/* Activity Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">Activity Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 dark:bg-gray-800">
              <h3 className="font-semibold mb-3 dark:text-gray-100">Contribution Summary</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitCommit className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-300">Commits</span>
                  </div>
                  <span className="font-medium dark:text-gray-100">
                    {stats.activity.commits || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitPullRequest className="w-4 h-4 text-purple-500" />
                    <span className="text-gray-600 dark:text-gray-300">Pull Requests</span>
                  </div>
                  <span className="font-medium dark:text-gray-100">
                    {stats.activity.pullRequests || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-600 dark:text-gray-300">Issues</span>
                  </div>
                  <span className="font-medium dark:text-gray-100">
                    {stats.activity.issues || 0}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-4 dark:bg-gray-800">
              <h3 className="font-semibold mb-3 dark:text-gray-100">Recent Activity</h3>
              <ScrollArea className="h-[140px] pr-4">
                <div className="space-y-3">
                  {events && events.length > 0 ? (
                    events.map((event: ActivityEvent) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="mt-1">
                          {renderActivityIcon(event.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {event.type === 'PushEvent' ? 'Pushed to' : 'Interacted with'}
                            <span className="text-gray-500 dark:text-gray-400"> </span>
                            <a
                              href={`https://github.com/${typeof event.repo === 'string' ? event.repo : event.repo?.name}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline truncate"
                            >
                              {typeof event.repo === 'string' ? event.repo : event.repo?.name}
                            </a>
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {formatDate(event.created_at || event.date)}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
                      No recent activity found
                    </div>
                  )}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </motion.div>
        {/* Stats Section */}
        <GitHubStats 
          stats={{
            totalStars: Number(stats.totalStars),
            totalForks: Number(stats.totalForks), 
            totalWatchers: Number(stats.totalWatchers),
            repoCount: Number(stats.repoCount),
            topLanguages: stats.languages.topLanguages.map(lang => ({
              name: lang.name,
              count: Number(lang.count)
            }))
          }} 
        />

        {/* Impact Analysis Section */}
        <ImpactSection metrics={impactMetrics} />
      </div>
    </motion.div>
  );
} 