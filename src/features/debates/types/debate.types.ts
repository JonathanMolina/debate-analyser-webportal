export type FactCheckVerdict = 'Verdadeiro' | 'Falso' | 'Impreciso' | 'Disputado';

export interface FactCheckItem {
  id: string;
  timestamp: number;
  speaker: string;
  claim: string;
  verdict: FactCheckVerdict;
  evidence: string;
  sources: string[];
}

export interface FallacyItem {
  id: string;
  timestamp: number;
  speaker: string;
  type: string;
  quote: string;
}

export interface TurnItem {
  speaker: string;
  start: number;
  end: number;
  text: string;
  temperature: number;
  overlap?: boolean;
  confidence?: number;
}

export interface LinguisticMetrics {
  wordsPerMinute: number;
  vocabularyRichness: number; // 0 a 100
  formality: number; // 0 a 100
  dataDensity: number; // 0 a 100
  totalWords: number;
}

export interface ToneMetrics {
  averageTemperature: number;
  emotionalControl: number; // 0 a 100
  assertiveness: number; // 0 a 100
  vocalStability: number; // 0 a 100
}

export interface QAMetrics {
  questionsAsked: number;
  questionsAnswered: number;
  evasiveAnswers?: number;
  directAnswerRate: number; // 0 a 100
}

export interface ContentMetrics {
  rebuttalScore: number; // 0 a 100
  argumentStructureDensity: number; // 0 a 100
  topicAdherence: number; // 0 a 100
  framingIndex: number; // 0 a 100
  netFactuality: number; // 0 a 100
  fallacyDensity: number;
}

export interface TopCommentItem {
  id: string;
  author: string;
  authorAvatarUrl?: string;
  text: string;
  likes: number;
  publishedAt?: string;
  favoredSpeaker?: string; // Debatedor favorecido ou 'Neutro'
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface AudienceSpeakerFeedback {
  speakerName: string;
  approvalPercentage: number; // Ex: 68%
  supportCount: number;
  keyReasons: string[]; // Motivos apontados pelas pessoas
}

export interface AudienceMetrics {
  totalCommentsAnalyzed: number;
  favoredWinner: string; // Quem a comunidade considerou vencedor
  winnerAgreementWithAlgorithm: boolean; // Se concorda com a análise técnica
  publicVerdictSummary: string; // Síntese do sentimento geral da comunidade
  speakersFeedback: Record<string, AudienceSpeakerFeedback>;
  topComments: TopCommentItem[]; // Top comentários mais curtidos (até 15)
}

export interface ScoreCategoryBreakdown {
  evidencePoints: number;
  fallacyPenalties: number;
  qaPoints: number;
  rebuttalPoints?: number;
  structurePoints?: number;
  factualityRate?: number;
  contentPoints?: number;
  tonePoints: number;
  speakingEfficiency: number;
  audiencePoints?: number; // Pontos conferidos pela avaliação popular (peso calibrado até 30 pts)
  totalPoints: number;
}

export interface DebateScore {
  scores: Record<string, number>;
  winner: string;
  difference: number;
  isDraw: boolean;
  breakdown: Record<string, ScoreCategoryBreakdown>;
}

export interface DebateMetrics {
  speakingTime: Record<string, number>;
  interruptions: Record<string, number>;
  fallaciesCount: Record<string, number>;
  averageTemperature: number;
  linguisticMetrics?: Record<string, LinguisticMetrics>;
  toneMetrics?: Record<string, ToneMetrics>;
  qaMetrics?: Record<string, QAMetrics>;
  contentMetrics?: Record<string, ContentMetrics>;
  audienceMetrics?: AudienceMetrics;
  debateScore?: DebateScore;
}

export interface SpeakerInput {
  name: string;
  imagePath?: string;
  previewUrl?: string;
  debaterId?: string;
  party?: string;
}

export interface DebateJob {
  id: string;
  title?: string;
  description?: string;
  youtubeUrl: string;
  youtubeId: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  category?: string;
  speakers: SpeakerInput[];
  status: 'idle' | 'downloading' | 'recognizing_faces' | 'transcribing' | 'analyzing' | 'completed' | 'failed';
  progress: number;
  isActive?: boolean;
  logs?: string[];
  metrics?: DebateMetrics;
  timeline?: TurnItem[];
  factChecks?: FactCheckItem[];
  fallacies?: FallacyItem[];
  createdAt: number;
  completedAt?: number;
}
