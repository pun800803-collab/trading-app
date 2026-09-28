# Trading App MVP

A TradingView-style paper-trading application for **XAU/USD, XAG/USD, BTC/USD, and ETH/USD**.

## Tech Stack

* React + TypeScript
* TradingView Lightweight Charts
* Node.js + Express + TypeScript
* PostgreSQL
* Native WebSocket
* Paper trading

## Features

* Candlestick charts
* 1H, 3H, and 1D timeframes
* XAU/USD
* XAG/USD
* BTC/USD
* ETH/USD
* Live simulated price updates
* Watchlist
* Buy/Sell order panel
* Paper positions
* Stop-loss and take-profit
* Balance and P&L
* EMA
* RSI
* MACD
* Basic risk management

## Architecture

```text
React Frontend
      │
      ├── TradingView Lightweight Charts
      ├── Watchlist
      ├── Order Panel
      └── Positions
              │
              ▼
       WebSocket / REST
              │
              ▼
     Node.js + Express
              │
      ┌───────┴────────┐
      ▼                ▼
Market Data        Paper Trading
Provider           + Risk Manager
      │                │
      └───────┬────────┘
              ▼
          PostgreSQL
```

## Market Data

The MVP uses simulated market data.

The market-data layer is designed around a provider interface so a real market-data provider can be connected later without rewriting the chart application.

## Trading

The MVP is **paper trading only**.

No real orders are sent to a broker.

The trading system supports:

* Market buy
* Market sell
* Position tracking
* Entry
* Stop-loss and take-profit management

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up PostgreSQL database
4. Start backend: `npm run dev --workspace=backend`
5. Start frontend: `npm run dev --workspace=frontend`

See detailed setup instructions in the respective `frontend/README.md` and `backend/README.md`.

## Project Structure

```
trading-app/
├── frontend/           # React + TypeScript
├── backend/            # Node + Express + TypeScript
├── shared/             # Shared types
├── database/           # PostgreSQL schema
└── package.json        # Root workspace
```

## License

MIT
