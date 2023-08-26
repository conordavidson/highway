import * as Types from 'lib/types';
import * as Zod from 'zod';

export const InvalidRequest = {
  new(params: object): Types.InvalidRequestError {
    return {
      type: 'invalid_request',
      statusCode: 400,
      params,
    };
  },
  fromZod(zodError: Zod.ZodError) {
    const formatted = zodError.issues.map((issue) => ({
      path: issue.path[0],
      message: issue.message,
    }));
    return InvalidRequest.new(formatted);
  },
};

export const Unathorized = {
  new(message?: string): Types.UnauthorizedError {
    return {
      type: 'unauthorized',
      statusCode: 401,
      message: message || 'No valid API token provided',
    };
  },
};

export const ServerError = {
  new(message: string, meta?: object): Types.ServerError {
    console.log('❗️ Server Error', message, meta);
    return {
      type: 'server_error',
      statusCode: 500,
      message,
    };
  },
};
