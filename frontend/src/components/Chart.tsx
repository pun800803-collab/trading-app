import type { Position } from '../../../shared/types';

interface PositionsProps {
  positions: Position[];
}

export function Positions({ positions }: PositionsProps) {
  return (
    <div className="card positions-section">
      <h3>Positions</h3>
      <div className="positions-grid">
        {positions.length === 0 ? (
          <div className="muted">No open positions yet.</div>
        ) : (
          positions.map((position) => (
            <div key={position.id} className="position-item">
              <div className="left">
                <strong>{position.symbol}</strong>
                <span className="muted">
                  {position.side} · {position.quantity} units · Avg {position.avgPrice.toLocaleString()}
                </span>
              </div>
              <div className="right">
                <strong className={position.pnl >= 0 ? 'up' : 'down'}>
                  ${position.pnl.toFixed(2)}
                </strong>
                {position.stopLoss && <div className="muted">SL {position.stopLoss}</div>}
                {position.takeProfit && <div className="muted">TP {position.takeProfit}</div>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
