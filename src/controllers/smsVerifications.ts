import * as Express from 'express';
import * as Z from 'zod';
import * as Params from 'lib/params';
import * as Twilio from 'lib/twilio';
import * as Errors from 'lib/errors';

const CreateBody = Z.object({
  phone: Z.string().regex(/^\+?[1-9]\d{1,14}$/),
});

export const create: Express.RequestHandler = async (req, res) => {
  const params = Params.validate(req.body, CreateBody);

  const result = await Twilio.sendSmsOtp(params.phone);

  if (result.status !== 'pending')
    throw Errors.ServerError.new('Twilio phone number verification unexpected state', { result });

  res.json({
    smsVerification: {
      status: result.status,
      to: result.to,
    },
  });
};
