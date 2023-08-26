import * as Errors from 'lib/errors';
import * as Express from 'express';
import * as Zod from 'zod';

export const validate = <TBody>(body: Express.Request['body'], parser: Zod.ZodType<TBody>) => {
  const parsed = parser.safeParse(body);
  if (parsed.success) return parsed.data;
  throw Errors.InvalidRequest.fromZod(parsed.error);
};
