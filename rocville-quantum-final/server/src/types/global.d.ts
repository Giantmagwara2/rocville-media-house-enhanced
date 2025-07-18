import { WebSocket } from 'ws';
import { EventEmitter } from 'events';

declare global {
  export type WebSocketClient = WebSocket & EventEmitter;
}
