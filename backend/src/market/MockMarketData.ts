export type SymbolName = 'XAU/USD' | 'XAG/USD' | 'BTC/USD' | 'ETH/USD';

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface MarketDataProvider {
  getHistoricalCandles(symbol: string, timeframe: string): Promise<Candle[]>;
  subscribe(symbol: string, callback: (price: number) => void): void;
  unsubscribe(symbol: string): void;
}
