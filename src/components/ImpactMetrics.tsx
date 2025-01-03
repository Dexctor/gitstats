import { Card } from "@/components/ui/card";

interface UserMetrics {
  contributions: number;
  reach: number;
  helpfulnessScore: number;
  mentorshipCount: number;
}

export function ImpactMetrics({ userData }: { userData: UserMetrics }) {
  // Valider et nettoyer les données
  const validData = {
    contributions: isNaN(userData.contributions) ? 0 : Math.max(0, userData.contributions),
    reach: isNaN(userData.reach) ? 0 : Math.max(0, userData.reach),
    helpfulnessScore: isNaN(userData.helpfulnessScore) ? 0 : Math.min(100, Math.max(0, userData.helpfulnessScore)),
    mentorshipCount: isNaN(userData.mentorshipCount) ? 0 : Math.max(0, userData.mentorshipCount)
  };

  return (
    <Card className="p-6 dark:bg-gray-800">
      <h3 className="text-xl font-bold mb-4 dark:text-gray-100">Developer Impact</h3>
      
      <div className="space-y-6">
        {/* Score d'influence */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Contributions</span>
            <span className="font-medium dark:text-gray-200">
              {validData.contributions.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Project Reach</span>
            <span className="font-medium dark:text-gray-200">
              {validData.reach.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Communauté */}
        <div>
          <h4 className="text-lg font-medium mb-3 dark:text-gray-200">Community Impact</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Helpfulness Score</span>
              <span className="font-medium dark:text-gray-200">
                {validData.helpfulnessScore}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Mentorship</span>
              <span className="font-medium dark:text-gray-200">
                {validData.mentorshipCount} mentee{validData.mentorshipCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
} 