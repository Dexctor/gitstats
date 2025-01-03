import { analyzeTechProgression } from "@/lib/tech-analysis";
import { Card } from "@tremor/react";
import { TechTimeline } from "./tech/TechTimeline";

export function TechAnalysis({ repos }: { repos: any[] }) {
  function getCurrentTech(repos: any[]) {
    throw new Error("Function not implemented.");
  }

  function getUserTech(repos: any[]) {
    throw new Error("Function not implemented.");
  }

  return (
    <Card>
      <h3>Technology Insights</h3>
      {/* Évolution des technologies utilisées */}
      <TechTimeline data={analyzeTechProgression(repos)} />
      {/* Suggestions de montée en compétence */}
      {/* <SkillGaps currentTech={getCurrentTech(repos)} /> */}
      
      {/* Tendances du marché */}
      {/* <MarketTrends userTech={getUserTech(repos)} /> */}
    </Card>
  );
} 