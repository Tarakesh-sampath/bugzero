import { Response, NextFunction, Request } from 'express';
import { AuthenticatedRequest } from '../types/index.js';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.setHeader('WWW-Authenticate', 'Basic realm="BugZero"');
    return res.status(401).json({ error: 'Authentication required' });
  }

  const [type, credentials] = authHeader.split(' ');

  if (type !== 'Basic' || !credentials) {
    return res.status(401).json({ error: 'Invalid authentication type' });
  }

  const decoded = Buffer.from(credentials, 'base64').toString('utf-8');
  const parts = decoded.split(':');
  const username = parts[0];
  const password = parts.slice(1).join(':');

  const SHARED_PASSWORD = process.env.SHARED_PASSWORD;

  if (!username || !password || password !== SHARED_PASSWORD) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Cast to AuthenticatedRequest to safely attach username
  (req as AuthenticatedRequest).username = username;
  next();
};
