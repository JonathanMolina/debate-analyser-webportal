import { supabase, isSupabaseConfigured } from '@/app/supabase/client';
import type { Debater, DebaterAggregateStats, DebaterDebateHistoryItem } from '../types/debater.types';
import { fetchDebatesList } from '@/features/debates/api/debatesApi';
import { MOCK_DEBATERS } from '@/features/mock/mockPortalData';
import { resolveDebaterPhotoUrl, registerDebatersBatch } from '@/components/DebaterAvatar';

export const fetchDebatersList = async (): Promise<Debater[]> => {
  if (!isSupabaseConfigured) {
    registerDebatersBatch(MOCK_DEBATERS);
    return MOCK_DEBATERS;
  }

  try {
    const { data, error } = await supabase
      .from('debaters')
      .select('*')
      .order('name', { ascending: true });

    if (error || !data) {
      return [];
    }

    const mapped = data.map((d: {
      id: string;
      name: string;
      photo_url?: string;
      photo_storage_path?: string;
      reference_audio?: unknown;
      created_at: string;
      updated_at: string;
    }) => ({
      id: d.id,
      name: d.name,
      photoUrl: resolveDebaterPhotoUrl(d.photo_url || d.photo_storage_path, d.name, d.id),
      photoStoragePath: d.photo_storage_path,
      createdAt: new Date(d.created_at).getTime(),
      updatedAt: new Date(d.updated_at).getTime()
    }));

    registerDebatersBatch(mapped);
    return mapped;
  } catch {
    return [];
  }
};

export const fetchDebaterStats = async (): Promise<DebaterAggregateStats[]> => {
  const [debaters, debates] = await Promise.all([
    fetchDebatersList(),
    fetchDebatesList()
  ]);

  if (debaters.length === 0 && debates.length === 0) {
    return [];
  }

  // Mapa de estatísticas reais
  const statsMap = new Map<string, {
    debaterId: string;
    debaterName: string;
    photoUrl?: string;
    role?: string;
    party?: string;
    debatesCount: number;
    wins: number;
    draws: number;
    losses: number;
    scores: number[];
    speakingTimes: number[];
    wpms: number[];
    vocabularies: number[];
    dataDensities: number[];
    emotionalControls: number[];
    assertivenessList: number[];
    vocalStabilities: number[];
    directAnswerRates: number[];
    rebuttalScores: number[];
    totalFallacies: number;
    totalFactChecks: number;
    trueFactChecks: number;
    recentDebates: DebaterDebateHistoryItem[];
  }>();

  // Inicializar com debatedores registrados
  for (const deb of debaters) {
    statsMap.set(deb.name.toLowerCase(), {
      debaterId: deb.id,
      debaterName: deb.name,
      photoUrl: resolveDebaterPhotoUrl(deb.photoUrl, deb.name, deb.id),
      debatesCount: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      scores: [],
      speakingTimes: [],
      wpms: [],
      vocabularies: [],
      dataDensities: [],
      emotionalControls: [],
      assertivenessList: [],
      vocalStabilities: [],
      directAnswerRates: [],
      rebuttalScores: [],
      totalFallacies: 0,
      totalFactChecks: 0,
      trueFactChecks: 0,
      recentDebates: []
    });
  }

  // Iterar pelos debates reais
  for (const debate of debates) {
    const scores = debate.metrics?.debateScore?.scores || {};
    const winner = debate.metrics?.debateScore?.winner;
    const isDraw = Boolean(debate.metrics?.debateScore?.isDraw);

    for (const spk of debate.speakers) {
      const key = spk.name.toLowerCase();
      let current = statsMap.get(key);

      if (!current) {
        current = {
          debaterId: spk.debaterId || `deb_${key.replace(/\s+/g, '_')}`,
          debaterName: spk.name,
          photoUrl: resolveDebaterPhotoUrl(spk.previewUrl, spk.name, spk.debaterId),
          debatesCount: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          scores: [],
          speakingTimes: [],
          wpms: [],
          vocabularies: [],
          dataDensities: [],
          emotionalControls: [],
          assertivenessList: [],
          vocalStabilities: [],
          directAnswerRates: [],
          rebuttalScores: [],
          totalFallacies: 0,
          totalFactChecks: 0,
          trueFactChecks: 0,
          recentDebates: []
        };
        statsMap.set(key, current);
      } else if (!current.photoUrl && spk.previewUrl) {
        current.photoUrl = resolveDebaterPhotoUrl(spk.previewUrl, spk.name, spk.debaterId);
      }

      current.debatesCount += 1;
      const spkScore = scores[spk.name] ?? 100;
      current.scores.push(spkScore);

      let result: 'win' | 'loss' | 'draw' = 'draw';
      if (isDraw) {
        current.draws += 1;
      } else if (winner === spk.name) {
        current.wins += 1;
        result = 'win';
      } else if (winner) {
        current.losses += 1;
        result = 'loss';
      } else {
        current.draws += 1;
      }

      const spkTime = debate.metrics?.speakingTime?.[spk.name] ?? 0;
      current.speakingTimes.push(spkTime);

      const ling = debate.metrics?.linguisticMetrics?.[spk.name];
      if (ling) {
        current.wpms.push(ling.wordsPerMinute);
        current.vocabularies.push(ling.vocabularyRichness);
        current.dataDensities.push(ling.dataDensity);
      }

      const tone = debate.metrics?.toneMetrics?.[spk.name];
      if (tone) {
        current.emotionalControls.push(tone.emotionalControl);
        current.assertivenessList.push(tone.assertiveness);
        current.vocalStabilities.push(tone.vocalStability);
      }

      const qa = debate.metrics?.qaMetrics?.[spk.name];
      if (qa) {
        current.directAnswerRates.push(qa.directAnswerRate);
      }

      const content = debate.metrics?.contentMetrics?.[spk.name];
      if (content) {
        current.rebuttalScores.push(content.rebuttalScore);
      }

      const fallacies = debate.fallacies?.filter((f) => f.speaker === spk.name).length ?? (debate.metrics?.fallaciesCount?.[spk.name] ?? 0);
      current.totalFallacies += fallacies;

      const facts = debate.factChecks?.filter((fc) => fc.speaker === spk.name) || [];
      current.totalFactChecks += facts.length;
      current.trueFactChecks += facts.filter((fc) => fc.verdict === 'Verdadeiro').length;

      const opponents = debate.speakers.filter((s) => s.name !== spk.name).map((s) => s.name);
      current.recentDebates.push({
        jobId: debate.id,
        debateTitle: debate.title,
        date: debate.createdAt,
        opponentNames: opponents,
        score: spkScore,
        result,
        difference: debate.metrics?.debateScore?.difference || 0,
        speakingTimeSeconds: spkTime,
        fallaciesCount: fallacies
      });
    }
  }

  const average = (arr: number[], def = 0): number =>
    arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : def;

  const results: DebaterAggregateStats[] = [];

  for (const [, item] of statsMap.entries()) {
    const winRate = item.debatesCount > 0 ? Math.round((item.wins / item.debatesCount) * 100) : 0;
    const factCheckAccuracy = item.totalFactChecks > 0 ? Math.round((item.trueFactChecks / item.totalFactChecks) * 100) : 0;

    results.push({
      debaterId: item.debaterId,
      debaterName: item.debaterName,
      photoUrl: item.photoUrl,
      role: item.role,
      party: item.party,
      debatesCount: item.debatesCount,
      wins: item.wins,
      draws: item.draws,
      losses: item.losses,
      winRate,
      avgScore: average(item.scores, 0),
      avgSpeakingTimeSeconds: average(item.speakingTimes, 0),
      avgWordsPerMinute: average(item.wpms, 0),
      avgVocabularyRichness: average(item.vocabularies, 0),
      avgDataDensity: average(item.dataDensities, 0),
      avgEmotionalControl: average(item.emotionalControls, 0),
      avgAssertiveness: average(item.assertivenessList, 0),
      avgVocalStability: average(item.vocalStabilities, 0),
      avgDirectAnswerRate: average(item.directAnswerRates, 0),
      avgRebuttalScore: average(item.rebuttalScores, 0),
      totalFallacies: item.totalFallacies,
      avgFallaciesPerDebate: item.debatesCount > 0 ? parseFloat((item.totalFallacies / item.debatesCount).toFixed(2)) : 0,
      totalFactChecks: item.totalFactChecks,
      factCheckAccuracy,
      recentDebates: item.recentDebates.sort((a, b) => b.date - a.date)
    });
  }

  return results;
};
