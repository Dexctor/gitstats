'use client'

import { motion } from "framer-motion";
import { Card } from "../components/ui/card";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";
import { useState, useEffect, useCallback } from "react";
import { Calendar, GitPullRequest, GitCommit, AlertCircle, ArrowUp, ArrowDown, Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useMediaQuery } from "../hooks/useMediaQuery";

interface TrendAnalysisProps {
  data: {
    events: Array<{
      type: string;
      created_at: string;
      payload?: {
        commits?: Array<{ sha: string }>;
        action?: string;
      };
    }>;
    repos: Array<any>;
  };
}

interface ContributionData {
  date: string;
  commits: number;
  pullRequests: number;
  issues: number;
}

const defaultData: TrendAnalysisProps['data'] = {
  events: [],
  repos: []
};

export default function TrendAnalysis({ data = defaultData }: TrendAnalysisProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [period, setPeriod] = useState<'6m' | '1y' | '2y' | 'all'>('1y');
  const defaultView = isMobile ? 'list' : 'chart';
  const [activeView, setActiveView] = useState<'chart' | 'list'>(defaultView);
  const [filteredData, setFilteredData] = useState<ContributionData[]>([]);

  const transformEventsToContributions = useCallback((events: TrendAnalysisProps['data']['events']): ContributionData[] => {
    if (!events?.length) return [];

    const groupedEvents = events.reduce<Record<string, ContributionData>>((acc, event) => {
      const date = new Date(event.created_at).toISOString().split('T')[0];
      
      if (!acc[date]) {
        acc[date] = {
          date,
          commits: 0,
          pullRequests: 0,
          issues: 0
        };
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
      }

      return acc;
    }, {});

    return Object.values(groupedEvents);
  }, []);

  const filterDataByPeriod = useCallback((contributions: ContributionData[]): ContributionData[] => {
    if (!contributions?.length) return [];
    
    const now = new Date();
    const monthsToShow = {
      '6m': 6,
      '1y': 12,
      '2y': 24,
      'all': contributions.length
    }[period];

    const startDate = new Date();
    startDate.setMonth(now.getMonth() - monthsToShow);

    return contributions
      .filter(item => new Date(item.date) >= startDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [period]);

  useEffect(() => {
    const contributions = transformEventsToContributions(data.events);
    const filtered = filterDataByPeriod(contributions);
    console.log('Filtered contributions:', filtered); // Pour le débogage
    setFilteredData(filtered);
  }, [data.events, period, filterDataByPeriod, transformEventsToContributions]);

  // Calculer les totaux pour l'aperçu
  const overview = {
    totalCommits: filteredData.reduce((sum, item) => sum + item.commits, 0),
    totalPRs: filteredData.reduce((sum, item) => sum + item.pullRequests, 0),
    totalIssues: filteredData.reduce((sum, item) => sum + item.issues, 0)
  };

  if (!data?.events?.length) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        No contribution data available
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-8"
    >
      <Card className="p-6 dark:bg-gray-800">
        <h2 className="text-2xl font-bold mb-6 dark:text-gray-100">Contribution Trends</h2>
        
        <Tabs defaultValue={activeView} className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="chart">Chart View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
            
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as typeof period)}
              className="ml-4 p-2 rounded border dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="6m">Last 6 months</option>
              <option value="1y">Last year</option>
              <option value="2y">Last 2 years</option>
              <option value="all">All time</option>
            </select>
          </div>

          <TabsContent value="chart" className="mt-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="commits" 
                    stroke="#22c55e" 
                    name="Commits"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pullRequests" 
                    stroke="#a855f7" 
                    name="Pull Requests"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="issues" 
                    stroke="#3b82f6" 
                    name="Issues"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            <div className="space-y-4">
              {filteredData.map((item) => (
                <div 
                  key={item.date} 
                  className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium dark:text-gray-200">{item.date}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <GitCommit className="w-4 h-4 text-green-500" />
                      <span className="text-sm dark:text-gray-300">{item.commits} commits</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GitPullRequest className="w-4 h-4 text-purple-500" />
                      <span className="text-sm dark:text-gray-300">{item.pullRequests} PRs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-500" />
                      <span className="text-sm dark:text-gray-300">{item.issues} issues</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </motion.div>
  );
} 