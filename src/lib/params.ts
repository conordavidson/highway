import * as Zod from 'zod';
import * as Express from 'express';
import * as Errors from 'lib/errors';

export const validate = <TBody>(body: Express.Request['body'], parser: Zod.ZodType<TBody>) => {
  const parsed = parser.safeParse(body);
  if (parsed.success) return parsed;
  throw Errors.Validation.fromZod(parsed.error);
};
