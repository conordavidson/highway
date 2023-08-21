import { RequestHandler } from 'express';

import * as Z from 'zod';
import * as Params from 'lib/params';

const UpdateBody = Z.object({
  displayName: Z.string(),
});

export const update: RequestHandler = (req, res) => {
  const params = Params.validate(req.body, UpdateBody);

  res.json({ accounts: 'created' });
};
