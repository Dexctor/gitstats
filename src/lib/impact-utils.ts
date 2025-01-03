// Vérifiez que vous avez bien configuré votre token GitHub
const headers = {
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  'Content-Type': 'application/json',
}

export function calculateStreak(activities: Array<{
  type: string;
  created_at: string;
  // Add other needed properties
}> | undefined): number {
  if (!activities || activities.length === 0) return 0;

  // Trier les activités par date (plus récente en premier)
  const sortedDates = activities
    .map(activity => new Date(activity.created_at).toISOString().split('T')[0])
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  // Éliminer les doublons de dates
  const uniqueDates = Array.from(new Set(sortedDates));

  let currentStreak = 1;
  const oneDayInMs = 24 * 60 * 60 * 1000;

  // Calculer la série actuelle
  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const currentDate = new Date(uniqueDates[i]);
    const nextDate = new Date(uniqueDates[i + 1]);
    
    const diffDays = (currentDate.getTime() - nextDate.getTime()) / oneDayInMs;
    
    if (diffDays === 1) {
      currentStreak++;
    } else {
      break;
    }
  }

  return currentStreak;
}

export const calculateImpactScore = ({
  commits,
  prs,
  mergeRate,
  repos
}: {
  commits: number;
  prs: number;
  mergeRate: number;
  repos: number;
}) => {
  if (!commits && !prs && !repos) return 0;
  
  // Normaliser les valeurs
  const normalizedCommits = Math.min(commits / 1000, 1);
  const normalizedPRs = Math.min(prs / 100, 1);
  const normalizedMergeRate = mergeRate;
  const normalizedRepos = Math.min(repos / 50, 1);

  // Calculer le score
  const score = (
    (normalizedCommits * 0.4) +
    (normalizedPRs * 0.3) +
    (normalizedMergeRate * 0.2) +
    (normalizedRepos * 0.1)
  ) * 100;

  return Math.round(score);
}; 