export class RiskManager {
  private readonly maxPositionValue = 25000;
  private readonly maxDailyLossPercent = 0.15;

  validateOrder({
    symbol,
    side,
    quantity,
    price,
    stopLoss,
    takeProfit,
  }: {
    symbol: string;
    side: 'BUY' | 'SELL';
    quantity: number;
    price: number;
    stopLoss?: number;
    takeProfit?: number;
  }): { ok: boolean; message?: string } {
    const notional = quantity * price;

    if (notional > this.maxPositionValue) {
      return { ok: false, message: `Position notional exceeds max risk limit of $${this.maxPositionValue}` };
    }

    if (stopLoss && takeProfit) {
      const stopDistance = Math.abs(price - stopLoss);
      const profitDistance = Math.abs(takeProfit - price);

      if (stopDistance > 0 && profitDistance > 0 && stopDistance > profitDistance * 2) {
        return { ok: false, message: 'Risk ratio invalid: stop-loss distance cannot be greater than 2x take-profit distance.' };
      }
    }

    if (side === 'SELL' && quantity <= 0) {
      return { ok: false, message: 'Sell quantity must be greater than zero.' };
    }

    if (side === 'BUY' && quantity <= 0) {
      return { ok: false, message: 'Buy quantity must be greater than zero.' };
    }

    return { ok: true };
  }
}
