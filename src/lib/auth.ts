import * as Express from 'express';
import * as Errors from 'lib/errors';
import * as Types from 'lib/types';
import * as Db from 'lib/db';

export const ensureUser = (req: Express.Request) => {
  if (req.context.currentUser === null)
    throw Errors.ServerError.new('Current user not available on request context when expected');

  return req.context.currentUser;
};

export const createUserAndToken = (phone: string) => {
  return Db.client.$transaction(async (transaction) => {
    const user = await transaction.user.create({
      data: { phone },
    });

    return await transaction.authToken.create({
      data: { userId: user.id },
      include: { user: true },
    });
  });
};

export const rotateToken = (user: Types.User) => {
  return Db.client.$transaction(async (transaction) => {
    await transaction.authToken.updateMany({
      where: {
        userId: user.id,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });

    return await transaction.authToken.create({
      data: { userId: user.id },
      include: { user: true },
    });
  });
};
