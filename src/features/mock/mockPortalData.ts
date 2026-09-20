import type { DebateJob } from '@/features/debates/types/debate.types';
import type { Debater, DebaterAggregateStats } from '@/features/debaters/types/debater.types';

export const MOCK_DEBATERS: Debater[] = [
  {
    id: 'deb_tallis_gomes',
    name: 'Tallis Gomes',
    bio: 'Empreendedor, fundador do Easy Taxi e G4 Educação. Focado em gestão, produtividade e métricas de mercado.',
    role: 'Empreendedor & Autor',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now()
  },
  {
    id: 'deb_brigadeiro',
    name: 'Paulo Brigadeiro',
    bio: 'Analista de dados, articulista e debatedor independente com foco em finanças corporativas e dialética.',
    role: 'Analista & Crítico',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    createdAt: Date.now() - 86400000 * 28,
    updatedAt: Date.now()
  },
  {
    id: 'deb_ciro_gomes',
    name: 'Ciro Gomes',
    bio: 'Ex-ministro da Fazenda e da Integração Nacional, ex-governador do Ceará e autor de obras sobre desenvolvimento.',
    role: 'Líder Político & Economista',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    createdAt: Date.now() - 86400000 * 25,
    updatedAt: Date.now()
  },
  {
    id: 'deb_tabata_amaral',
    name: 'Tabata Amaral',
    bio: 'Cientista política e astrofísica formada por Harvard, deputada federal com foco em educação e gestão pública.',
    role: 'Deputada Federal',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now()
  },
  {
    id: 'deb_guilherme_boulos',
    name: 'Guilherme Boulos',
    bio: 'Professor, filósofo e ativista social, deputado federal pelo estado de São Paulo.',
    role: 'Deputado Federal & Professor',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    createdAt: Date.now() - 86400000 * 18,
    updatedAt: Date.now()
  },
  {
    id: 'deb_marina_silva',
    name: 'Marina Silva',
    bio: 'Historiadora, ambientalista e ministra do Meio Ambiente e Mudança do Clima do Brasil.',
    role: 'Ministra & Ambientalista',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    createdAt: Date.now() - 86400000 * 15,
    updatedAt: Date.now()
  }
];

export const MOCK_DEBATES: DebateJob[] = [
  {
    id: 'job_tallis_vs_brigadeiro_2026',
    title: 'Duelo de Gestão vs Pragmatismo: Tallis Gomes vs Paulo Brigadeiro',
    description: 'Análise técnica da discussão sobre scale-ups, rentabilidade operacional e governança corporativa no Brasil.',
    youtubeUrl: 'https://www.youtube.com/watch?v=zIwRCVd6-v8',
    youtubeId: 'zIwRCVd6-v8',
    thumbnailUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80',
    durationSeconds: 1240,
    category: 'Negócios & Gestão',
    speakers: [
      {
        name: 'Tallis Gomes',
        debaterId: 'deb_tallis_gomes',
        previewUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
      },
      {
        name: 'Paulo Brigadeiro',
        debaterId: 'deb_brigadeiro',
        previewUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'
      }
    ],
    status: 'completed',
    progress: 100,
    metrics: {
      speakingTime: {
        'Tallis Gomes': 580,
        'Paulo Brigadeiro': 620
      },
      interruptions: {
        'Tallis Gomes': 3,
        'Paulo Brigadeiro': 4
      },
      fallaciesCount: {
        'Tallis Gomes': 2,
        'Paulo Brigadeiro': 1
      },
      averageTemperature: 0.42,
      linguisticMetrics: {
        'Tallis Gomes': {
          wordsPerMinute: 148.5,
          vocabularyRichness: 76.2,
          formality: 71.0,
          dataDensity: 68.4,
          totalWords: 1432
        },
        'Paulo Brigadeiro': {
          wordsPerMinute: 132.8,
          vocabularyRichness: 82.5,
          formality: 79.4,
          dataDensity: 74.2,
          totalWords: 1370
        }
      },
      toneMetrics: {
        'Tallis Gomes': {
          averageTemperature: 0.45,
          emotionalControl: 74.0,
          assertiveness: 82.5,
          vocalStability: 78.0
        },
        'Paulo Brigadeiro': {
          averageTemperature: 0.41,
          emotionalControl: 81.0,
          assertiveness: 76.0,
          vocalStability: 84.5
        }
      },
      qaMetrics: {
        'Tallis Gomes': {
          questionsAsked: 4,
          questionsAnswered: 5,
          evasiveAnswers: 1,
          directAnswerRate: 80.0
        },
        'Paulo Brigadeiro': {
          questionsAsked: 5,
          questionsAnswered: 4,
          evasiveAnswers: 0,
          directAnswerRate: 88.0
        }
      },
      contentMetrics: {
        'Tallis Gomes': {
          rebuttalScore: 78.5,
          argumentStructureDensity: 74.0,
          topicAdherence: 86.0,
          framingIndex: 68.0,
          netFactuality: 80.0,
          fallacyDensity: 2.06
        },
        'Paulo Brigadeiro': {
          rebuttalScore: 89.0,
          argumentStructureDensity: 83.5,
          topicAdherence: 89.0,
          framingIndex: 72.0,
          netFactuality: 88.0,
          fallacyDensity: 0.96
        }
      },
      audienceMetrics: {
        totalCommentsAnalyzed: 1420,
        favoredWinner: 'Paulo Brigadeiro',
        winnerAgreementWithAlgorithm: true,
        publicVerdictSummary: 'A comunidade de espectadores expressou preferência contundente por abordagens amparadas em matemática financeira e demonstrativos auditáveis. Paulo Brigadeiro foi aclamado pela calma analítica e por desconstruir teses de crescimento desmedido, enquanto Tallis Gomes recebeu elogios pela energia e experiência prática de tração, mas perdeu apoio ao recorrer a argumentos de autoridade e menosprezar fundamentos contábeis em um cenário macroeconômico de juros elevados.',
        speakersFeedback: {
          'Paulo Brigadeiro': {
            speakerName: 'Paulo Brigadeiro',
            approvalPercentage: 67,
            supportCount: 951,
            keyReasons: [
              'Desmistificou o jargão de startups com matemática financeira básica e demonstrativos da CVM.',
              'Manteve a compostura serena perante provocações e interrupções frequentes.',
              'Argumentou com precisão sobre o risco de queima descontrolada de caixa com Selic a dois dígitos.',
              'Refutou com clareza a confusão entre valuation inflado em rodada privada e lucro líquido operacional real.'
            ]
          },
          'Tallis Gomes': {
            speakerName: 'Tallis Gomes',
            approvalPercentage: 33,
            supportCount: 469,
            keyReasons: [
              'Autoridade e vivência genuína de quem fundou e escalou negócios no Brasil a partir do zero.',
              'Forte ênfase na coragem operacional, velocidade de execução e mentalidade comercial de guerra.',
              'Defesa legítima da necessidade de correr riscos calculados para competir internacionalmente.'
            ]
          }
        },
        topComments: [
          {
            id: 'ytc_1',
            author: '@marcos.financas.reais',
            text: 'O Brigadeiro não debateu, ele deu uma consultoria gratuita de finanças corporativas ao vivo. A cara do Tallis quando ouviu falar de margem de contribuição real e queima de caixa foi impagável.',
            likes: 4820,
            publishedAt: 'há 2 dias',
            favoredSpeaker: 'Paulo Brigadeiro',
            sentiment: 'positive'
          },
          {
            id: 'ytc_2',
            author: '@lucas_investimentos',
            text: 'Tallis tem o mérito incontestável de ter construído a Easy Taxi, mas debate técnico não se ganha no grito de "eu fiz e você não". Faltaram dados contábeis sólidos para sustentar a tese dele.',
            likes: 3650,
            publishedAt: 'há 2 dias',
            favoredSpeaker: 'Paulo Brigadeiro',
            sentiment: 'positive'
          },
          {
            id: 'ytc_3',
            author: '@rodrigo_startups_br',
            text: 'O Tallis trouxe a perspectiva da trincheira, de quem vive o risco na pele todos os dias. É muito fácil quem nunca assinou uma folha de pagamento com 500 funcionários vir dar aula de teoria e livro acadêmico.',
            likes: 2910,
            publishedAt: 'há 2 dias',
            favoredSpeaker: 'Tallis Gomes',
            sentiment: 'positive'
          },
          {
            id: 'ytc_4',
            author: '@analise_macro_cvm',
            text: 'Brigadeiro foi cirúrgico: mostrou que valuation em rodada privada não é lucro líquido no bolso. Essa cultura de queimar caixa no Brasil sem unit economics sustentável quebrou centenas de empresas.',
            likes: 2430,
            publishedAt: 'há 2 dias',
            favoredSpeaker: 'Paulo Brigadeiro',
            sentiment: 'positive'
          },
          {
            id: 'ytc_5',
            author: '@fernanda_venturecapital',
            text: 'O que mais me impressionou foi a serenidade do Brigadeiro. Quanto mais o Tallis subia a temperatura e tentava interromper, mais o Paulo respondia com frieza analítica e números frios.',
            likes: 1980,
            publishedAt: 'há 1 dia',
            favoredSpeaker: 'Paulo Brigadeiro',
            sentiment: 'positive'
          },
          {
            id: 'ytc_6',
            author: '@carlos_gestao_pro',
            text: 'Debate de altíssimo nível! Tallis defende a mentalidade do operador e a velocidade de tração inicial, enquanto o Brigadeiro defende a governança do capital e o retorno do investidor. Aula dos dois.',
            likes: 1540,
            publishedAt: 'há 1 dia',
            favoredSpeaker: 'Neutro',
            sentiment: 'neutral'
          },
          {
            id: 'ytc_7',
            author: '@juliana_cfo',
            text: 'Tallis é um monstro nas vendas e execução, ninguém tira o pioneirismo dele. Mas quando o papo foi alocação de capital e disciplina orçamentária, o Brigadeiro dominou a mesa.',
            likes: 1220,
            publishedAt: 'há 1 dia',
            favoredSpeaker: 'Paulo Brigadeiro',
            sentiment: 'positive'
          },
          {
            id: 'ytc_8',
            author: '@gabriel_growth',
            text: 'Sensacional o ponto do Tallis sobre timing de mercado. Se uma startup esperar atingir lucro líquido logo no ano um em um setor concorrido, ela é atropelada pela concorrência global e desaparece.',
            likes: 980,
            publishedAt: 'há 1 dia',
            favoredSpeaker: 'Tallis Gomes',
            sentiment: 'positive'
          },
          {
            id: 'ytc_9',
            author: '@diego_mercado',
            text: 'Brigadeiro colocou o dedo na ferida da Faria Lima: muitas empresas são apenas esquemas de transferência de riqueza para fundos de venture capital antes do colapso no mercado público.',
            likes: 850,
            publishedAt: 'há 1 dia',
            favoredSpeaker: 'Paulo Brigadeiro',
            sentiment: 'positive'
          },
          {
            id: 'ytc_10',
            author: '@renato_tech_founder',
            text: 'Acho que faltou ao Brigadeiro entender as dores práticas de quem monta um negócio no Brasil. O Tallis pode ter exagerado na postura agressiva, mas a energia dele reflete a realidade da sobrevivência de qualquer empresa.',
            likes: 730,
            publishedAt: 'há 20 horas',
            favoredSpeaker: 'Tallis Gomes',
            sentiment: 'positive'
          },
          {
            id: 'ytc_11',
            author: '@felipe_auditoria',
            text: 'O melhor momento do debate foi aos 24:10 quando o Brigadeiro cobrou o retorno sobre patrimônio líquido (ROE) das principais scale-ups brasileiras e só recebeu silêncio em resposta.',
            likes: 620,
            publishedAt: 'há 18 horas',
            favoredSpeaker: 'Paulo Brigadeiro',
            sentiment: 'positive'
          },
          {
            id: 'ytc_12',
            author: '@beatriz_economia',
            text: 'A prepotência custou caro para o Tallis aqui. Ter humildade para reconhecer que o cenário macroeconômico mudou e juros a 13% matam empresas sem caixa teria preservado a autoridade dele.',
            likes: 540,
            publishedAt: 'há 15 horas',
            favoredSpeaker: 'Paulo Brigadeiro',
            sentiment: 'positive'
          },
          {
            id: 'ytc_13',
            author: '@andre_brasil_negocios',
            text: 'Tallis Gomes falou a linguagem do empresário brasileiro sufocado pela burocracia estatal. O Brigadeiro falou a linguagem limpinha do acadêmico que nunca lidou com fiscal da Receita.',
            likes: 480,
            publishedAt: 'há 12 horas',
            favoredSpeaker: 'Tallis Gomes',
            sentiment: 'positive'
          },
          {
            id: 'ytc_14',
            author: '@tiago_consultor',
            text: 'O Paulo Brigadeiro venceu com folga pela consistência técnica, mas foi o melhor embate público de ideias que o YouTube Brasil produziu nos últimos anos.',
            likes: 430,
            publishedAt: 'há 10 horas',
            favoredSpeaker: 'Neutro',
            sentiment: 'neutral'
          },
          {
            id: 'ytc_15',
            author: '@danilo_wealth',
            text: 'Regra de ouro: se você quer aprender sobre tração e marketing agressivo, estude o Tallis. Se quer proteger seu patrimônio financeiro e evitar a quebra, estude o Brigadeiro.',
            likes: 410,
            publishedAt: 'há 8 horas',
            favoredSpeaker: 'Paulo Brigadeiro',
            sentiment: 'positive'
          }
        ]
      },
      debateScore: {
        scores: {
          'Tallis Gomes': 128,
          'Paulo Brigadeiro': 146
        },
        winner: 'Paulo Brigadeiro',
        difference: 18,
        isDraw: false,
        breakdown: {
          'Tallis Gomes': {
            evidencePoints: 24,
            fallacyPenalties: -10,
            qaPoints: 22,
            tonePoints: 25,
            speakingEfficiency: 28,
            audiencePoints: 10,
            totalPoints: 128
          },
          'Paulo Brigadeiro': {
            evidencePoints: 32,
            fallacyPenalties: -5,
            qaPoints: 26,
            tonePoints: 28,
            speakingEfficiency: 29,
            audiencePoints: 20,
            totalPoints: 146
          }
        }
      }
    },
    timeline: [
      {
        speaker: 'Tallis Gomes',
        start: 12,
        end: 78,
        text: 'O crescimento acelerado de uma startup exige margens brutas acima de 60% logo nos primeiros 24 meses.',
        temperature: 0.35,
        confidence: 0.98
      },
      {
        speaker: 'Paulo Brigadeiro',
        start: 80,
        end: 145,
        text: 'A literatura financeira e os relatórios da CVM mostram que queimar caixa com margens ilusórias destrói valor no médio prazo.',
        temperature: 0.40,
        confidence: 0.99
      },
      {
        speaker: 'Tallis Gomes',
        start: 148,
        end: 210,
        text: 'Quem não arrisca capital em tração inicial nunca atinge economia de escala para competir globalmente.',
        temperature: 0.48,
        confidence: 0.95
      },
      {
        speaker: 'Paulo Brigadeiro',
        start: 212,
        end: 280,
        text: 'Escala sem unit economics sustentável não é pioneirismo, é mera transferência ineficiente de capital de risco.',
        temperature: 0.42,
        confidence: 0.97
      }
    ],
    factChecks: [
      {
        id: 'fc_1',
        timestamp: 45,
        speaker: 'Tallis Gomes',
        claim: 'Mais de 80% dos unicórnios brasileiros atingiram breakeven nos últimos 3 anos.',
        verdict: 'Falso',
        evidence: 'Dados da Associação Brasileira de Startups e Crunchbase registram que menos de 28% atingiram lucratividade líquida no triênio.',
        sources: ['Crunchbase Latin America Tech Report 2024', 'ABStartups']
      },
      {
        id: 'fc_2',
        timestamp: 92,
        speaker: 'Paulo Brigadeiro',
        claim: 'O custo de capital de dívida corporativa superou 14% ao ano na média do biênio 2023-2024.',
        verdict: 'Verdadeiro',
        evidence: 'Confirmado pela curva de DI futuro e emissões primárias de debêntures registradas na Anbima.',
        sources: ['Anbima - Estatísticas do Mercado de Capitais', 'Banco Central do Brasil']
      },
      {
        id: 'fc_3',
        timestamp: 165,
        speaker: 'Tallis Gomes',
        claim: 'Investimentos em venture capital nos EUA quadruplicaram entre 2018 e 2021.',
        verdict: 'Verdadeiro',
        evidence: 'O volume anual passou de $140B em 2018 para cerca de $345B no pico histórico de 2021 (NVCA/PitchBook).',
        sources: ['NVCA PitchBook Venture Monitor']
      }
    ],
    fallacies: [
      {
        id: 'fal_1',
        timestamp: 180,
        speaker: 'Tallis Gomes',
        type: 'Falsa Dicotomia',
        quote: 'Ou você queima caixa agressivamente para ser líder, ou sua empresa morre antes do terceiro ano.'
      },
      {
        id: 'fal_2',
        timestamp: 240,
        speaker: 'Paulo Brigadeiro',
        type: 'Generalização Apressada',
        quote: 'Todo modelo que prioriza crescimento em detrimento de EBITDA positivo é fadado à falência.'
      }
    ],
    createdAt: Date.now() - 86400000 * 3,
    completedAt: Date.now() - 86400000 * 3 + 3600000
  },
  {
    id: 'job_ciro_vs_tabata_reforma',
    title: 'Visões de Reforma Tributária e Educação: Ciro Gomes vs Tabata Amaral',
    description: 'Debate analítico sobre incentivos fiscais, distribuição de tributos indiretos e financiamento de escolas técnicas.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&auto=format&fit=crop&q=80',
    durationSeconds: 1580,
    category: 'Economia & Políticas Públicas',
    speakers: [
      {
        name: 'Ciro Gomes',
        debaterId: 'deb_ciro_gomes',
        previewUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80'
      },
      {
        name: 'Tabata Amaral',
        debaterId: 'deb_tabata_amaral',
        previewUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
      }
    ],
    status: 'completed',
    progress: 100,
    metrics: {
      speakingTime: {
        'Ciro Gomes': 720,
        'Tabata Amaral': 705
      },
      interruptions: {
        'Ciro Gomes': 5,
        'Tabata Amaral': 2
      },
      fallaciesCount: {
        'Ciro Gomes': 1,
        'Tabata Amaral': 0
      },
      averageTemperature: 0.38,
      linguisticMetrics: {
        'Ciro Gomes': {
          wordsPerMinute: 156.0,
          vocabularyRichness: 86.4,
          formality: 84.0,
          dataDensity: 82.1,
          totalWords: 1872
        },
        'Tabata Amaral': {
          wordsPerMinute: 142.5,
          vocabularyRichness: 84.0,
          formality: 85.2,
          dataDensity: 85.0,
          totalWords: 1674
        }
      },
      toneMetrics: {
        'Ciro Gomes': {
          averageTemperature: 0.44,
          emotionalControl: 76.0,
          assertiveness: 88.0,
          vocalStability: 80.0
        },
        'Tabata Amaral': {
          averageTemperature: 0.36,
          emotionalControl: 87.0,
          assertiveness: 81.0,
          vocalStability: 89.0
        }
      },
      qaMetrics: {
        'Ciro Gomes': {
          questionsAsked: 6,
          questionsAnswered: 5,
          evasiveAnswers: 0,
          directAnswerRate: 85.0
        },
        'Tabata Amaral': {
          questionsAsked: 5,
          questionsAnswered: 6,
          evasiveAnswers: 0,
          directAnswerRate: 91.0
        }
      },
      contentMetrics: {
        'Ciro Gomes': {
          rebuttalScore: 84.0,
          argumentStructureDensity: 87.0,
          topicAdherence: 88.0,
          framingIndex: 78.0,
          netFactuality: 86.0,
          fallacyDensity: 0.83
        },
        'Tabata Amaral': {
          rebuttalScore: 86.0,
          argumentStructureDensity: 89.0,
          topicAdherence: 92.0,
          framingIndex: 74.0,
          netFactuality: 92.0,
          fallacyDensity: 0.0
        }
      },
      debateScore: {
        scores: {
          'Ciro Gomes': 132,
          'Tabata Amaral': 136
        },
        winner: 'Tabata Amaral',
        difference: 4,
        isDraw: false,
        breakdown: {
          'Ciro Gomes': {
            evidencePoints: 34,
            fallacyPenalties: -4,
            qaPoints: 28,
            tonePoints: 28,
            speakingEfficiency: 30,
            totalPoints: 132
          },
          'Tabata Amaral': {
            evidencePoints: 38,
            fallacyPenalties: 0,
            qaPoints: 31,
            tonePoints: 31,
            speakingEfficiency: 29,
            totalPoints: 136
          }
        }
      }
    },
    timeline: [
      {
        speaker: 'Ciro Gomes',
        start: 10,
        end: 85,
        text: 'A carga tributária brasileira sobre o consumo penaliza os 10% mais pobres com alíquotas efetivas desproporcionais.',
        temperature: 0.41,
        confidence: 0.99
      },
      {
        speaker: 'Tabata Amaral',
        start: 90,
        end: 160,
        text: 'A reforma através do IVA dual unifica PIS/Cofins, ICMS e ISS com mecanismo de cashback focado na base da pirâmide.',
        temperature: 0.35,
        confidence: 0.99
      }
    ],
    factChecks: [
      {
        id: 'fc_ciro_1',
        timestamp: 40,
        speaker: 'Ciro Gomes',
        claim: 'A tributação indireta no Brasil responde por quase 45% de toda a arrecadação nacional.',
        verdict: 'Verdadeiro',
        evidence: 'Confirmado pelos relatórios da Receita Federal e OCDE sobre a estrutura tributária brasileira.',
        sources: ['Receita Federal do Brasil - Carga Tributária Líquida', 'OCDE Revenue Statistics']
      },
      {
        id: 'fc_tabata_1',
        timestamp: 120,
        speaker: 'Tabata Amaral',
        claim: 'O Fundeb teve seu percentual de complementação da União ampliado progressivamente para 23% até 2026.',
        verdict: 'Verdadeiro',
        evidence: 'Definido pela Emenda Constitucional 108/2020 e regulamentado pela Lei nº 14.113/2020.',
        sources: ['Diário Oficial da União - Lei 14.113', 'MEC']
      }
    ],
    fallacies: [
      {
        id: 'fal_ciro_1',
        timestamp: 210,
        speaker: 'Ciro Gomes',
        type: 'Espantalho',
        quote: 'A proposta dos liberais quer simplesmente isentar o capital financeiro e deixar o trabalhador sem proteção previdenciária.'
      }
    ],
    createdAt: Date.now() - 86400000 * 7,
    completedAt: Date.now() - 86400000 * 7 + 4200000
  },
  {
    id: 'job_boulos_vs_marina_sustentabilidade',
    title: 'Transição Ecológica e Direito à Cidade: Guilherme Boulos vs Marina Silva',
    description: 'Convergências e divergências sobre infraestrutura urbana resiliente, moradia e matriz energética limpa.',
    youtubeUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    youtubeId: 'kJQP7kiw5Fk',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=80',
    durationSeconds: 1420,
    category: 'Sociedade & Meio Ambiente',
    speakers: [
      {
        name: 'Guilherme Boulos',
        debaterId: 'deb_guilherme_boulos',
        previewUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80'
      },
      {
        name: 'Marina Silva',
        debaterId: 'deb_marina_silva',
        previewUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80'
      }
    ],
    status: 'completed',
    progress: 100,
    metrics: {
      speakingTime: {
        'Guilherme Boulos': 680,
        'Marina Silva': 690
      },
      interruptions: {
        'Guilherme Boulos': 2,
        'Marina Silva': 1
      },
      fallaciesCount: {
        'Guilherme Boulos': 1,
        'Marina Silva': 0
      },
      averageTemperature: 0.35,
      linguisticMetrics: {
        'Guilherme Boulos': {
          wordsPerMinute: 149.0,
          vocabularyRichness: 81.0,
          formality: 78.0,
          dataDensity: 73.0,
          totalWords: 1688
        },
        'Marina Silva': {
          wordsPerMinute: 128.0,
          vocabularyRichness: 88.5,
          formality: 89.0,
          dataDensity: 80.0,
          totalWords: 1472
        }
      },
      toneMetrics: {
        'Guilherme Boulos': {
          averageTemperature: 0.40,
          emotionalControl: 80.0,
          assertiveness: 84.0,
          vocalStability: 82.0
        },
        'Marina Silva': {
          averageTemperature: 0.32,
          emotionalControl: 91.0,
          assertiveness: 77.0,
          vocalStability: 90.0
        }
      },
      qaMetrics: {
        'Guilherme Boulos': {
          questionsAsked: 4,
          questionsAnswered: 4,
          evasiveAnswers: 0,
          directAnswerRate: 84.0
        },
        'Marina Silva': {
          questionsAsked: 4,
          questionsAnswered: 4,
          evasiveAnswers: 0,
          directAnswerRate: 89.0
        }
      },
      contentMetrics: {
        'Guilherme Boulos': {
          rebuttalScore: 81.0,
          argumentStructureDensity: 82.0,
          topicAdherence: 89.0,
          framingIndex: 76.0,
          netFactuality: 84.0,
          fallacyDensity: 0.88
        },
        'Marina Silva': {
          rebuttalScore: 85.0,
          argumentStructureDensity: 88.0,
          topicAdherence: 94.0,
          framingIndex: 79.0,
          netFactuality: 94.0,
          fallacyDensity: 0.0
        }
      },
      debateScore: {
        scores: {
          'Guilherme Boulos': 124,
          'Marina Silva': 130
        },
        winner: 'Marina Silva',
        difference: 6,
        isDraw: false,
        breakdown: {
          'Guilherme Boulos': {
            evidencePoints: 28,
            fallacyPenalties: -4,
            qaPoints: 26,
            tonePoints: 27,
            speakingEfficiency: 29,
            totalPoints: 124
          },
          'Marina Silva': {
            evidencePoints: 35,
            fallacyPenalties: 0,
            qaPoints: 28,
            tonePoints: 32,
            speakingEfficiency: 28,
            totalPoints: 130
          }
        }
      }
    },
    timeline: [
      {
        speaker: 'Guilherme Boulos',
        start: 15,
        end: 90,
        text: 'Não é possível pensar transição ecológica sem resolver o déficit de 6 milhões de moradias nas regiões metropolitanas.',
        temperature: 0.38,
        confidence: 0.98
      },
      {
        speaker: 'Marina Silva',
        start: 95,
        end: 175,
        text: 'O desenvolvimento sustentável exige integrar política habitacional e conservação de bacias hidrográficas sob a ótica climática.',
        temperature: 0.32,
        confidence: 0.99
      }
    ],
    factChecks: [
      {
        id: 'fc_boulos_1',
        timestamp: 45,
        speaker: 'Guilherme Boulos',
        claim: 'O déficit habitacional brasileiro está estimado em cerca de 6 milhões de unidades segundo a Fundação João Pinheiro.',
        verdict: 'Verdadeiro',
        evidence: 'O estudo oficial da Fundação João Pinheiro (2022/2023) aponta déficit de aproximadamente 5,9 a 6,2 milhões de domicílios.',
        sources: ['Fundação João Pinheiro - FJP', 'Ministério das Cidades']
      },
      {
        id: 'fc_marina_1',
        timestamp: 130,
        speaker: 'Marina Silva',
        claim: 'O desmatamento na Amazônia teve queda superior a 45% nos alertas do sistema Deter em 2023.',
        verdict: 'Verdadeiro',
        evidence: 'Os dados consolidados do Deter/Inpe registraram redução de aproximadamente 50% na área sob alertas de desmatamento.',
        sources: ['INPE - Sistema DETER', 'Ministério do Meio Ambiente']
      }
    ],
    fallacies: [
      {
        id: 'fal_boulos_1',
        timestamp: 195,
        speaker: 'Guilherme Boulos',
        type: 'Apelo à Emoção',
        quote: 'Quem coloca a meta fiscal acima da moradia não tem sensibilidade com as mães que criam filhos em palafitas.'
      }
    ],
    createdAt: Date.now() - 86400000 * 12,
    completedAt: Date.now() - 86400000 * 12 + 3800000
  }
];

export const MOCK_AGGREGATE_STATS: DebaterAggregateStats[] = [
  {
    debaterId: 'deb_tabata_amaral',
    debaterName: 'Tabata Amaral',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    role: 'Deputada Federal',
    debatesCount: 4,
    wins: 3,
    draws: 1,
    losses: 0,
    winRate: 75,
    avgScore: 136,
    avgSpeakingTimeSeconds: 690,
    avgWordsPerMinute: 143,
    avgVocabularyRichness: 84,
    avgDataDensity: 85,
    avgEmotionalControl: 87,
    avgAssertiveness: 81,
    avgVocalStability: 89,
    avgDirectAnswerRate: 91,
    avgRebuttalScore: 86,
    totalFallacies: 1,
    avgFallaciesPerDebate: 0.25,
    totalFactChecks: 8,
    factCheckAccuracy: 95,
    recentDebates: [
      {
        jobId: 'job_ciro_vs_tabata_reforma',
        debateTitle: 'Visões de Reforma Tributária e Educação',
        date: Date.now() - 86400000 * 7,
        opponentNames: ['Ciro Gomes'],
        score: 136,
        result: 'win',
        difference: 4,
        speakingTimeSeconds: 705,
        fallaciesCount: 0
      }
    ]
  },
  {
    debaterId: 'deb_ciro_gomes',
    debaterName: 'Ciro Gomes',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    role: 'Líder Político & Economista',
    debatesCount: 5,
    wins: 3,
    draws: 1,
    losses: 1,
    winRate: 60,
    avgScore: 132,
    avgSpeakingTimeSeconds: 740,
    avgWordsPerMinute: 156,
    avgVocabularyRichness: 86,
    avgDataDensity: 82,
    avgEmotionalControl: 76,
    avgAssertiveness: 88,
    avgVocalStability: 80,
    avgDirectAnswerRate: 85,
    avgRebuttalScore: 84,
    totalFallacies: 4,
    avgFallaciesPerDebate: 0.8,
    totalFactChecks: 12,
    factCheckAccuracy: 88,
    recentDebates: [
      {
        jobId: 'job_ciro_vs_tabata_reforma',
        debateTitle: 'Visões de Reforma Tributária e Educação',
        date: Date.now() - 86400000 * 7,
        opponentNames: ['Tabata Amaral'],
        score: 132,
        result: 'loss',
        difference: -4,
        speakingTimeSeconds: 720,
        fallaciesCount: 1
      }
    ]
  },
  {
    debaterId: 'deb_marina_silva',
    debaterName: 'Marina Silva',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    role: 'Ministra & Ambientalista',
    debatesCount: 3,
    wins: 2,
    draws: 1,
    losses: 0,
    winRate: 67,
    avgScore: 130,
    avgSpeakingTimeSeconds: 670,
    avgWordsPerMinute: 128,
    avgVocabularyRichness: 88,
    avgDataDensity: 80,
    avgEmotionalControl: 91,
    avgAssertiveness: 77,
    avgVocalStability: 90,
    avgDirectAnswerRate: 89,
    avgRebuttalScore: 85,
    totalFallacies: 0,
    avgFallaciesPerDebate: 0.0,
    totalFactChecks: 7,
    factCheckAccuracy: 94,
    recentDebates: [
      {
        jobId: 'job_boulos_vs_marina_sustentabilidade',
        debateTitle: 'Transição Ecológica e Direito à Cidade',
        date: Date.now() - 86400000 * 12,
        opponentNames: ['Guilherme Boulos'],
        score: 130,
        result: 'win',
        difference: 6,
        speakingTimeSeconds: 690,
        fallaciesCount: 0
      }
    ]
  },
  {
    debaterId: 'deb_brigadeiro',
    debaterName: 'Paulo Brigadeiro',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    role: 'Analista & Crítico',
    debatesCount: 3,
    wins: 2,
    draws: 0,
    losses: 1,
    winRate: 67,
    avgScore: 126,
    avgSpeakingTimeSeconds: 610,
    avgWordsPerMinute: 133,
    avgVocabularyRichness: 82,
    avgDataDensity: 74,
    avgEmotionalControl: 81,
    avgAssertiveness: 76,
    avgVocalStability: 84,
    avgDirectAnswerRate: 88,
    avgRebuttalScore: 89,
    totalFallacies: 2,
    avgFallaciesPerDebate: 0.67,
    totalFactChecks: 6,
    factCheckAccuracy: 88,
    recentDebates: [
      {
        jobId: 'job_tallis_vs_brigadeiro_2026',
        debateTitle: 'Duelo de Gestão vs Pragmatismo',
        date: Date.now() - 86400000 * 3,
        opponentNames: ['Tallis Gomes'],
        score: 126,
        result: 'win',
        difference: 8,
        speakingTimeSeconds: 620,
        fallaciesCount: 1
      }
    ]
  },
  {
    debaterId: 'deb_guilherme_boulos',
    debaterName: 'Guilherme Boulos',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    role: 'Deputado Federal & Professor',
    debatesCount: 4,
    wins: 2,
    draws: 0,
    losses: 2,
    winRate: 50,
    avgScore: 124,
    avgSpeakingTimeSeconds: 675,
    avgWordsPerMinute: 149,
    avgVocabularyRichness: 81,
    avgDataDensity: 73,
    avgEmotionalControl: 80,
    avgAssertiveness: 84,
    avgVocalStability: 82,
    avgDirectAnswerRate: 84,
    avgRebuttalScore: 81,
    totalFallacies: 3,
    avgFallaciesPerDebate: 0.75,
    totalFactChecks: 8,
    factCheckAccuracy: 84,
    recentDebates: [
      {
        jobId: 'job_boulos_vs_marina_sustentabilidade',
        debateTitle: 'Transição Ecológica e Direito à Cidade',
        date: Date.now() - 86400000 * 12,
        opponentNames: ['Marina Silva'],
        score: 124,
        result: 'loss',
        difference: -6,
        speakingTimeSeconds: 680,
        fallaciesCount: 1
      }
    ]
  },
  {
    debaterId: 'deb_tallis_gomes',
    debaterName: 'Tallis Gomes',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    role: 'Empreendedor & Autor',
    debatesCount: 3,
    wins: 1,
    draws: 0,
    losses: 2,
    winRate: 33,
    avgScore: 118,
    avgSpeakingTimeSeconds: 580,
    avgWordsPerMinute: 148,
    avgVocabularyRichness: 76,
    avgDataDensity: 68,
    avgEmotionalControl: 74,
    avgAssertiveness: 82,
    avgVocalStability: 78,
    avgDirectAnswerRate: 80,
    avgRebuttalScore: 78,
    totalFallacies: 4,
    avgFallaciesPerDebate: 1.33,
    totalFactChecks: 7,
    factCheckAccuracy: 75,
    recentDebates: [
      {
        jobId: 'job_tallis_vs_brigadeiro_2026',
        debateTitle: 'Duelo de Gestão vs Pragmatismo',
        date: Date.now() - 86400000 * 3,
        opponentNames: ['Paulo Brigadeiro'],
        score: 118,
        result: 'loss',
        difference: -8,
        speakingTimeSeconds: 580,
        fallaciesCount: 2
      }
    ]
  }
];
