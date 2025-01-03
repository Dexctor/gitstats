'use client'

import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Star, GitPullRequest, GitMerge, Users, Award, Flame } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface ImpactMetrics {
  prMergeRate: number;
  totalContributions: number;
  projectsImpacted: number;
  contributionStreak: number;
  impactScore: number;
}

interface ImpactSectionProps {
  metrics: ImpactMetrics;
}

export function ImpactSection({ metrics }: ImpactSectionProps) {
  // Valider et nettoyer les métriques
  const validMetrics = {
    prMergeRate: isNaN(metrics.prMergeRate) ? 0 : Math.min(100, Math.max(0, metrics.prMergeRate)),
    totalContributions: isNaN(metrics.totalContributions) ? 0 : Math.max(0, metrics.totalContributions),
    projectsImpacted: isNaN(metrics.projectsImpacted) ? 0 : Math.max(0, metrics.projectsImpacted),
    contributionStreak: isNaN(metrics.contributionStreak) ? 0 : Math.max(0, metrics.contributionStreak),
    impactScore: isNaN(metrics.impactScore) ? 0 : Math.min(100, Math.max(0, metrics.impactScore))
  };

  const impactLevel = validMetrics.impactScore >= 80 ? 'High' :
                     validMetrics.impactScore >= 50 ? 'Medium' : 'Growing';

  const impactColor = {
    High: 'text-green-500',
    Medium: 'text-yellow-500',
    Growing: 'text-blue-500'
  }[impactLevel];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-8"
    >
      <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">Contribution Impact</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg dark:text-gray-100">Impact Score</h3>
            <div className={`flex items-center gap-2 ${impactColor}`}>
              <Flame className="w-5 h-5" />
              <span className="font-bold">{impactLevel}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Overall Impact</span>
                <span className="font-medium">{validMetrics.impactScore}%</span>
              </div>
              <Progress value={validMetrics.impactScore} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <GitMerge className="w-4 h-4 text-purple-500" />
                <div>
                  <p className="text-sm font-medium">{validMetrics.prMergeRate}%</p>
                  <p className="text-xs text-gray-500">PR Merge Rate</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">{validMetrics.contributionStreak}</p>
                  <p className="text-xs text-gray-500">Day Streak</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 dark:bg-gray-800">
          <h3 className="font-semibold text-lg mb-4 dark:text-gray-100">Contribution Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitPullRequest className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Total Contributions</span>
              </div>
              <span className="font-medium">{validMetrics.totalContributions.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm">Projects Impacted</span>
              </div>
              <span className="font-medium">{validMetrics.projectsImpacted}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-500" />
                <span className="text-sm">Active Streak</span>
              </div>
              <span className="font-medium">{validMetrics.contributionStreak} days</span>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
} 