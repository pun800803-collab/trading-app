import { MarketDataProvider, Candle } from './MarketDataProvider';

const symbolBaseMap: Record<string, number> = {
  'XAU/USD': 2320,
  'XAG/USD': 28.5,
  'BTC/USD': 62000,
  'ETH/USD': 3400,
};

export class MockMarketData implements MarketDataProvider {
  private readonly listeners: Record<string, ((price: number) => void)[]> = {};
  private readonly prices: Record<string, number> = { ...symbolBaseMap };

  getHistoricalCandles(symbol: string, timeframe: string): Promise<Candle[]> {
    const base = this.prices[symbol] ?? 100;
    const candles: Candle[] = [];
    let previous = base;

    for (let i = 0; i < 40; i += 1) {
      const open = previous;
      const drift = ((Math.random() - 0.5) * (symbol.includes('XAU') || symbol.includes('XAG') ? 30 : 1200));
      const close = Number((open + drift).toFixed(2));
      const high = Number((Math.max(open, close) + Math.random() * (symbol.includes('XAU') || symbol.includes('XAG') ? 5 : 200)).toFixed(2));
      const low = Number((Math.min(open, close) - Math.random() * (symbol.includes('XAU') || symbol.includes('XAG') ? 5 : 200)).toFixed(2));
      candles.push({
        time: Date.now() - (40 - i) * 60 * 60 * 1000,
        open,
        high,
        low,
        close,
      });
      previous = close;
    }

    return Promise.resolve(candles);
  }

  subscribe(symbol: string, callback: (price: number) => void): void {
    if (!this.listeners[symbol]) {
      this.listeners[symbol] = [];
    }
    this.listeners[symbol].push(callback);
  }

  unsubscribe(symbol: string): void {
    delete this.listeners[symbol];
  }

  tick(symbol: string): void {
    const current = this.prices[symbol] ?? 100;
    const delta = ((Math.random() - 0.5) * (symbol.includes('XAU') || symbol.includes('XAG') ? 10 : 1000));
    const next = Number((current + delta).toFixed(2));
    this.prices[symbol] = next;

    if (this.listeners[symbol]) {
      this.listeners[symbol].forEach((callback) => callback(next));
    }
  }

  getCurrentPrice(symbol: string): number {
    return this.prices[symbol] ?? 100;
  }
}
