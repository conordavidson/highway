import * as Zod from 'zod';

type ValidationError = {
  name: 'ValidationError';
  statusCode: 400;
  params: object;
};

export const Validation = {
  new(params: object): ValidationError {
    return {
      name: 'ValidationError',
      statusCode: 400,
      params,
    };
  },
  fromZod(zodError: Zod.ZodError) {
    const formatted = zodError.issues.map((issue) => ({
      path: issue.path[0],
      message: issue.message,
    }));
    return Validation.new(formatted);
  },
};
