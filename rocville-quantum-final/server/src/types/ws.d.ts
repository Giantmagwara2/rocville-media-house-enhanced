declare module 'ws' {
  import { EventEmitter } from 'events';
  import { IncomingMessage } from 'http';
  import { Duplex } from 'stream';

  class WebSocket extends EventEmitter {
    static Server: typeof Server;
    static createServer(options: ServerOptions): Server;
    
    constructor(address: string, options?: ClientOptions);
    
    CONNECTING: 0;
    OPEN: 1;
    CLOSING: 2;
    CLOSED: 3;
    
    readyState: number;
    protocol: string;
    
    close(code?: number, data?: string | Buffer): void;
    ping(data?: any, mask?: boolean, cb?: (err: Error) => void): void;
    pong(data?: any, mask?: boolean, cb?: (err: Error) => void): void;
    send(data: any, cb?: (err?: Error) => void): void;
    send(data: any, options: { mask?: boolean; binary?: boolean; compress?: boolean }, cb?: (err?: Error) => void): void;
    
    terminate(): void;
  }

  class Server extends EventEmitter {
    constructor(options?: ServerOptions, callback?: () => void);
    
    clients: Set<WebSocket>;
    
    close(cb?: (err?: Error) => void): void;
    handleUpgrade(request: IncomingMessage, socket: Duplex, upgradeHead: Buffer, callback: (client: WebSocket) => void): void;
    shouldHandle(request: IncomingMessage): boolean;
  }

  interface ServerOptions {
    host?: string;
    port?: number;
    backlog?: number;
    server?: any;
    verifyClient?: VerifyClientCallbackAsync | VerifyClientCallbackSync;
    handleProtocols?: any;
    path?: string;
    noServer?: boolean;
    clientTracking?: boolean;
    perMessageDeflate?: boolean | PerMessageDeflateOptions;
    maxPayload?: number;
  }

  interface ClientOptions {
    protocol?: string;
    followRedirects?: boolean;
    handshakeTimeout?: number;
    maxRedirects?: number;
    perMessageDeflate?: boolean | PerMessageDeflateOptions;
    localAddress?: string;
    protocolVersion?: number;
    headers?: { [key: string]: string };
    origin?: string;
    agent?: any;
    host?: string;
    family?: number;
    checkServerIdentity?: Function;
    rejectUnauthorized?: boolean;
    maxPayload?: number;
  }

  interface PerMessageDeflateOptions {
    serverNoContextTakeover?: boolean;
    clientNoContextTakeover?: boolean;
    serverMaxWindowBits?: number;
    clientMaxWindowBits?: number;
    zlibInflateOptions?: {
      chunkSize?: number;
      windowBits?: number;
      level?: number;
      memLevel?: number;
      strategy?: number;
      dictionary?: Buffer | Buffer[] | DataView;
    };
    zlibDeflateOptions?: {
      chunkSize?: number;
      windowBits?: number;
      level?: number;
      memLevel?: number;
      strategy?: number;
      dictionary?: Buffer | Buffer[] | DataView;
    };
    threshold?: number;
    concurrencyLimit?: number;
  }

  type VerifyClientCallbackAsync = (info: { origin: string; secure: boolean; req: IncomingMessage }, callback: (res: boolean, code?: number, message?: string) => void) => void;
  type VerifyClientCallbackSync = (info: { origin: string; secure: boolean; req: IncomingMessage }) => boolean;

  export = WebSocket;
}
