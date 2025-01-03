import { TechData, TechTrend, SkillGap } from '@/types/tech';

interface Repository {
  language: string | null;
  updated_at: string;
  created_at: string;
}

// Helper function to calculate date differences
const getMonthsAgo = (date: Date): number => {
  return (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 30);
};

export function analyzeTechProgression(repos: Repository[]): TechData[] {
  const techUsage = new Map<string, { count: number; dates: Date[] }>();

  repos.forEach(repo => {
    if (repo.language) {
      const usage = techUsage.get(repo.language) || { count: 0, dates: [] };
      usage.count++;
      usage.dates.push(new Date(repo.updated_at));
      techUsage.set(repo.language, usage);
    }
  });

  return Array.from(techUsage.entries())
    .map(([name, data]): TechData => {
      const totalRepos = repos.length;
      const percentage = (data.count / totalRepos) * 100;
      const lastUsed = new Date(Math.max(...data.dates.map(d => d.getTime()))).toISOString();
      
      const recentUsage = data.dates.filter(d => getMonthsAgo(d) <= 3).length;
      const trend = recentUsage > data.count / 4 ? 'up' : 
                   recentUsage === 0 ? 'down' : 'stable';

      return {
        name,
        count: data.count,
        percentage,
        trend,
        lastUsed
      };
    })
    .sort((a, b) => b.percentage - a.percentage);
}

export function getMarketTrends(): TechTrend[] {
  // Cette fonction pourrait être connectée à une API externe pour obtenir
  // des données réelles du marché
  return [
    {
      name: 'React',
      popularity: 95,
      jobDemand: 90,
      salary: { min: 80000, max: 150000, currency: 'USD' }
    },
    // ... autres technologies
  ];
}

export function analyzeSkillGaps(userTech: string[], marketTrends: TechTrend[]): SkillGap[] {
  // Logique pour identifier les compétences manquantes basées sur
  // les technologies actuelles de l'utilisateur et les tendances du marché
  return [];
}

interface TechStack {
  name: string;
  count: number;
}

export function analyzeTechStack(repos: any[]): TechStack[] {
  const techCount = new Map<string, number>();

  repos.forEach(repo => {
    if (repo.language) {
      techCount.set(repo.language, (techCount.get(repo.language) || 0) + 1);
    }
  });

  return Array.from(techCount.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function calculateExperience(repos: any[]): number {
  const dates = repos
    .map(repo => new Date(repo.created_at))
    .sort((a, b) => a.getTime() - b.getTime());

  if (dates.length === 0) return 0;

  const firstRepo = dates[0];
  const now = new Date();
  const years = (now.getTime() - firstRepo.getTime()) / (1000 * 60 * 60 * 24 * 365);

  return Math.round(years * 10) / 10;
}

export function getMainTechnologies(repos: any[]): string[] {
  const techStack = analyzeTechStack(repos);
  return techStack.slice(0, 3).map(tech => tech.name);
} 