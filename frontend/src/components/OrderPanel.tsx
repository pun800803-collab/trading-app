import type { PriceTick } from '../../../shared/types';

interface WatchlistProps {
  prices: Record<string, number>;
}

const symbols = ['XAU/USD', 'XAG/USD', 'BTC/USD', 'ETH/USD'];

export function Watchlist({ prices }: WatchlistProps) {
  return (
    <div className="card side-panel">
      <div className="watchlist">
        <h3>Watchlist</h3>
        {symbols.map((symbol) => {
          const price = prices[symbol] ?? 0;
          const change = ((Math.random() - 0.5) * 100).toFixed(2);
          const isPositive = Number(change) >= 0;

          return (
            <div key={symbol} className="watch-item">
              <div className="meta">
                <strong>{symbol}</strong>
                <span className="muted">{price.toLocaleString()}</span>
              </div>
              <span className={isPositive ? 'up' : 'down'}>{isPositive ? '+' : ''}{change}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
