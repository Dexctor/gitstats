'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, Clock, Code } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface SearchFilters {
  language: string[];
  minStars: number;
  lastUpdated: string;
  hasTests: boolean;
  hasDocumentation: boolean;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
}

export default function AdvancedSearch({ onSearch }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    language: [],
    minStars: 0,
    lastUpdated: '1y',
    hasTests: false,
    hasDocumentation: false
  });

  const popularLanguages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust'
  ] as const;

  const timeFrames = [
    { value: '1m', label: '1 mois' },
    { value: '6m', label: '6 mois' },
    { value: '1y', label: '1 an' }
  ] as const;

  const handleLanguageToggle = (lang: string) => {
    setFilters(prev => ({
      ...prev,
      language: prev.language.includes(lang)
        ? prev.language.filter(l => l !== lang)
        : [...prev.language, lang]
    }));
  };

  const handleTimeFrameChange = (value: string) => {
    setFilters(prev => ({ ...prev, lastUpdated: value }));
  };

  const resetFilters = () => {
    setFilters({
      language: [],
      minStars: 0,
      lastUpdated: '1y',
      hasTests: false,
      hasDocumentation: false
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Langages</h3>
          <div className="flex flex-wrap gap-2">
            {popularLanguages.map(lang => (
              <Badge
                key={lang}
                variant={filters.language.includes(lang) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleLanguageToggle(lang)}
              >
                {lang}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Dernière mise à jour</h3>
          <div className="flex gap-2">
            {timeFrames.map(({ value, label }) => (
              <Button
                key={value}
                variant={filters.lastUpdated === value ? 'default' : 'outline'}
                onClick={() => handleTimeFrameChange(value)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={resetFilters}
          >
            <Filter className="w-4 h-4" />
            Réinitialiser
          </Button>
          
          <Button
            className="flex-1 flex items-center gap-2"
            onClick={() => onSearch(filters)}
          >
            <Search className="w-4 h-4" />
            Rechercher
          </Button>
        </div>
      </div>
    </Card>
  );
} 