/**
 * Dicionário centralizado de explicações de métricas e indicadores.
 * Linguagem clara, acessível a leigos, em Português do Brasil,
 * sem menção a tecnologias ou bibliotecas subjacentes.
 */

export interface MetricExplanation {
  title: string;
  shortHint: string;
}

export const METRIC_EXPLANATIONS: Record<string, MetricExplanation> = {
  overallScore: {
    title: 'Pontuação Geral',
    shortHint:
      'Pontuação média calculada a partir de evidências comprovadas, respostas diretas, controle de voz e ausência de falácias nos debates.'
  },
  technicalAverage: {
    title: 'Média Técnica',
    shortHint:
      'Média de pontos somados pelo debatedor nas análises de conteúdo, postura e oratória.'
  },
  winRate: {
    title: 'Taxa de Vitórias',
    shortHint:
      'Percentual de debates em que o participante obteve pontuação técnica superior à dos adversários.'
  },
  matchRecord: {
    title: 'Histórico de Resultados',
    shortHint:
      'Quantidade de vitórias, empates e derrotas do debatedor nos debates analisados.'
  },
  dataDensity: {
    title: 'Densidade de Dados e Evidências',
    shortHint:
      'Frequência de dados concretos, números e fatos verificáveis apresentados para embasar os argumentos.'
  },
  emotionalControl: {
    title: 'Compostura e Controle Emocional',
    shortHint:
      'Estabilidade na fala e tom de voz equilibrado, mantendo a calma sob questionamentos difíceis ou provocações.'
  },
  directAnswerRate: {
    title: 'Taxa de Resposta Direta',
    shortHint:
      'Percentual de vezes em que o participante respondeu com objetividade ao tema perguntado, sem evasivas.'
  },
  vocabularyRichness: {
    title: 'Riqueza de Vocabulário',
    shortHint:
      'Variedade de palavras e repertório verbal empregados ao longo do debate, evitando repetições constantes.'
  },
  rebuttalRate: {
    title: 'Taxa de Refutação de Teses',
    shortHint:
      'Eficácia ao contestar e contra-argumentar os pontos centrais apresentados pelo oponente.'
  },
  speakingPace: {
    title: 'Ritmo de Fala',
    shortHint:
      'Velocidade média em palavras faladas por minuto. Um ritmo de 120 a 160 palavras/min favorece a clareza.'
  },
  fallaciesPerDebate: {
    title: 'Falácias por Debate',
    shortHint:
      'Média de argumentos enganosos ou desvios lógicos (como ataques pessoais ou fuga do assunto) por debate.'
  },
  totalFallacies: {
    title: 'Total de Falácias',
    shortHint:
      'Número total de desvios lógicos identificados em todas as falas analisadas do participante.'
  },
  factCheckAccuracy: {
    title: 'Precisão Factual',
    shortHint:
      'Percentual de afirmações checadas que se confirmaram verdadeiras com base em dados e fontes confiáveis.'
  },
  evidencePoints: {
    title: 'Evidências e Fatos Checados',
    shortHint:
      'Pontos somados para declarações verdadeiras (+5) ou discutíveis (+2), e penalidades para declarações falsas (-5).'
  },
  fallacyPenalties: {
    title: 'Penalidades por Falácias',
    shortHint:
      'Desconto na pontuação final pelo uso de falácias lógicas e recursos retóricos desleais.'
  },
  qaPoints: {
    title: 'Eficiência em Respostas Diretas',
    shortHint:
      'Pontuação obtida ao responder com clareza e de forma direta às perguntas formuladas.'
  },
  tonePoints: {
    title: 'Controle Tonal e Firmeza',
    shortHint:
      'Pontuação pela estabilidade vocal e firmeza, demonstrada pela análise de voz e postura equilibrada.'
  },
  speakingEfficiency: {
    title: 'Eficiência Temporal e Ritmo',
    shortHint:
      'Pontos conferidos pelo bom gerenciamento do tempo concedido e ritmo verbal fluído.'
  },
  audiencePoints: {
    title: 'Opinião do Público',
    shortHint:
      'Pontuação distribuída conforme a aprovação e o sentimento manifestado pelo público nos comentários do debate.'
  },
  totalScore: {
    title: 'Total Consolidado',
    shortHint:
      'Soma de todos os critérios técnicos (fatos, falácias, respostas, tom e tempo) somados à pontuação do público.'
  }
};
