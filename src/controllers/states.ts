import * as Express from 'express';
import * as Db from 'lib/db';

export const index: Express.RequestHandler = async (req, res) => {
  const states = await Db.client.state.findMany();
  res.json({ states });
};
