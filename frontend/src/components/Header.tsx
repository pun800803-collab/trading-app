type MessageHandler = (message: any) => void;

export class TradingWebSocketClient {
  private socket: WebSocket | null = null;
  private readonly onMessage: MessageHandler;

  constructor(url: string, onMessage: MessageHandler) {
    this.onMessage = onMessage;
    this.connect(url);
  }

  private connect(url: string): void {
    this.socket = new WebSocket(url);

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.onMessage(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message', error);
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error', error);
    };
  }

  send(payload: unknown): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(payload));
    }
  }

  close(): void {
    this.socket?.close();
  }
}
