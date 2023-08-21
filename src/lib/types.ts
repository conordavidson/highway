import * as Models from '@prisma/client';

export type User = Models.User;

type RequestContext = {
  currentUser: null | User;
};

declare global {
  namespace Express {
    interface Request {
      context: RequestContext;
    }
  }
}

export type ApiError = InvalidRequestError | UnauthorizedError | ServerError;

export type InvalidRequestError = {
  type: 'invalid_request';
  statusCode: 400;
  params: object;
};

export type UnauthorizedError = {
  type: 'unauthorized';
  statusCode: 401;
  message: string;
};

export type ServerError = {
  type: 'server_error';
  statusCode: 500;
  message: string;
};
