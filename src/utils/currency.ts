import { CurrencyCode, CurrencyConfig } from '../types';

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  {
    code: 'IDR',
    symbol: 'Rp',
    name: 'Indonesian Rupiah',
    flag: '🇮🇩',
    rateAgainstIdr: 1,
    locale: 'id-ID',
    decimalPlaces: 0,
  },
  {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸',
    rateAgainstIdr: 16000,
    locale: 'en-US',
    decimalPlaces: 2,
  },
  {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    flag: '🇪🇺',
    rateAgainstIdr: 17500,
    locale: 'de-DE',
    decimalPlaces: 2,
  },
  {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    flag: '🇸🇬',
    rateAgainstIdr: 12000,
    locale: 'en-SG',
    decimalPlaces: 2,
  },
  {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    flag: '🇬🇧',
    rateAgainstIdr: 20500,
    locale: 'en-GB',
    decimalPlaces: 2,
  },
  {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    flag: '🇦🇺',
    rateAgainstIdr: 10500,
    locale: 'en-AU',
    decimalPlaces: 2,
  },
  {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    flag: '🇯🇵',
    rateAgainstIdr: 105,
    locale: 'ja-JP',
    decimalPlaces: 0,
  },
];

export const getCurrencyConfig = (code: CurrencyCode): CurrencyConfig => {
  return (
    SUPPORTED_CURRENCIES.find((c) => c.code === code) ||
    SUPPORTED_CURRENCIES[0]
  );
};

export const convertFromIdr = (
  amountInIdr: number,
  targetCurrency: CurrencyCode
): number => {
  const config = getCurrencyConfig(targetCurrency);
  if (config.rateAgainstIdr === 1) return amountInIdr;
  return amountInIdr / config.rateAgainstIdr;
};

export const convertToIdr = (
  amountInTarget: number,
  sourceCurrency: CurrencyCode
): number => {
  const config = getCurrencyConfig(sourceCurrency);
  if (config.rateAgainstIdr === 1) return amountInTarget;
  return amountInTarget * config.rateAgainstIdr;
};

export const formatCurrency = (
  amountInIdr: number,
  currency: CurrencyCode = 'IDR',
  options?: {
    showDecimals?: boolean;
    includeCode?: boolean;
  }
): string => {
  const config = getCurrencyConfig(currency);
  const converted = convertFromIdr(amountInIdr, currency);

  if (currency === 'IDR') {
    return `Rp ${Math.round(amountInIdr).toLocaleString('id-ID')}`;
  }

  const isWhole = Math.abs(converted % 1) < 0.01;
  const decimals =
    options?.showDecimals !== undefined
      ? options.showDecimals
        ? config.decimalPlaces
        : 0
      : isWhole
      ? 0
      : config.decimalPlaces;

  try {
    const formatted = new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.code,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(converted);

    return options?.includeCode ? `${formatted} (${config.code})` : formatted;
  } catch {
    // Fallback if locale is unsupported
    return `${config.symbol}${converted.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`;
  }
};

export const formatCurrencyShort = (
  amountInIdr: number,
  currency: CurrencyCode = 'IDR'
): string => {
  const config = getCurrencyConfig(currency);
  const converted = convertFromIdr(amountInIdr, currency);

  if (currency === 'IDR') {
    if (Math.abs(amountInIdr) >= 1_000_000_000) {
      return `${(amountInIdr / 1_000_000_000).toFixed(1)} M`;
    }
    if (Math.abs(amountInIdr) >= 1_000_000) {
      return `${(amountInIdr / 1_000_000).toFixed(1)} Jt`;
    }
    if (Math.abs(amountInIdr) >= 1_000) {
      return `${(amountInIdr / 1_000).toFixed(0)} Rb`;
    }
    return `Rp ${amountInIdr.toLocaleString('id-ID')}`;
  }

  // Non-IDR: K, M, B
  const abs = Math.abs(converted);
  let suffix = '';
  let val = converted;

  if (abs >= 1_000_000_000) {
    val = converted / 1_000_000_000;
    suffix = 'B';
  } else if (abs >= 1_000_000) {
    val = converted / 1_000_000;
    suffix = 'M';
  } else if (abs >= 1_000) {
    val = converted / 1_000;
    suffix = 'k';
  }

  const formattedNum =
    suffix !== ''
      ? val.toFixed(1).replace(/\.0$/, '')
      : val.toFixed(config.decimalPlaces === 0 ? 0 : 1).replace(/\.0$/, '');

  return `${config.symbol}${formattedNum}${suffix}`;
};
