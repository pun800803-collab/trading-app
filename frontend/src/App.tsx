import { useEffect, useRef } from 'react';
import { ColorType, createChart, IChartApi, ISeriesApi, CandlestickData, UTCTimestamp } from 'lightweight-charts';
import type { Candle, SymbolName } from '../../../shared/types';

interface ChartProps {
  symbol: SymbolName;
  candles: Candle[];
  price: number;
}

export function Chart({ symbol, candles, price }: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0d1320' },
        textColor: '#dbeafe',
      },
      grid: {
        vertLines: { color: '#1e293b' },
        horzLines: { color: '#1e293b' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
      crosshair: { mode: 0 },
      rightPriceScale: { borderColor: '#334155' },
      timeScale: { borderColor: '#334155' },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    const prepared = candles.map((c) => ({
      time: (c.time / 1000) as UTCTimestamp,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));

    candleSeries.setData(prepared as CandlestickData[]);
    chart.timeScale().fitContent();

    chartRef.current = chart;
    seriesRef.current = candleSeries;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [symbol]);

  useEffect(() => {
    if (!seriesRef.current) return;

    const data = candles.map((c) => ({
      time: (c.time / 1000) as UTCTimestamp,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    })) as CandlestickData[];

    seriesRef.current.setData(data);
  }, [candles]);

  return (
    <div className="chart-panel card">
      <div className="chart-header">
        <h3>{symbol}</h3>
        <span className={price >= 0 ? 'up' : 'down'}>{price.toLocaleString()}</span>
      </div>
      <div ref={chartContainerRef} className="chart-wrap" />
    </div>
  );
}
