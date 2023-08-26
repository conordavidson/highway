import * as Db from 'lib/db';
import * as Express from 'express';

export const index: Express.RequestHandler = async (req, res) => {
  const states = await Db.client.state.findMany();
  res.json({ states });
};
