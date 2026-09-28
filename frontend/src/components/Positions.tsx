import type { SymbolName } from '../../../shared/types';

interface OrderPanelProps {
  symbol: SymbolName;
  onSymbolChange: (symbol: SymbolName) => void;
  onPlaceOrder: (side: 'BUY' | 'SELL') => void;
  quantity: number;
  onQuantityChange: (value: number) => void;
  stopLoss: number;
  onStopLossChange: (value: number) => void;
  takeProfit: number;
  onTakeProfitChange: (value: number) => void;
  price: number;
}

const symbols: SymbolName[] = ['XAU/USD', 'XAG/USD', 'BTC/USD', 'ETH/USD'];

export function OrderPanel({
  symbol,
  onSymbolChange,
  onPlaceOrder,
  quantity,
  onQuantityChange,
  stopLoss,
  onStopLossChange,
  takeProfit,
  onTakeProfitChange,
  price,
}: OrderPanelProps) {
  return (
    <div className="card">
      <div className="chart-header">
        <h3>Order Panel</h3>
        <span className="muted">Price: {price.toLocaleString()}</span>
      </div>

      <div className="order-panel">
        <div className="order-row">
          <select value={symbol} onChange={(e) => onSymbolChange(e.target.value as SymbolName)}>
            {symbols.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="order-row">
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => onQuantityChange(Number(e.target.value))}
            placeholder="Quantity"
          />
        </div>

        <div className="order-row">
          <input
            type="number"
            min={0}
            value={stopLoss}
            onChange={(e) => onStopLossChange(Number(e.target.value))}
            placeholder="Stop Loss"
          />
        </div>

        <div className="order-row">
          <input
            type="number"
            min={0}
            value={takeProfit}
            onChange={(e) => onTakeProfitChange(Number(e.target.value))}
            placeholder="Take Profit"
          />
        </div>

        <div className="order-cta">
          <button className="buy" onClick={() => onPlaceOrder('BUY')}>Buy</button>
          <button className="sell" onClick={() => onPlaceOrder('SELL')}>Sell</button>
        </div>
      </div>
    </div>
  );
}
