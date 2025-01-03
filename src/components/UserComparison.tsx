'use client'

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { searchGithubUser } from "@/lib/github";
import { useSession } from "next-auth/react";
import { ArrowUpIcon, ArrowDownIcon, MinusIcon, GitForkIcon, StarIcon, CodeIcon, UsersIcon, GitPullRequestIcon, GitCommitIcon, CalendarIcon, AwardIcon, RefreshCw, InfoIcon } from "lucide-react";
import { format, differenceInYears, parseISO } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { UsersIcon as Users } from 'lucide-react';
import Image from 'next/image'
// Ajout d'une interface pour les statistiques comparatives
interface ComparisonStats {
  label: string;
  value1: number;
  value2: number;
  icon: any;
  format?: (value: number) => string;
}

// Ajoutez une interface pour les statistiques
interface StatItem {
  label: string;
  value1: number;
  value2: number;
  icon?: any;
  format?: (num: number) => string;
}

interface SectionItem {
  label: string;
  icon: any;
  stats: StatItem[];
}

// Ajout d'une nouvelle interface pour les métriques de comparaison
interface ComparisonMetric {
  label: string;
  value1: number;
  value2: number;
  icon: any;
  color: string;
  unit?: string;
  description?: string;
  category: 'impact' | 'activity' | 'community' | 'quality';
  importance: number; // 1-5, pour trier les métriques par importance
  format?: 'ratio' | 'number';
}

interface Repository {
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
}

export default function UserComparison() {
  const [users, setUsers] = useState<any[]>([]);
  const { data: session } = useSession();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const addUser = async (username: string) => {
    try {
      setLoading(true);
      const userData = await searchGithubUser(username);
      if (userData) {
        setUsers(prev => {
          // Éviter les doublons
          if (prev.some(u => u.user.login === userData.user.login)) {
            return prev;
          }
          
          // Transformer les données pour correspondre à la structure attendue
          const transformedData = {
            user: userData.user,
            stats: {
              repoCount: userData.repos.length,
              totalStars: userData.repos.reduce((acc: number, repo: Repository) => 
                acc + (repo.stargazers_count || 0), 0),
              totalForks: userData.repos.reduce((acc: number, repo: Repository) => 
                acc + (repo.forks_count || 0), 0),
              totalWatchers: userData.repos.reduce((acc: number, repo: Repository) => 
                acc + (repo.watchers_count || 0), 0),
              topLanguages: calculateTopLanguages(userData.repos),
              followers: userData.user.followers,
              following: userData.user.following
            }
          };

          return [...prev, transformedData].slice(-2); // Garder seulement les 2 derniers
        });
      }
    } catch (error) {
      console.error('Error adding user for comparison:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setLoading(true);
    try {
      await addUser(username);
      setUsername('');
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour calculer le pourcentage de différence
  const calculateDifference = (value1: number, value2: number) => {
    if (isNaN(value1) || isNaN(value2)) return 0;
    if (value1 === 0 && value2 === 0) return 0;
    return ((value2 - value1) / Math.max(value1, 1)) * 100;
  };

  // Fonction pour rendre l'indicateur de comparaison
  const ComparisonIndicator = ({ value1, value2 }: { value1: number, value2: number }) => {
    if (isNaN(value1) || isNaN(value2)) {
      return <MinusIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
    }
    
    const diff = calculateDifference(value1, value2);
    if (Math.abs(diff) < 1) {
      return <MinusIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
    }
    return diff > 0 ? (
      <ArrowUpIcon className="w-4 h-4 text-green-500 dark:text-green-400" />
    ) : (
      <ArrowDownIcon className="w-4 h-4 text-red-500 dark:text-red-400" />
    );
  };

  // Fonction pour formater les grands nombres
  const formatNumber = (num: number, type: 'ratio' | 'number' = 'number'): string => {
    if (isNaN(num)) return '0';
    
    if (type === 'ratio') {
      return num.toFixed(2);
    }
    
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toFixed(0);
  };

  const handleReset = () => {
    setUsers([]);
    setUsername('');
  };

  // Dans le composant UserComparison, ajoutez cette nouvelle fonction
  const ComparisonMetrics = ({ users }: { users: any[] }) => {
    if (users.length !== 2) return null;

    const metrics: ComparisonMetric[] = [
      // Impact Metrics
      {
        label: "Repository Impact",
        value1: users[0].stats.totalStars + users[0].stats.totalForks,
        value2: users[1].stats.totalStars + users[1].stats.totalForks,
        icon: AwardIcon,
        color: "text-yellow-500",
        description: "Combined stars and forks - indicates project popularity",
        category: 'impact',
        importance: 5
      },
      {
        label: "Average Stars",
        value1: Math.round(users[0].stats.totalStars / users[0].stats.repoCount),
        value2: Math.round(users[1].stats.totalStars / users[1].stats.repoCount),
        icon: StarIcon,
        color: "text-purple-500",
        description: "Average stars per repository - quality indicator",
        category: 'quality',
        importance: 4
      },
      // Community Metrics
      {
        label: "Community Size",
        value1: users[0].stats.followers,
        value2: users[1].stats.followers,
        icon: UsersIcon,
        color: "text-blue-500",
        description: "Total followers - community reach",
        category: 'community',
        importance: 4
      },
      {
        label: "Engagement Ratio",
        value1: users[0].stats.following > 0 
          ? Number((users[0].stats.followers / users[0].stats.following).toFixed(2))
          : 0,
        value2: users[1].stats.following > 0 
          ? Number((users[1].stats.followers / users[1].stats.following).toFixed(2))
          : 0,
        icon: Users,
        color: "text-green-500",
        description: "Followers to following ratio - influence indicator (higher is better)",
        category: 'community',
        importance: 3,
        format: 'ratio'
      },
      // Activity Metrics
      {
        label: "Repository Count",
        value1: users[0].stats.repoCount,
        value2: users[1].stats.repoCount,
        icon: CodeIcon,
        color: "text-indigo-500",
        description: "Total public repositories",
        category: 'activity',
        importance: 3
      },
      {
        label: "Fork Rate",
        value1: Math.round((users[0].stats.totalForks / users[0].stats.repoCount) * 10) / 10,
        value2: Math.round((users[1].stats.totalForks / users[1].stats.repoCount) * 10) / 10,
        icon: GitForkIcon,
        color: "text-orange-500",
        description: "Average forks per repository - code reuse indicator",
        category: 'impact',
        importance: 3
      }
    ];

    // Grouper les métriques par catégorie
    const groupedMetrics = metrics.reduce((acc, metric) => {
      if (!acc[metric.category]) {
        acc[metric.category] = [];
      }
      acc[metric.category].push(metric);
      return acc;
    }, {} as Record<string, ComparisonMetric[]>);

    // Trier les métriques par importance dans chaque catégorie
    Object.keys(groupedMetrics).forEach(category => {
      groupedMetrics[category].sort((a, b) => b.importance - a.importance);
    });

    const categoryTitles = {
      impact: "Project Impact",
      activity: "Development Activity",
      community: "Community Engagement",
      quality: "Code Quality"
    };

    return (
      <div className="mt-8 space-y-8">
        {Object.entries(groupedMetrics).map(([category, categoryMetrics]) => (
          <div key={category} className="space-y-4">
            <h3 className="text-xl font-semibold dark:text-gray-100 flex items-center gap-2">
              {categoryTitles[category as keyof typeof categoryTitles]}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="w-4 h-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm max-w-xs">
                      {getCategoryDescription(category)}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryMetrics.map((metric, index) => {
                const diff = calculateDifference(metric.value1, metric.value2);
                const max = Math.max(metric.value1, metric.value2);
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <metric.icon className={`w-5 h-5 ${metric.color}`} />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="font-medium dark:text-gray-200">{metric.label}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-sm">{metric.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {users[0].user.login}
                          </span>
                          <span className="font-semibold dark:text-gray-200">
                            {metric.format === 'ratio' 
                              ? `${formatNumber(metric.value1, 'ratio')}x`
                              : formatNumber(metric.value1)
                            }
                          </span>
                        </div>
                        <Progress 
                          value={(metric.value1 / max) * 100} 
                          className="h-2"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {users[1].user.login}
                          </span>
                          <span className="font-semibold dark:text-gray-200">
                            {metric.format === 'ratio' 
                              ? `${formatNumber(metric.value2, 'ratio')}x`
                              : formatNumber(metric.value2)
                            }
                          </span>
                        </div>
                        <Progress 
                          value={(metric.value2 / max) * 100} 
                          className="h-2"
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end">
                      {diff !== 0 && (
                        <span className={`text-sm flex items-center gap-1 ${
                          diff > 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {diff > 0 ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                          {Math.abs(diff).toFixed(1)}% difference
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Ajout d'une section de résumé */}
        <div className="mt-8 bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold dark:text-gray-100 mb-4">Overall Analysis</h3>
          <div className="space-y-4">
            {generateOverallAnalysis(users, metrics)}
          </div>
        </div>
      </div>
    );
  };

  // Fonction pour générer une analyse globale
  const generateOverallAnalysis = (users: any[], metrics: ComparisonMetric[]) => {
    const user1Wins = metrics.filter(m => m.value1 > m.value2).length;
    const user2Wins = metrics.filter(m => m.value2 > m.value1).length;
    
    const strengths = {
      [users[0].user.login]: getStrengths(metrics, true),
      [users[1].user.login]: getStrengths(metrics, false)
    };

    return (
      <>
        <p className="text-gray-600 dark:text-gray-400">
          <strong>{users[0].user.login}</strong> shows stronger metrics in {user1Wins} categories, while 
          <strong> {users[1].user.login}</strong> leads in {user2Wins} categories.
        </p>
        {Object.entries(strengths).map(([user, userStrengths]) => (
          <div key={user} className="mt-2">
            <p className="font-medium dark:text-gray-300">{user}&apos;s key strengths:</p>
            <ul className="list-disc list-inside ml-4 text-gray-600 dark:text-gray-400">
              {userStrengths.map((strength, idx) => (
                <li key={idx}>{strength}</li>
              ))}
            </ul>
          </div>
        ))}
      </>
    );
  };

  // Ajout de la fonction manquante getCategoryDescription
  const getCategoryDescription = (category: string): string => {
    const descriptions = {
      impact: "Metrics that show the overall influence and reach of projects",
      activity: "Indicators of development frequency and consistency",
      community: "Measures of social interaction and community engagement",
      quality: "Indicators of code quality and project maintenance"
    };
    return descriptions[category as keyof typeof descriptions] || "";
  };

  // Ajout de la fonction manquante getStrengths
  const getStrengths = (metrics: ComparisonMetric[], isFirstUser: boolean): string[] => {
    return metrics
      .filter(m => {
        const diff = ((m.value2 - m.value1) / Math.max(m.value1, 1)) * 100;
        return isFirstUser ? diff < 0 : diff > 0;
      })
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 3)
      .map(m => {
        const value = isFirstUser ? m.value1 : m.value2;
        return `Strong ${m.label.toLowerCase()} with ${formatMetricValue(value, m)}`;
      });
  };

  // Fonction utilitaire pour formater les valeurs des métriques
  const formatMetricValue = (value: number, metric?: ComparisonMetric): string => {
    if (isNaN(value)) return '0';
    
    if (metric?.format === 'ratio') {
      return `${value.toFixed(2)}x`;
    }

    // Gestion des grands nombres avec des suffixes plus lisibles
    const tiers = [
      { threshold: 1e9, suffix: 'B' },   // Milliards
      { threshold: 1e6, suffix: 'M' },   // Millions
      { threshold: 1e3, suffix: 'K' }    // Milliers
    ];

    for (let { threshold, suffix } of tiers) {
      if (value >= threshold) {
        const scaled = value / threshold;
        // Utiliser moins de décimales pour les très grands nombres
        if (scaled >= 100) {
          return `${Math.round(scaled)}${suffix}`;
        }
        if (scaled >= 10) {
          return `${scaled.toFixed(1)}${suffix}`;
        }
        return `${scaled.toFixed(2)}${suffix}`;
      }
    }

    // Pour les petits nombres, pas de décimales
    return Math.round(value).toString();
  };

  // Ajouter la fonction calculateTopLanguages
  const calculateTopLanguages = (repos: any[]) => {
    const languages = repos.reduce((acc: Record<string, number>, repo) => {
      if (repo.language) {
        acc[repo.language] = (acc[repo.language] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(languages)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  function formatDifference(value1: number, value2: number): string {
    if (value1 === value2) return "Equal";
    if (value1 === 0 && value2 === 0) return "Equal";
    
    // Si l'une des valeurs est 0, utiliser une approche différente
    if (value1 === 0) {
      return `${formatMetricValue(value2)} total`;
    }
    if (value2 === 0) {
      return `${formatMetricValue(value1)} total`;
    }

    const ratio = value2 / value1;
    
    // Pour des différences très importantes
    if (ratio > 100) {
      return `${Math.round(ratio)}× more`;
    }
    if (ratio < 0.01) {
      return `${Math.round(1/ratio)}× less`;
    }

    // Pour des différences modérées
    const percentDiff = ((value2 - value1) / value1) * 100;
    if (Math.abs(percentDiff) > 100) {
      const multiplier = Math.round(Math.abs(percentDiff) / 100);
      return `${multiplier}× ${percentDiff > 0 ? 'more' : 'less'}`;
    }

    // Pour des différences plus petites
    return `${Math.abs(percentDiff).toFixed(0)}% ${percentDiff > 0 ? 'more' : 'less'}`;
  }

  function ComparisonMetric({ label, value1, value2, icon: Icon }: ComparisonMetric) {
    const difference = formatDifference(value1, value2);
    const isIncrease = value2 > value1;
    const isEqual = value1 === value2 || (value1 === 0 && value2 === 0);

    return (
      <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-4 h-4 text-gray-500" />
          <span className="font-medium dark:text-gray-200">{label}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 items-center">
          <div className="text-sm">
            <div className="font-medium dark:text-gray-300">{formatMetricValue(value1)}</div>
          </div>
          <div className="flex justify-center">
            {!isEqual && (
              <div className={`text-xs px-2 py-1 rounded ${
                isIncrease 
                  ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30' 
                  : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
              }`}>
                {difference}
              </div>
            )}
            {isEqual && (
              <div className="text-xs px-2 py-1 rounded text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700/30">
                Equal
              </div>
            )}
          </div>
          <div className="text-sm text-right">
            <div className="font-medium dark:text-gray-300">{formatMetricValue(value2)}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Card className="p-6 dark:bg-gray-800">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold dark:text-gray-100">Compare GitHub Profiles</h2>
            {users.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="flex items-center gap-2 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset Comparison</span>
              </Button>
            )}
          </div>
          <form onSubmit={handleAddUser} className="flex gap-3">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub username"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:placeholder-gray-400"
            />
            <Button 
              type="submit" 
              disabled={loading || users.length >= 2}
              className="min-w-[100px] dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              {loading ? 'Loading...' : users.length >= 2 ? 'Max 2 Users' : 'Compare'}
            </Button>
          </form>
          {users.length === 1 && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Add another user to compare profiles
            </p>
          )}
        </div>

        {users.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {users.map((user, index) => (
                <div 
                  key={user?.user?.login || index}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 space-y-4"
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src={user?.user?.avatar_url}
                      alt={user?.user?.login || 'User avatar'}
                      width={64}
                      height={64}
                      className="rounded-full border-2 border-gray-200 dark:border-gray-600"
                    />
                    <div>
                      <h3 className="text-xl font-semibold dark:text-gray-100">
                        {user?.user?.name || user?.user?.login}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">@{user?.user?.login}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Repositories</div>
                      <div className="text-xl font-bold dark:text-gray-100">
                        {user?.stats?.repoCount || 0}
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Stars</div>
                      <div className="text-xl font-bold dark:text-gray-100">
                        {formatNumber(user?.stats?.totalStars || 0)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Top Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {user?.stats?.topLanguages?.slice(0, 5)?.map((lang: any, idx: number) => (
                        <TooltipProvider key={idx}>
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="px-3 py-1 bg-white rounded-full text-sm">
                                {lang.name}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-sm">
                                {lang.count} repositories use {lang.name}
                                <br />
                                {((lang.count / (user?.stats?.repoCount || 1)) * 100).toFixed(1)}% of total
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <h4 className="font-semibold mb-2">Activity Overview</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Followers</p>
                        <p className="text-xl font-bold">{user?.stats?.followers}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Following</p>
                        <p className="text-xl font-bold">{user?.stats?.following}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {users.length === 2 && (
              <ComparisonMetrics users={users} />
            )}
          </>
        )}
      </Card>
    </motion.div>
  );
} 