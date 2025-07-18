// Express middleware to enforce HTTPS
import { Request, Response, NextFunction } from 'express';

export function enforceHTTPS(req: Request, res: Response, next: NextFunction) {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(301, 'https://' + req.headers.host + req.url);
  }
  next();
}
