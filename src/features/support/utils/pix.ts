export interface PixPayloadParams {
  key: string;
  name?: string;
  city?: string;
  txid?: string;
  amount?: number;
}

/**
 * Calcula o CRC16-CCITT (polinômio 0x1021) com valor inicial 0xFFFF exigido pelo padrão BR Code do Banco Central.
 */
export const calculateCrc16 = (str: string): string => {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
};

/**
 * Formata um campo TLV (Tag-Length-Value) do padrão EMV / BR Code.
 */
export const formatTlv = (id: string, value: string): string => {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
};

/**
 * Gera a string Pix Copia e Cola (BR Code EMV) estática válida para leitura por qualquer aplicativo de banco.
 */
export const generatePixPayload = ({
  key,
  name = 'Argumeta',
  city = 'SAO PAULO',
  txid = '***',
  amount
}: PixPayloadParams): string => {
  const cleanKey = key.trim();
  const cleanName =
    name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .slice(0, 25)
      .trim() || 'Argumeta';
  const cleanCity =
    city
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .slice(0, 15)
      .trim() || 'SAO PAULO';
  const cleanTxid = txid.slice(0, 25) || '***';

  const accountInfo =
    formatTlv('00', 'br.gov.bcb.pix') + formatTlv('01', cleanKey);
  const additionalData = formatTlv('05', cleanTxid);

  let raw =
    formatTlv('00', '01') +
    formatTlv('26', accountInfo) +
    formatTlv('52', '0000') +
    formatTlv('53', '986');

  if (amount && amount > 0) {
    raw += formatTlv('54', amount.toFixed(2));
  }

  raw +=
    formatTlv('58', 'BR') +
    formatTlv('59', cleanName) +
    formatTlv('60', cleanCity) +
    formatTlv('62', additionalData) +
    '6304';

  const checksum = calculateCrc16(raw);
  return `${raw}${checksum}`;
};

export interface PixConfig {
  key: string;
  payload: string;
  hasCustomConfig: boolean;
}

/**
 * Obtém a chave Pix e o payload Copia e Cola configurados via variáveis de ambiente.
 */
export const getPixConfig = (): PixConfig => {
  const envKey = import.meta.env.VITE_PIX_KEY?.trim() || '';
  const envPayload = import.meta.env.VITE_PIX_PAYLOAD?.trim() || '';
  const envName = import.meta.env.VITE_PIX_NAME?.trim() || 'Argumeta';
  const envCity = import.meta.env.VITE_PIX_CITY?.trim() || 'SAO PAULO';

  if (envPayload) {
    return {
      key: envKey || 'Pix Copia e Cola',
      payload: envPayload,
      hasCustomConfig: true
    };
  }

  if (envKey) {
    return {
      key: envKey,
      payload: generatePixPayload({ key: envKey, name: envName, city: envCity }),
      hasCustomConfig: true
    };
  }

  const defaultKey = 'pix@argumeta.com.br';
  return {
    key: defaultKey,
    payload: generatePixPayload({ key: defaultKey, name: 'Argumeta', city: 'SAO PAULO' }),
    hasCustomConfig: false
  };
};
