import { RequestHandler } from 'express';

import * as Z from 'zod';

const SmsVerificationsCreateBody = Z.object({
  phone: Z.string(),
});

export const create: RequestHandler = (req, res) => {
  res.json({ accounts: 'created' });
};
