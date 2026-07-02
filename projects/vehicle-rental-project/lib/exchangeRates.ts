const CACHE_KEY = 'exchange_rates';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface CachedRates {
  rates: { USD: number; EUR: number };
  timestamp: number;
}

let memoryCache: CachedRates | null = null;

export async function getExchangeRates(): Promise<{ USD: number; EUR: number }> {
  if (memoryCache && Date.now() - memoryCache.timestamp < CACHE_DURATION) {
    return memoryCache.rates;
  }

  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed: CachedRates = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_DURATION) {
          memoryCache = parsed;
          return parsed.rates;
        }
      }
    } catch {}
  }

  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=NOK&to=USD,EUR');
    if (!res.ok) throw new Error('Failed to fetch rates');
    const data = await res.json();

    const rates = {
      USD: data.rates.USD,
      EUR: data.rates.EUR,
    };

    const cacheData: CachedRates = { rates, timestamp: Date.now() };
    memoryCache = cacheData;

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      } catch {}
    }

    return rates;
  } catch {
    // Fallback rates if API fails
    return { USD: 0.092, EUR: 0.085 };
  }
}

export function formatApproxPrices(nokAmount: number, rates: { USD: number; EUR: number }): string {
  const usd = Math.round(nokAmount * rates.USD);
  const eur = Math.round(nokAmount * rates.EUR);
  return `≈ $${usd.toLocaleString()} / ${eur.toLocaleString()}€`;
}
