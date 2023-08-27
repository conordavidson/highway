import * as Auth from 'lib/auth';
import * as Db from 'lib/db';
import * as Express from 'express';
import * as Params from 'lib/params';
import * as Plates from 'lib/plates';
import * as Tree from 'lib/tree';
import * as Z from 'zod';

const CreateBody = Z.object({
  stateId: Z.string().uuid(),
  plateValue: Z.string(),
  parentId: Z.string().uuid().optional(),
  content: Z.string().min(2),
  rating: Z.number().min(1).max(5),
});

export const create: Express.RequestHandler = async (req, res) => {
  const params = Params.validate(req.body, CreateBody);
  const currentUser = Auth.ensureUser(req);
  const { plate } = await Plates.findOrCreate(params.stateId, params.plateValue);

  await Db.client.comment.create({
    data: {
      userId: currentUser.id,
      plateId: plate.id,
      parentId: params.parentId,
      content: params.content,
      rating: params.rating,
    },
  });

  const comments = await Db.client.comment.findMany({
    where: { plateId: plate.id },
  });

  res.json({ comments: Tree.make(comments) });
};

export const index: Express.RequestHandler = async (req, res) => {
  const allComments = await Db.client.comment.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 10,
    include: { plate: true },
  });
  res.json({ comments: allComments });
};
