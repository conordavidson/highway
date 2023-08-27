import * as Models from '@prisma/client';

export type User = Models.User;
export type Comment = Models.Comment;
export type Plate = Models.Plate;

type RequestContext = {
  currentUser: null | User;
};

declare global {
  // eslint-disable-next-line no-unused-vars
  namespace Express {
    // eslint-disable-next-line no-unused-vars
    interface Request {
      context: RequestContext;
    }
  }
}

export type ApiError = InvalidRequestError | UnauthorizedError | NotFoundError | ServerError;

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

export type NotFoundError = {
  type: 'not_found';
  statusCode: 404;
  message: string;
};

export type ServerError = {
  type: 'server_error';
  statusCode: 500;
  message: string;
};
