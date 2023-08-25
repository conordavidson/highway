import * as Express from 'express';
import * as Z from 'zod';
import * as Params from 'lib/params';
import * as Auth from 'lib/auth';
import * as Db from 'lib/db';
import * as Tree from 'lib/tree';

const CreateBody = Z.object({
  plateId: Z.string().uuid(),
  parentId: Z.string().uuid().optional(),
  content: Z.string().min(2),
  rating: Z.number().min(1).max(5),
});

export const create: Express.RequestHandler = async (req, res) => {
  const params = Params.validate(req.body, CreateBody);
  const currentUser = Auth.ensureUser(req);

  await Db.client.comment.create({
    data: {
      userId: currentUser.id,
      plateId: params.plateId,
      parentId: params.parentId,
      content: params.content,
      rating: params.rating,
    },
  });

  const comments = await Db.client.comment.findMany({
    where: { plateId: params.plateId },
  });

  res.json({ comments: Tree.make(comments) });
};

const IndexParams = Z.object({
  plateId: Z.string().uuid().optional(),
});

export const index: Express.RequestHandler = async (req, res) => {
  const params = Params.validate(req.params, IndexParams);

  if (params.plateId) {
    const plateComments = await Db.client.comment.findMany({
      where: { plateId: params.plateId },
    });

    res.json({ comments: Tree.make(plateComments) });
    return;
  }

  const allComments = await Db.client.comment.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 10,
    include: { plate: true },
  });

  res.json({ comments: allComments });
};
