

export interface ActivityActivityEvent {
  date: string;
  type?: 'commit' | 'pr' | 'issue' | 'review';
  id?: string;
  repo?: string;
  // autres propriétés selon vos besoins
} 