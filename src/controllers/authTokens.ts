import * as Auth from 'lib/auth';
import * as Db from 'lib/db';
import * as Errors from 'lib/errors';
import * as Express from 'express';
import * as Params from 'lib/params';
import * as Twilio from 'lib/twilio';
import * as Z from 'zod';

const CreateBody = Z.object({
  phone: Z.string().regex(/^\+?[1-9]\d{1,14}$/),
  otp: Z.string().length(6),
});

export const create: Express.RequestHandler = async (req, res) => {
  const params = Params.validate(req.body, CreateBody);

  const result = await Twilio.confirmSmsOtp(params.phone, params.otp);

  if (result.status !== 'approved')
    throw Errors.ServerError.new('Twilio phone number verification unexpected state', { result });

  const existingUser = await Db.client.user.findFirst({
    where: {
      phone: result.to,
    },
  });

  /*
  If an existing user already exists for this phone number,
  we create a new token for them and return.
  */
  if (existingUser) {
    const authToken = await Auth.rotateToken(existingUser);
    return res.status(201).json({ authToken });
  }

  /*
  Otherwise, we'll create a new user and token.
  */
  const authToken = await Auth.createUserAndToken(result.to);
  return res.status(201).json({ authToken });
};
