import { WebSocketServer } from 'ws';
import { v4 as uuid } from 'uuid';

export type SymbolName = 'XAU/USD' | 'XAG/USD' | 'BTC/USD' | 'ETH/USD';
export type OrderSide = 'BUY' | 'SELL';

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface Position {
  id: string;
  symbol: SymbolName;
  side: OrderSide;
  quantity: number;
  avgPrice: number;
  pnl: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface PriceTick {
  symbol: SymbolName;
  price: number;
  timestamp: number;
}

export const BROADCAST_MESSAGE_TYPES = {
  PRICE_UPDATE: 'PRICE_UPDATE',
  POSITION_UPDATE: 'POSITION_UPDATE',
};

export type BroadcastMessage =
  | { type: 'PRICE_UPDATE'; payload: PriceTick }
  | { type: 'POSITION_UPDATE'; payload: Position[] };

export const marketPrices: Record<SymbolName, number> = {
  'XAU/USD': 2354.12,
  'XAG/USD': 28.94,
  'BTC/USD': 63240.74,
  'ETH/USD': 3512.87,
};

export const defaultCandles: Record<SymbolName, Candle[]> = {
  'XAU/USD': createCandles(2350, 15, 40),
  'XAG/USD': createCandles(28.5, 0.9, 40),
  'BTC/USD': createCandles(62000, 1400, 40),
  'ETH/USD': createCandles(3400, 120, 40),
};

function createCandles(base: number, step: number, count: number): Candle[] {
  const candles: Candle[] = [];
  let current = base;

  for (let i = count; i > 0; i -= 1) {
    const open = current;
    const delta = (Math.random() - 0.5) * step;
    const close = Number((open + delta).toFixed(2));
    const high = Number((Math.max(open, close) + Math.random() * step).toFixed(2));
    const low = Number((Math.min(open, close) - Math.random() * step).toFixed(2));
    candles.push({
      time: Date.now() - i * 60 * 60 * 1000,
      open,
      high,
      low,
      close,
    });
    current = close;
  }

  return candles;
}

export const wsServer = new WebSocketServer({ noServer: true });

export function broadcast(message: BroadcastMessage): void {
  const payload = JSON.stringify(message);
  wsServer.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(payload);
    }
  });
}

export function createPosition(symbol: SymbolName, side: OrderSide, quantity: number, avgPrice: number): Position {
  return {
    id: uuid(),
    symbol,
    side,
    quantity,
    avgPrice,
    pnl: 0,
  };
}
