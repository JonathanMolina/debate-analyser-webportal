/**
 * Script para geração do sitemap.xml estático
 * Executado opcionalmente no build (npm run build) ou em cron jobs.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const DEFAULT_SITE_URL = process.env.VITE_SITE_URL || 'https://argumeta.com.br';
const currentDate = new Date().toISOString().split('T')[0];

const staticUrls = [
  { loc: `${DEFAULT_SITE_URL}/`, changefreq: 'daily', priority: '1.0' },
  { loc: `${DEFAULT_SITE_URL}/ranking`, changefreq: 'daily', priority: '0.9' },
  { loc: `${DEFAULT_SITE_URL}/debaters`, changefreq: 'weekly', priority: '0.8' },
  { loc: `${DEFAULT_SITE_URL}/sugestoes`, changefreq: 'monthly', priority: '0.6' }
];

async function generate() {
  let debateUrls = [];
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/debate_jobs?status=eq.completed&is_active=eq.true&select=id,created_at,completed_at&order=created_at.desc&limit=500`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`
          }
        }
      );

      if (res.ok) {
        const debates = await res.json();
        debateUrls = debates.map((d) => {
          const rawDate = d.completed_at || d.created_at;
          const lastmod = rawDate ? new Date(rawDate).toISOString().split('T')[0] : currentDate;
          return {
            loc: `${DEFAULT_SITE_URL}/debates/${d.id}`,
            lastmod,
            changefreq: 'weekly',
            priority: '0.8'
          };
        });
      }
    } catch {
      // Falha silenciosa
    }
  }

  const allUrls = [...staticUrls, ...debateUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod || currentDate}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  const publicPath = path.join(rootDir, 'public', 'sitemap.xml');
  fs.writeFileSync(publicPath, xml, 'utf8');

  // Se dist existir, escreve também
  const distPath = path.join(rootDir, 'dist', 'sitemap.xml');
  if (fs.existsSync(path.join(rootDir, 'dist'))) {
    fs.writeFileSync(distPath, xml, 'utf8');
  }

  // eslint-disable-next-line no-console
  console.log(`[SEO] Sitemap gerado com sucesso com ${allUrls.length} rotas.`);
}

generate();
