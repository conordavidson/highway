import { RequestHandler } from 'express';

export const create: RequestHandler = (req, res) => {
  res.json({ sessions: 'created' });
};
