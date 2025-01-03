'use client'

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TechStackProps {
  repos: any[];
}

export default function TechStack({ repos }: TechStackProps) {
  const getTechStack = () => {
    const stack = new Set<string>();
    repos.forEach(repo => {
      if (repo.language) stack.add(repo.language);
    });
    return Array.from(stack);
  };

  // Analyser les dépendances des repos pour trouver les frameworks et bases de données
  const getFrameworks = () => {
    const frameworks = new Set<string>();
    repos.forEach(repo => {
      if (repo.package_json?.dependencies) {
        if (repo.package_json.dependencies.react) frameworks.add('React');
        if (repo.package_json.dependencies.vue) frameworks.add('Vue');
        if (repo.package_json.dependencies.angular) frameworks.add('Angular');
        if (repo.package_json.dependencies.next) frameworks.add('Next.js');
        if (repo.package_json.dependencies.express) frameworks.add('Express');
      }
    });
    return Array.from(frameworks);
  };

  const getDatabases = () => {
    const databases = new Set<string>();
    repos.forEach(repo => {
      if (repo.package_json?.dependencies) {
        if (repo.package_json.dependencies.mongodb) databases.add('MongoDB');
        if (repo.package_json.dependencies.pg) databases.add('PostgreSQL');
        if (repo.package_json.dependencies.mysql) databases.add('MySQL');
        if (repo.package_json.dependencies.redis) databases.add('Redis');
      }
    });
    return Array.from(databases);
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">Stack Technologique</h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold mb-2">Langages</h4>
          <div className="flex flex-wrap gap-2">
            {getTechStack().map((tech, index) => (
              <Badge key={index} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Frameworks & Librairies</h4>
          <div className="flex flex-wrap gap-2">
            {getFrameworks().map((framework, index) => (
              <Badge key={index} variant="outline">
                {framework}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Bases de données</h4>
          <div className="flex flex-wrap gap-2">
            {getDatabases().map((db, index) => (
              <Badge key={index} variant="outline">
                {db}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
} 