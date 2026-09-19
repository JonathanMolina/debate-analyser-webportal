import { supabase, isSupabaseConfigured } from '@/app/supabase/client';
import type { Debater, DebaterAggregateStats, DebaterDebateHistoryItem } from '../types/debater.types';
import { MOCK_DEBATERS, MOCK_AGGREGATE_STATS } from '@/features/mock/mockPortalData';
import { fetchDebatesList } from '@/features/debates/api/debatesApi';

export const fetchDebatersList = async (): Promise<Debater[]> => {
  let dbDebaters: Debater[] = [];

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('debaters')
        .select('*')
        .order('name', { ascending: true });

      if (!error && data && data.length > 0) {
        dbDebaters = data.map((d: {
          id: string;
          name: string;
          photo_url?: string;
          photo_storage_path?: string;
          created_at: string;
          updated_at: string;
        }) => ({
          id: d.id,
          name: d.name,
          photoUrl: d.photo_url,
          photoStoragePath: d.photo_storage_path,
          createdAt: new Date(d.created_at).getTime(),
          updatedAt: new Date(d.updated_at).getTime()
        }));
      }
    } catch {
      // Degradação silenciosa
    }
  }

  const map = new Map<string, Debater>();
  for (const m of MOCK_DEBATERS) {
    map.set(m.id, m);
  }
  for (const d of dbDebaters) {
    map.set(d.id, { ...map.get(d.id), ...d });
  }

  return Array.from(map.values());
};

export const fetchDebaterStats = async (): Promise<DebaterAggregateStats[]> => {
  const [debaters, debates] = await Promise.all([
    fetchDebatersList(),
    fetchDebatesList()
  ]);

  // Map of debater statistics
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

  // Initialize with known debaters
  for (const deb of debaters) {
    statsMap.set(deb.name.toLowerCase(), {
      debaterId: deb.id,
      debaterName: deb.name,
      photoUrl: deb.photoUrl,
      role: deb.role,
      party: deb.party,
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

  // Iterate over completed debates to aggregate real metrics
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
          photoUrl: spk.previewUrl,
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

  // Convert to output list
  const results: DebaterAggregateStats[] = [];

  for (const [, item] of statsMap.entries()) {
    // If not in debate jobs, check if we have predefined mock stats
    const fallbackMock = MOCK_AGGREGATE_STATS.find(
      (m) => m.debaterName.toLowerCase() === item.debaterName.toLowerCase()
    );

    if (item.debatesCount === 0 && fallbackMock) {
      results.push(fallbackMock);
      continue;
    }

    const winRate = item.debatesCount > 0 ? Math.round((item.wins / item.debatesCount) * 100) : (fallbackMock?.winRate ?? 50);
    const factCheckAccuracy = item.totalFactChecks > 0 ? Math.round((item.trueFactChecks / item.totalFactChecks) * 100) : (fallbackMock?.factCheckAccuracy ?? 85);

    results.push({
      debaterId: item.debaterId,
      debaterName: item.debaterName,
      photoUrl: item.photoUrl || fallbackMock?.photoUrl,
      role: item.role || fallbackMock?.role,
      party: item.party || fallbackMock?.party,
      debatesCount: item.debatesCount || (fallbackMock?.debatesCount ?? 1),
      wins: item.wins,
      draws: item.draws,
      losses: item.losses,
      winRate,
      avgScore: average(item.scores, fallbackMock?.avgScore ?? 100),
      avgSpeakingTimeSeconds: average(item.speakingTimes, fallbackMock?.avgSpeakingTimeSeconds ?? 600),
      avgWordsPerMinute: average(item.wpms, fallbackMock?.avgWordsPerMinute ?? 140),
      avgVocabularyRichness: average(item.vocabularies, fallbackMock?.avgVocabularyRichness ?? 75),
      avgDataDensity: average(item.dataDensities, fallbackMock?.avgDataDensity ?? 65),
      avgEmotionalControl: average(item.emotionalControls, fallbackMock?.avgEmotionalControl ?? 75),
      avgAssertiveness: average(item.assertivenessList, fallbackMock?.avgAssertiveness ?? 75),
      avgVocalStability: average(item.vocalStabilities, fallbackMock?.avgVocalStability ?? 75),
      avgDirectAnswerRate: average(item.directAnswerRates, fallbackMock?.avgDirectAnswerRate ?? 80),
      avgRebuttalScore: average(item.rebuttalScores, fallbackMock?.avgRebuttalScore ?? 75),
      totalFallacies: item.totalFallacies,
      avgFallaciesPerDebate: item.debatesCount > 0 ? parseFloat((item.totalFallacies / item.debatesCount).toFixed(2)) : (fallbackMock?.avgFallaciesPerDebate ?? 0.5),
      totalFactChecks: item.totalFactChecks,
      factCheckAccuracy,
      recentDebates: item.recentDebates.sort((a, b) => b.date - a.date)
    });
  }

  return results;
};
