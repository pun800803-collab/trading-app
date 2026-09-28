import { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { Chart } from './components/Chart';
import { Watchlist } from './components/Watchlist';
import { OrderPanel } from './components/OrderPanel';
import { Positions } from './components/Positions';
import { TradingWebSocketClient } from './services/websocket';
import type { Candle, MarketSnapshot, Position, SymbolName } from '../../shared/types';

const defaultSymbols: SymbolName[] = ['XAU/USD', 'XAG/USD', 'BTC/USD', 'ETH/USD'];
const defaultTimeframes = ['1H', '3H', '1D'] as const;

type Timeframe = (typeof defaultTimeframes)[number];

function App() {
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolName>('XAU/USD');
  const [timeframe, setTimeframe] = useState<Timeframe>('1H');
  const [marketData, setMarketData] = useState<Record<string, MarketSnapshot>>({});
  const [positions, setPositions] = useState<Position[]>([]);
  const [balance, setBalance] = useState(100000);
  const [quantity, setQuantity] = useState(1);
  const [stopLoss, setStopLoss] = useState(0);
  const [takeProfit, setTakeProfit] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const currentPrice = marketData[selectedSymbol]?.price ?? 0;
  const currentCandles = marketData[selectedSymbol]?.candles ?? [];

  useEffect(() => {
    const fetchMarket = async () => {
      const res = await fetch('http://localhost:3001/api/market');
      const json = await res.json();
      const next: Record<string, MarketSnapshot> = {};
      json.forEach((entry: any) => {
        next[entry.symbol] = {
          symbol: entry.symbol,
          price: entry.price,
          candles: entry.candles,
        };
      });
      setMarketData(next);
    };

    const fetchPositions = async () => {
      const res = await fetch('http://localhost:3001/api/positions');
      const nextPositions = await res.json();
      setPositions(nextPositions);
    };

    fetchMarket();
    fetchPositions();

    const socket = new TradingWebSocketClient('ws://localhost:8081', (message) => {
      if (message.type === 'PRICE_UPDATE') {
        setMarketData((prev) => {
          const symbol = message.payload.symbol;
          const prevEntry = prev[symbol] ?? { symbol, price: 0, candles: [] };
          return {
            ...prev,
            [symbol]: {
              ...prevEntry,
              price: message.payload.price,
              candles: prevEntry.candles.length > 0
                ? [...prevEntry.candles.slice(-39), {
                    time: Date.now(),
                    open: prevEntry.candles[prevEntry.candles.length - 1]?.close ?? message.payload.price,
                    high: message.payload.price,
                    low: message.payload.price,
                    close: message.payload.price,
                  }]
                : [{ time: Date.now(), open: message.payload.price, high: message.payload.price, low: message.payload.price, close: message.payload.price }],
            },
          };
        });
      }

      if (message.type === 'POSITION_UPDATE') {
        setPositions(message.payload);
      }

      if (message.type === 'SYSTEM') {
        setIsConnected(true);
      }
    });

    return () => socket.close();
  }, []);

  const placeOrder = async (side: 'BUY' | 'SELL') => {
    const res = await fetch('http://localhost:3001/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symbol: selectedSymbol,
        side,
        quantity,
        stopLoss: stopLoss || undefined,
        takeProfit: takeProfit || undefined,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message || 'Order failed');
      return;
    }

    const order = data.trade;
    if (order) {
      setPositions((prev) => [
        ...prev,
        order,
      ]);

      if (side === 'BUY') {
        setBalance((prev) => prev - quantity * currentPrice);
      } else {
        setBalance((prev) => prev + quantity * currentPrice);
      }
    }
  };

  const watchlistPrices = useMemo(() => {
    const next: Record<string, number> = {};
    defaultSymbols.forEach((symbol) => {
      next[symbol] = marketData[symbol]?.price ?? 0;
    });
    return next;
  }, [marketData]);

  return (
    <div className="app-shell">
      <Header balance={balance} />

      <div className="chart-header" style={{ marginBottom: 14 }}>
        <div className="symbol-toggle">
          {defaultSymbols.map((symbol) => (
            <button
              key={symbol}
              className={selectedSymbol === symbol ? 'active' : ''}
              onClick={() => setSelectedSymbol(symbol)}
            >
              {symbol}
            </button>
          ))}
        </div>

        <div className="timeframe-toggle">
          {defaultTimeframes.map((frame) => (
            <button
              key={frame}
              className={timeframe === frame ? 'active' : ''}
              onClick={() => setTimeframe(frame)}
            >
              {frame}
            </button>
          ))}
        </div>
      </div>

      <div className="dashboard">
        <div>
          <Chart
            symbol={selectedSymbol}
            price={currentPrice}
            candles={currentCandles}
          />
          <Positions positions={positions} />
        </div>

        <div className="side-panel">
          <Watchlist prices={watchlistPrices} />
          <OrderPanel
            symbol={selectedSymbol}
            onSymbolChange={setSelectedSymbol}
            onPlaceOrder={placeOrder}
            quantity={quantity}
            onQuantityChange={setQuantity}
            stopLoss={stopLoss}
            onStopLossChange={setStopLoss}
            takeProfit={takeProfit}
            onTakeProfitChange={setTakeProfit}
            price={currentPrice}
          />
          <div className="card">
            <h3>Connection</h3>
            <p className="muted">{isConnected ? 'Live websocket connected' : 'Connecting...'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
