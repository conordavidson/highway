import * as Express from 'express';
import * as Db from 'lib/db';
import * as Types from 'lib/types';

const bearerTokenRegex = /Bearer\s[\d|a-f]{8}-[\d|a-f]{4}-[\d|a-f]{4}-[\d|a-f]{4}-[\d|a-f]{12}/;

export const authenticated: Express.RequestHandler = async (req, res, next) => {
  const authHeader = req.headers['authorization'] as string;
  if (!authHeader) return res.status(401).json({ error: 'Authorization header required' });

  const match = authHeader.match(bearerTokenRegex);

  if (!match)
    return res
      .status(401)
      .json({ error: `Authorization header must conform to Bearer {{ Auth Token }} format` });

  const token = match[1];

  const authToken = await Db.client.authToken.findFirst({
    where: { token, revokedAt: null },
    include: { user: true },
  });

  if (!authToken) return res.status(401).json({ error: `Invalid Bearer token` });

  // @ts-ignore
  req.currentUser = authToken.user;

  next();
};
