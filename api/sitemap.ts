interface ApiRequest {
  headers: Record<string, string | string[] | undefined>;
}

interface ApiResponse {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  send(body: string): void;
  end(): void;
}

interface DebateItem {
  id: string;
  created_at?: string;
  completed_at?: string;
  updated_at?: string;
}

const DEFAULT_SITE_URL = 'https://argumeta.com.br';

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
        `${supabaseUrl}/rest/v1/debate_jobs?status=eq.completed&is_active=eq.true&select=id,created_at,completed_at&order=created_at.desc&limit=1000`,
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
      // Falha silenciosa, usa lista estática de fallback
      debates = [];
    }
  }

  const currentDate = new Date().toISOString().split('T')[0];

  const staticUrls = [
    { loc: `${siteUrl}/`, changefreq: 'daily', priority: '1.0', lastmod: currentDate },
    { loc: `${siteUrl}/ranking`, changefreq: 'daily', priority: '0.9', lastmod: currentDate },
    { loc: `${siteUrl}/debaters`, changefreq: 'weekly', priority: '0.8', lastmod: currentDate },
    { loc: `${siteUrl}/sugestoes`, changefreq: 'monthly', priority: '0.6', lastmod: currentDate }
  ];

  const debateUrls = debates.map((d) => {
    const rawDate = d.completed_at || d.created_at;
    const lastmod = rawDate ? new Date(rawDate).toISOString().split('T')[0] : currentDate;
    return {
      loc: `${siteUrl}/debates/${d.id}`,
      changefreq: 'weekly',
      priority: '0.8',
      lastmod
    };
  });

  const allUrls = [...staticUrls, ...debateUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(xml);
}
