import { randomUUID } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';

type Handler = (req: VercelRequest, res: VercelResponse) => unknown | Promise<unknown>;

type SentryContext = {
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
  req?: VercelRequest;
};

const parseDsn = (dsn: string) => {
  try {
    const parsed = new URL(dsn);
    const projectId = parsed.pathname.replace(/^\//, '').split('/').pop();
    if (!projectId) return null;
    return {
      host: parsed.host,
      projectId,
      publicKey: parsed.username,
      protocol: parsed.protocol,
    };
  } catch {
    return null;
  }
};

const serializeError = (error: unknown) => {
  if (error instanceof Error) {
    return {
      type: error.name,
      value: error.message,
      stacktrace: error.stack
        ? { frames: error.stack.split('\n').slice(1).map((line) => ({ filename: line.trim() })).reverse() }
        : undefined,
    };
  }
  return { type: 'Error', value: typeof error === 'string' ? error : JSON.stringify(error) };
};

export const initSentryServer = () => Boolean(process.env.SENTRY_DSN);

export const captureException = async (error: unknown, context: SentryContext = {}) => {
  const dsn = process.env.SENTRY_DSN;
  const parsed = dsn ? parseDsn(dsn) : null;
  if (!dsn || !parsed) return;

  try {
    const eventId = randomUUID();
    const now = new Date().toISOString();
    const req = context.req;
    const event = {
      event_id: eventId.replace(/-/g, ''),
      timestamp: now,
      platform: 'javascript',
      environment: process.env.SENTRY_ENVIRONMENT || process.env.SENTRY_ENV || 'production',
      level: 'error',
      exception: { values: [serializeError(error)] },
      request: req ? {
        method: req.method,
        url: req.url,
        headers: {
          'user-agent': req.headers['user-agent'],
          referer: req.headers.referer,
        },
      } : undefined,
      tags: context.tags,
      extra: context.extra,
    };

    const envelopeHeader = JSON.stringify({ event_id: event.event_id, sent_at: now, dsn });
    const itemHeader = JSON.stringify({ type: 'event' });
    const body = `${envelopeHeader}\n${itemHeader}\n${JSON.stringify(event)}`;
    await fetch(`${parsed.protocol}//${parsed.host}/api/${parsed.projectId}/envelope/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-sentry-envelope' },
      body,
    });
  } catch (captureError) {
    console.error('SENTRY_CAPTURE_ERROR', captureError);
  }
};

export const wrapHandler = (handler: Handler, tags: Record<string, string> = {}) => async (req: VercelRequest, res: VercelResponse) => {
  initSentryServer();
  try {
    return await handler(req, res);
  } catch (error) {
    await captureException(error, { req, tags });
    console.error('API_UNHANDLED_ERROR', error);
    if (!res.headersSent) return res.status(500).json({ error: 'Internal server error' });
    throw error;
  }
};
