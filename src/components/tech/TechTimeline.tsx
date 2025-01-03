'use client'

import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from "@/components/ui/card";
import { TechData } from '@/types/tech';

interface TechTimelineProps {
  data: TechData[];
}

export function TechTimeline({ data }: TechTimelineProps) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Technology Evolution</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="lastUsed" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="percentage" stroke="#3b82f6" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
        {data.map((tech) => (
          <motion.div
            key={tech.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
          >
            <div className="flex-1">
              <p className="font-medium">{tech.name}</p>
              <p className="text-sm text-gray-500">{tech.percentage}%</p>
            </div>
            <TrendIcon trend={tech.trend} />
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

function TrendIcon({ trend }: { trend: TechData['trend'] }) {
  const colors = {
    up: 'text-green-500',
    down: 'text-red-500',
    stable: 'text-blue-500'
  };

  return (
    <div className={`${colors[trend]}`}>
      {trend === 'up' && '↑'}
      {trend === 'down' && '↓'}
      {trend === 'stable' && '→'}
    </div>
  );
} 