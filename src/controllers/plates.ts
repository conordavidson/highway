import * as Db from 'lib/db';
import * as Errors from 'lib/errors';
import * as Express from 'express';
import * as Params from 'lib/params';
import * as Plates from 'lib/plates';
import * as Tree from 'lib/tree';
import * as Z from 'zod';

export const show: Express.RequestHandler = async (req, res) => {
  const plate = await Db.client.plate.findFirst({
    where: {
      id: req.params.id,
    },
    include: {
      comments: true,
    },
  });

  if (!plate) throw Errors.NotFound.new('Plate');

  res.json({
    plate: {
      ...plate,
      comments: Tree.make(plate?.comments),
    },
  });
  return;
};

const IndexParams = Z.object({
  stateId: Z.string().uuid(),
  value: Z.string(),
});

export const index: Express.RequestHandler = async (req, res) => {
  const params = Params.validate(req.query, IndexParams);

  const { status, plate } = await Plates.findOrCreate(params.stateId, params.value);

  console.log('plate', status, plate);

  /*
  If we just created the plate, there won't be any comments for it
  just yet, so we just return an empty array.
  */
  if (status === 'created') {
    res.json({ plate: { ...plate, comments: [] } });
    return;
  }

  res.json({
    plate: {
      ...plate,
      comments: Tree.make(plate.comments),
    },
  });
  return;
};
