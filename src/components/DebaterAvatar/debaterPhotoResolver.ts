const DEFAULT_SUPABASE_PROJECT_URL =
  'https://ebjtumxwmcwzwidinvds.supabase.co';

const getStorageBaseUrl = (): string => {
  const envUrl = typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL
    ? import.meta.env.VITE_SUPABASE_URL
    : '';

  const baseUrl = envUrl && !envUrl.includes('<seu-projeto>')
    ? envUrl.replace(/\/+$/, '')
    : DEFAULT_SUPABASE_PROJECT_URL;

  return `${baseUrl}/storage/v1/object/public/debater-assets`;
};

/**
 * Registro em memória de fotos associadas a nomes e IDs de debatedores.
 * Evita buscas repetitivas e permite fallback instantâneo.
 */
const photoRegistry = new Map<string, string>();

const normalizeKey = (key?: string): string => {
  if (!key) return '';
  return key
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
};

// Sementes iniciais conhecidas no ecossistema Argumeta
const initDefaultRegistry = () => {
  const storageBase = getStorageBaseUrl();
  const tallisUrl = `${storageBase}/photos/tallis_gomes.jpg`;
  const brigadeiroUrl = `${storageBase}/photos/brigadeiro.jpg`;

  photoRegistry.set('tallis gomes', tallisUrl);
  photoRegistry.set('deb_tallis_gomes', tallisUrl);
  photoRegistry.set('brigadeiro', brigadeiroUrl);
  photoRegistry.set('paulo brigadeiro', brigadeiroUrl);
  photoRegistry.set('deb_brigadeiro', brigadeiroUrl);

  // Mocks do portal
  photoRegistry.set(
    'ciro gomes',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80'
  );
  photoRegistry.set(
    'deb_ciro_gomes',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80'
  );
  photoRegistry.set(
    'tabata amaral',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
  );
  photoRegistry.set(
    'deb_tabata_amaral',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
  );
  photoRegistry.set(
    'guilherme boulos',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80'
  );
  photoRegistry.set(
    'deb_guilherme_boulos',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80'
  );
  photoRegistry.set(
    'marina silva',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80'
  );
  photoRegistry.set(
    'deb_marina_silva',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80'
  );
};

initDefaultRegistry();

/**
 * Registra a foto de um debatedor pelo nome ou ID no cache de registro
 */
export const registerDebaterPhoto = (key: string, photoUrl: string): void => {
  if (!key || !photoUrl) return;
  photoRegistry.set(normalizeKey(key), photoUrl);
};

/**
 * Registra um lote de debatedores no registro de fotos
 */
export const registerDebatersBatch = (
  debaters: Array<{ id?: string; name?: string; photoUrl?: string }>
): void => {
  for (const deb of debaters) {
    if (!deb.photoUrl) continue;
    if (deb.name) registerDebaterPhoto(deb.name, deb.photoUrl);
    if (deb.id) registerDebaterPhoto(deb.id, deb.photoUrl);
  }
};

/**
 * Resolve qualquer URL ou caminho de foto de debatedor para uma URL pública utilizável.
 * Converte caminhos do ETL legados ("/src/assets/speakers/...", "resources/speakers/...", "photos/...")
 * para o bucket público do Supabase Storage.
 */
export const resolveDebaterPhotoUrl = (
  photoUrl?: string,
  debaterName?: string,
  debaterId?: string
): string | undefined => {
  // 1. Se já for uma URL HTTP válida
  if (photoUrl && (photoUrl.startsWith('http://') || photoUrl.startsWith('https://'))) {
    return photoUrl;
  }

  // 2. Se for um caminho relativo legado ou local de armazenamento
  if (photoUrl && typeof photoUrl === 'string') {
    const cleanPath = photoUrl.trim();

    // Extrair o nome do arquivo se vier com caminho relativo
    // Ex.: "/src/assets/speakers/tallis_gomes.jpg", "resources/speakers/tallis_gomes.jpg", "photos/tallis_gomes.jpg"
    const match = cleanPath.match(/([^/\\?#]+)\.(jpg|jpeg|png|webp)$/i);
    if (match) {
      const fileName = `${match[1]}.${match[2]}`.toLowerCase();
      const storageBase = getStorageBaseUrl();
      return `${storageBase}/photos/${fileName}`;
    }
  }

  // 3. Consulta no registro em memória se photoUrl não foi fornecida ou não é válida
  if (debaterId) {
    const byId = photoRegistry.get(normalizeKey(debaterId));
    if (byId) return byId;
  }

  if (debaterName) {
    const byName = photoRegistry.get(normalizeKey(debaterName));
    if (byName) return byName;
  }

  return undefined;
};
