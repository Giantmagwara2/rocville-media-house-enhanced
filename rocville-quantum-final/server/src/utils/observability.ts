// Observability hooks: tracing, logging, metrics
import { logger } from './logger';

export function traceRequest(req, res, next) {
  const traceId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  req.traceId = traceId;
  logger.info(`[TRACE] ${traceId} ${req.method} ${req.originalUrl}`);
  res.setHeader('X-Trace-Id', traceId);
  next();
}

export function logMetric(name: string, value: string | number, tags: Record<string, string> = {}) {
  logger.info(`[METRIC] ${name} value=${value} tags=${JSON.stringify(tags)}`);
}

export function logError(error: Error, context: any = {}) {
  logger.error(`[ERROR] ${error.message} context=${JSON.stringify(context)}`);
}
