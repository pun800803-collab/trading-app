import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer } from 'ws';
import { MockMarketData } from './market/MockMarketData';
import { OrderService } from './trading/OrderService';
import { Position, PriceTick } from './types';

const app = express();
const server = http.createServer(app);
const port = Number(process.env.SERVER_PORT ?? 3001);
const wsPort = Number(process.env.WEBSOCKET_PORT ?? 8081);

const marketData = new MockMarketData();
const orderService = new OrderService();
const wsServer = new WebSocketServer({ server: undefined, port: wsPort });

app.use(cors());
app.use(express.json());

const symbols = ['XAU/USD', 'XAG/USD', 'BTC/USD', 'ETH/USD'] as const;

const getSnapshot = async () => {
  const result = [] as Array<{ symbol: string; price: number; candles: any[]; bid?: number; ask?: number }>;

  for (const symbol of symbols) {
    const candles = await marketData.getHistoricalCandles(symbol, '1H');
    const price = marketData.getCurrentPrice(symbol);
    result.push({
      symbol,
      price,
      candles,
      bid: price * 0.999,
      ask: price * 1.001,
    });
  }

  return result;
};

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/market', async (_req, res) => {
  const snapshot = await getSnapshot();
  res.json(snapshot);
});

app.get('/api/positions', (_req, res) => {
  res.json(orderService.getPositions());
});

app.post('/api/orders', (req, res) => {
  const { symbol, side, quantity, stopLoss, takeProfit } = req.body;
  const price = marketData.getCurrentPrice(symbol);

  const result = orderService.placeOrder({
    symbol,
    side,
    quantity,
    stopLoss,
    takeProfit,
    price,
  });

  if (!result.ok) {
    return res.status(400).json(result);
  }

  const payload = {
    type: 'POSITION_UPDATE',
    payload: orderService.getPositions(),
  };

  wsServer.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(payload));
    }
  });

  return res.json(result);
});

const broadcastPrice = () => {
  symbols.forEach((symbol) => {
    marketData.tick(symbol);
    const price = marketData.getCurrentPrice(symbol);
    const payload: { type: string; payload: PriceTick } = {
      type: 'PRICE_UPDATE',
      payload: {
        symbol,
        price,
        timestamp: Date.now(),
      },
    };

    wsServer.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify(payload));
      }
    });
  });
};

setInterval(broadcastPrice, 2000);

wsServer.on('connection', (socket) => {
  socket.send(JSON.stringify({ type: 'SYSTEM', payload: { message: 'Connected to trading app' } }));
});

server.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
  console.log(`WebSocket server running on ws://localhost:${wsPort}`);
});
