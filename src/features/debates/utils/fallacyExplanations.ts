/**
 * Dicionário e resolvedor de explicações de tipos de falácias retóricas.
 * Linguagem clara e didática, acessível a usuários comuns.
 */

export interface FallacyExplanation {
  title: string;
  explanation: string;
}

export const FALLACY_EXPLANATIONS: Record<string, FallacyExplanation> = {
  'ad hominem': {
    title: 'Falácia Ad Hominem (Ataque Pessoal)',
    explanation:
      'Ataca o caráter, a moral ou a vida pessoal do adversário em vez de refutar o argumento ou os dados apresentados.'
  },
  'tu quoque': {
    title: 'Falácia Tu Quoque ("Você Também")',
    explanation:
      'Tenta desacreditar o adversário acusando-o de ter cometido a mesma falha ("mas você também fez isso!"), fugindo da resposta.'
  },
  'tu quoque / ad hominem': {
    title: 'Tu Quoque / Ad Hominem',
    explanation:
      'Combina o ataque pessoal com a acusação de "você também fez o mesmo", desviando o debate da questão central.'
  },
  'espantalho': {
    title: 'Falácia do Espantalho',
    explanation:
      'Distorce, exagera ou caricatura a fala do oponente para atacar uma ideia distorcida que ele na verdade nunca defendeu.'
  },
  'falsa dicotomia': {
    title: 'Falsa Dicotomia (Falso Dilema)',
    explanation:
      'Apresenta apenas dois extremos como se fossem as únicas opções existentes, ignorando alternativas reais e nuances.'
  },
  'falso dilema': {
    title: 'Falso Dilema (Falsa Dicotomia)',
    explanation:
      'Reduz uma questão complexa a apenas dois caminhos opostos, escondendo soluções intermediárias possíveis.'
  },
  'generalizacao apressada': {
    title: 'Generalização Apressada',
    explanation:
      'Tira uma conclusão ampla e definitiva sobre tudo ou todos com base em poucos exemplos isolados ou dados insuficientes.'
  },
  'apelo a emocao': {
    title: 'Apelo à Emoção (Ad Passiones)',
    explanation:
      'Usa apelos de medo, pena, raiva ou sentimentalismo excessivo para convencer a audiência, em vez de apresentar fatos lógicos.'
  },
  'declive escorregadio': {
    title: 'Declive Escorregadio (Bola de Neve)',
    explanation:
      'Afirma sem provas que uma pequena ação inicial levará inevitavelmente a uma sequência catastrófica e extrema de desastres.'
  },
  'apelo a autoridade': {
    title: 'Apelo à Autoridade (Ad Verecundiam)',
    explanation:
      'Cita uma autoridade fora de sua área de especialidade ou fora de contexto para impor uma verdade sem demonstrá-la.'
  },
  'peticao de principio': {
    title: 'Petição de Princípio (Raciocínio Circular)',
    explanation:
      'Assume como comprovada a própria premissa que se queria provar, andando em círculos sem trazer provas reais.'
  },
  'falsa causa': {
    title: 'Falsa Causa (Post Hoc)',
    explanation:
      'Afirma que, porque um fato aconteceu após outro, o primeiro necessariamente causou o segundo.'
  },
  'apelo a popularidade': {
    title: 'Apelo à Popularidade (Ad Populum)',
    explanation:
      'Sustenta que uma afirmação é verdadeira unicamente porque muitas pessoas acreditam ou concordam com ela.'
  },
  'inversao do onus da prova': {
    title: 'Inversão do Ônus da Prova',
    explanation:
      'Exige que o adversário prove que algo não é verdade, em vez de quem fez a acusação apresentar as provas devidas.'
  },
  'falsa equivalencia': {
    title: 'Falsa Equivalência',
    explanation:
      'Compara duas situações com contextos, proporções ou gravidades totalmente diferentes como se fossem equivalentes.'
  },
  'fuga do tema': {
    title: 'Fuga do Tema (Red Herring)',
    explanation:
      'Introduz uma distração ou assunto irrelevante para desviar a atenção de um ponto embaraçoso ou difícil de responder.'
  }
};

const normalizeKey = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
};

export const getFallacyExplanation = (rawType: string): FallacyExplanation => {
  if (!rawType) {
    return {
      title: 'Falácia Retórica',
      explanation: 'Desvio da lógica argumentativa identificado na fala.'
    };
  }

  const normalized = normalizeKey(rawType);

  // Busca correspondência exata
  if (FALLACY_EXPLANATIONS[normalized]) {
    return FALLACY_EXPLANATIONS[normalized];
  }

  // Busca por termos compostos
  if (normalized.includes('tu quoque') && normalized.includes('ad hominem')) {
    return FALLACY_EXPLANATIONS['tu quoque / ad hominem'];
  }
  if (normalized.includes('tu quoque')) {
    return FALLACY_EXPLANATIONS['tu quoque'];
  }
  if (normalized.includes('ad hominem')) {
    return FALLACY_EXPLANATIONS['ad hominem'];
  }
  if (normalized.includes('espantalho')) {
    return FALLACY_EXPLANATIONS['espantalho'];
  }
  if (normalized.includes('dicotomia') || normalized.includes('dilema')) {
    return FALLACY_EXPLANATIONS['falsa dicotomia'];
  }
  if (normalized.includes('generalizacao')) {
    return FALLACY_EXPLANATIONS['generalizacao apressada'];
  }
  if (normalized.includes('emocao')) {
    return FALLACY_EXPLANATIONS['apelo a emocao'];
  }
  if (normalized.includes('autoridade')) {
    return FALLACY_EXPLANATIONS['apelo a autoridade'];
  }
  if (normalized.includes('declive') || normalized.includes('escorregadio')) {
    return FALLACY_EXPLANATIONS['declive escorregadio'];
  }
  if (normalized.includes('equivalencia')) {
    return FALLACY_EXPLANATIONS['falsa equivalencia'];
  }

  // Fallback seguro e didático
  return {
    title: `Falácia: ${rawType}`,
    explanation:
      'Desvio da lógica argumentativa que enfraquece a validade técnica do raciocínio durante o debate.'
  };
};
