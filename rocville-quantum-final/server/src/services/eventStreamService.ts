// Real-time event streaming service for market data, compliance alerts, and AI notifications
import { WebSocket, Server } from 'ws';
import { EventEmitter } from 'events';

export const eventBus = new EventEmitter();

export function createWebSocketServer(server: any) {
  const wss = new Server({ server });

  wss.on('connection', (ws: WebSocket) => {
    ws.send(JSON.stringify({ type: 'connection', message: 'WebSocket connected' }));

    const listener = (event: any) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(event));
      }
    };

    eventBus.on('event', listener);

    ws.on('close', () => {
      eventBus.off('event', listener);
    });
  });

  return wss;
}

// Emit events from anywhere in backend:
// eventBus.emit('event', { type: 'market', data: ... })
// eventBus.emit('event', { type: 'compliance', data: ... })
// eventBus.emit('event', { type: 'ai', data: ... })
