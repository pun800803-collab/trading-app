import WebSocket, { WebSocketServer } from 'ws';
import { PriceTick, Position, BroadcastMessage } from '../types';

export class TradingWebSocketServer {
  private readonly server: WebSocketServer;

  constructor(port: number) {
    this.server = new WebSocketServer({ port });
    this.server.on('connection', (socket) => {
      socket.on('message', (msg) => {
        console.log('WS message received:', msg.toString());
      });
    });
  }

  public broadcast(message: BroadcastMessage): void {
    const payload = JSON.stringify(message);
    this.server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }

  public close(): void {
    this.server.close();
  }
}
