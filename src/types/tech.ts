export interface TechData {
  name: string;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  lastUsed: string;
}

export interface TechTrend {
  name: string;
  popularity: number;
  jobDemand: number;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
}

export interface SkillGap {
  technology: string;
  priority: 'high' | 'medium' | 'low';
  marketDemand: number;
  currentSkillLevel?: number;
} 