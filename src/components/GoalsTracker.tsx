import { Card } from "@tremor/react";

export function GoalsTracker({ userData }: { userData: any }) {
  return (
    <Card>
      <h3>Development Goals</h3>
      {/* Custom Goals */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium">Current Progress</h4>
        <div className="grid gap-4">
          {userData?.goals?.map((goal: any) => (
            <div key={goal.id} className="flex justify-between items-center">
              <span>{goal.name}</span>
              <span>{goal.progress}%</span>
            </div>
          ))}
        </div>
      </div>
      {/* Progression */}
      <div className="mt-6">
        <h4 className="text-lg font-medium mb-4">Progress Timeline</h4>
        <div className="text-sm text-gray-500">
          Timeline component will be implemented soon
        </div>
      </div>
    </Card>
  );
} 