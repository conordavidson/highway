import * as Express from 'express';
import * as Models from '@prisma/client';

export interface ApiRequest extends Express.Request {
  currentUser: null | Models.User;
}
