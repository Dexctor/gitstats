'use client'

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface GitHubStatsProps {
  stats: {
    totalStars: number;
    totalForks: number;
    totalWatchers: number;
    repoCount: number;
    topLanguages: Array<{
      name: string;
      count: number;
    }>;
  };
}

export default function GitHubStats({ stats }: GitHubStatsProps) {
  // Limiter à 8 langages pour le graphique circulaire
  const topLanguagesForChart = stats.topLanguages
    .slice(0, 8)
    .map(lang => ({
      name: lang.name,
      value: lang.count,
      percentage: ((lang.count / stats.repoCount) * 100).toFixed(1)
    }));

  // Ajouter une catégorie "Others" si nécessaire
  if (stats.topLanguages.length > 8) {
    const othersCount = stats.topLanguages
      .slice(8)
      .reduce((acc, lang) => acc + lang.count, 0);
    
    topLanguagesForChart.push({
      name: 'Others',
      value: othersCount,
      percentage: ((othersCount / stats.repoCount) * 100).toFixed(1)
    });
  }

  const COLORS = [
    '#3b82f6', '#22c55e', '#f59e0b', '#ec4899', '#8b5cf6',
    '#06b6d4', '#ef4444', '#84cc16', '#64748b'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-8"
    >
      <Card className="p-6 dark:bg-gray-800">
        <h2 className="text-2xl font-bold mb-6 dark:text-gray-100">Repository Statistics</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Première colonne : Stats générales et Top Languages */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* ... autres stats ... */}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 dark:text-gray-100">Top Languages</h3>
              <ScrollArea className="h-[200px] w-full pr-4">
                <div className="space-y-2">
                  {stats.topLanguages.map((lang, index) => (
                    <div
                      key={lang.name}
                      className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm dark:text-gray-200">{lang.name}</span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {((lang.count / stats.repoCount) * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Deuxième colonne : Language Distribution */}
          <div>
            <h3 className="text-lg font-semibold mb-3 dark:text-gray-100">Language Distribution</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topLanguagesForChart}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {topLanguagesForChart.map((entry, index) => (
                      <Cell 
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any) => [
                      `${topLanguagesForChart.find(l => l.name === name)?.percentage}%`,
                      name
                    ]}
                  />
                  <Legend 
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
} 