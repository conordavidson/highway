import * as Db from 'lib/db';
import * as Errors from 'lib/errors';
import * as Express from 'express';
import * as Types from 'lib/types';

const bearerTokenRegex = /Bearer\s([\d|a-f]{8}-[\d|a-f]{4}-[\d|a-f]{4}-[\d|a-f]{4}-[\d|a-f]{12})/;

export const initContext: Express.RequestHandler = (req, _res, next) => {
  // eslint-disable-next-line fp/no-mutation
  req.context = {
    currentUser: null,
  };
  next();
};

export const authenticate: Express.RequestHandler = async (req, _res, next) => {
  const authHeader = req.headers['authorization'] as string;
  if (!authHeader) throw Errors.Unathorized.new(`Authorization header required`);

  const match = authHeader.match(bearerTokenRegex);
  if (!match)
    throw Errors.Unathorized.new(
      `Authorization header must conform to Bearer {{ Auth Token }} format`,
    );

  const token = match[1];
  const authToken = await Db.client.authToken.findFirst({
    where: { token, revokedAt: null },
    include: { user: true },
  });
  if (!authToken) throw Errors.Unathorized.new(`Invalid API token`);

  // eslint-disable-next-line fp/no-mutation
  req.context.currentUser = authToken.user;

  next();
};

export const handleErrors: Express.ErrorRequestHandler = (error: Types.ApiError, _req, res) => {
  switch (error.type) {
    case 'invalid_request':
      return res.status(error.statusCode).json({
        type: error.type,
        message: 'Request parameters are invalid.',
        params: error.params,
      });
    case 'unauthorized':
      return res.status(error.statusCode).json({
        type: error.type,
        message: error.message,
      });
    case 'not_found':
      return res.status(error.statusCode).json({
        type: error.type,
        message: error.message,
      });
    default:
      console.log('[API ERROR]', error);
      return res.status(500).json({
        name: 'api_error',
        message: 'Server error. Our team has been notified. Please try again.',
      });
  }
};
