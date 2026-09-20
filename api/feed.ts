interface ApiRequest {
  headers: Record<string, string | string[] | undefined>;
}

interface ApiResponse {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  send(body: string): void;
  end(): void;
}

interface SpeakerItem {
  name: string;
}

interface DebateItem {
  id: string;
  speakers?: SpeakerItem[];
  created_at?: string;
  completed_at?: string;
  youtube_url?: string;
}

const DEFAULT_SITE_URL = 'https://argumeta.com.br';

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  const host = req.headers['host'];
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const siteUrl = host ? `${proto}://${host}` : (process.env.VITE_SITE_URL || DEFAULT_SITE_URL);

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  let debates: DebateItem[] = [];

  if (supabaseUrl && supabaseKey) {
    try {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/debate_jobs?status=eq.completed&is_active=eq.true&select=id,speakers,created_at,completed_at,youtube_url&order=created_at.desc&limit=50`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`
          }
        }
      );

      if (response.ok) {
        debates = (await response.json()) as DebateItem[];
      }
    } catch {
      debates = [];
    }
  }

  const itemsXml = debates
    .map((d) => {
      const speakersStr = (d.speakers || []).map((s) => s.name).join(' vs ');
      const title = speakersStr ? `Debate: ${speakersStr}` : `Análise de Debate ${d.id}`;
      const url = `${siteUrl}/debates/${d.id}`;
      const date = d.completed_at || d.created_at || new Date().toISOString();
      const pubDate = new Date(date).toUTCString();
      const desc = `Análise retórica imparcial, checagem de fatos e detecção de falácias para o debate entre ${escapeXml(speakersStr || 'participantes')}.`;

      return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${desc}</description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Argumeta — Debates e Análises Retóricas</title>
    <link>${siteUrl}</link>
    <description>Plataforma de inteligência artificial para análise de debates, checagem de fatos e pontuação retórica imparcial.</description>
    <language>pt-BR</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${itemsXml}
  </channel>
</rss>`;

  res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=86400');
  res.status(200).send(xml);
}
