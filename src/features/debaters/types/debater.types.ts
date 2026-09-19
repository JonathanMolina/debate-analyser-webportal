export interface DebaterReferenceAudio {
  type: 'youtube' | 'file' | 'none';
  youtubeUrl?: string;
  sampleStart?: string;
  sampleEnd?: string;
  audioPath?: string;
}

export interface Debater {
  id: string;
  name: string;
  photoUrl?: string;
  photoStoragePath?: string;
  bio?: string;
  party?: string;
  role?: string;
  referenceAudio?: DebaterReferenceAudio;
  createdAt: number;
  updatedAt: number;
}

export interface DebaterDebateHistoryItem {
  jobId: string;
  debateTitle?: string;
  date: number;
  opponentNames: string[];
  score: number;
  result: 'win' | 'loss' | 'draw';
  difference: number;
  speakingTimeSeconds: number;
  fallaciesCount: number;
}

export interface DebaterAggregateStats {
  debaterId: string;
  debaterName: string;
  photoUrl?: string;
  role?: string;
  party?: string;
  debatesCount: number;
  wins: number;
  draws: number;
  losses: number;
  winRate: number; // 0 a 100
  avgScore: number;
  avgSpeakingTimeSeconds: number;
  avgWordsPerMinute: number;
  avgVocabularyRichness: number;
  avgDataDensity: number;
  avgEmotionalControl: number;
  avgAssertiveness: number;
  avgVocalStability: number;
  avgDirectAnswerRate: number;
  avgRebuttalScore: number;
  totalFallacies: number;
  avgFallaciesPerDebate: number;
  totalFactChecks: number;
  factCheckAccuracy: number;
  recentDebates: DebaterDebateHistoryItem[];
}
