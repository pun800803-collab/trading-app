export type Timeframe = '1H' | '3H' | '1D';

export type SymbolName = 'XAU/USD' | 'XAG/USD' | 'BTC/USD' | 'ETH/USD';

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface PriceTick {
  symbol: SymbolName;
  price: number;
  timestamp: number;
}

export interface Position {
  id: string;
  symbol: SymbolName;
  side: 'BUY' | 'SELL';
  quantity: number;
  avgPrice: number;
  pnl: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface OrderRequest {
  symbol: SymbolName;
  side: 'BUY' | 'SELL';
  quantity: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface MarketSnapshot {
  symbol: SymbolName;
  price: number;
  candles: Candle[];
  bid?: number;
  ask?: number;
}

export interface OrderResponse {
  ok: boolean;
  trade?: Position;
  message?: string;
}
