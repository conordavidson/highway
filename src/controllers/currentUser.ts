import * as Express from 'express';
import * as Z from 'zod';
import * as Params from 'lib/params';
import * as Auth from 'lib/auth';
import * as Db from 'lib/db';

const UpdateBody = Z.object({
  displayName: Z.string().min(2).max(20),
});

export const update: Express.RequestHandler = async (req, res) => {
  const params = Params.validate(req.body, UpdateBody);

  const currentUser = Auth.ensureUser(req);

  const updatedUser = await Db.client.user.update({
    where: { id: currentUser.id },
    data: { displayName: params.displayName },
  });

  res.json({ currentUser: updatedUser });
};
