import { v4 as uuid } from 'uuid';
import { RiskManager } from './RiskManager';
import { Position } from '../types';

export type OrderSide = 'BUY' | 'SELL';

export interface OrderRequest {
  symbol: string;
  side: OrderSide;
  quantity: number;
  stopLoss?: number;
  takeProfit?: number;
  price: number;
}

export class OrderService {
  private readonly riskManager = new RiskManager();
  private positions: Position[] = [];

  constructor() {
    this.positions = [];
  }

  placeOrder(request: OrderRequest): { ok: boolean; trade?: Position; message?: string } {
    const validation = this.riskManager.validateOrder(request);
    if (!validation.ok) {
      return { ok: false, message: validation.message };
    }

    const position: Position = {
      id: uuid(),
      symbol: request.symbol as Position['symbol'],
      side: request.side,
      quantity: request.quantity,
      avgPrice: request.price,
      pnl: 0,
      stopLoss: request.stopLoss,
      takeProfit: request.takeProfit,
    };

    this.positions.push(position);

    return { ok: true, trade: position };
  }

  getPositions(): Position[] {
    return this.positions;
  }
}
