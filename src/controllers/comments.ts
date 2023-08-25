import * as Express from 'express';
import * as Z from 'zod';
import * as Params from 'lib/params';
import * as Auth from 'lib/auth';
import * as Db from 'lib/db';
import * as Tree from 'lib/tree';
import * as Plates from 'lib/plates';

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

const IndexParams = Z.object({
  plateId: Z.string().uuid().optional(),
  stateId: Z.string().uuid().optional(),
  plateValue: Z.string().optional(),
});

export const index: Express.RequestHandler = async (req, res) => {
  const params = Params.validate(req.params, IndexParams);

  /*
  If a Plate ID is passed, we'll look up comments by it.
  */
  if (params.plateId) {
    const plateComments = await Db.client.comment.findMany({
      where: { plateId: params.plateId },
    });
    res.json({ comments: Tree.make(plateComments) });
    return;
  }

  /*
  If State ID and Plate Value is passed, we'll find or create a Plate,
  then look up.
  */
  if (params.stateId && params.plateValue) {
    const { status, plate } = await Plates.findOrCreate(params.stateId, params.plateValue);

    /*
    If we just created the plate, there won't be any comments for it
    just yet, so we just return an empty array.
    */
    if (status === 'created') {
      res.json({ comments: [] });
      return;
    }

    const plateComments = await Db.client.comment.findMany({
      where: { plateId: plate.id },
    });
    res.json({ comments: Tree.make(plateComments) });
    return;
  }

  /*
  Otherwise, we'll look up the 10 most recent Comments, for all Plates.
  */
  const allComments = await Db.client.comment.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 10,
    include: { plate: true },
  });
  res.json({ comments: allComments });
};
