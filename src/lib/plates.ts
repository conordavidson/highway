import * as Db from 'lib/db';
import * as Errors from 'lib/errors';
import * as Types from 'lib/types';

type FindOrCreatePlate = {
  status: 'found' | 'created';
  plate: Types.Plate;
};

export const findOrCreate = async (
  stateId: string,
  plateValue: string,
): Promise<FindOrCreatePlate> => {
  const alphanumericOnly = plateValue.replace(/\W/g, '');
  const capitalized = alphanumericOnly.toUpperCase();
  if (capitalized.length < 1 || capitalized.length > 7)
    throw Errors.InvalidRequest.new({
      value: 'Invalid',
    });

  const found = await Db.client.plate.findFirst({
    where: {
      stateId,
      value: capitalized,
    },
  });

  if (found)
    return {
      status: 'found',
      plate: found,
    };

  const created = await Db.client.plate.create({
    data: {
      stateId,
      value: capitalized,
    },
  });

  return {
    status: 'created',
    plate: created,
  };
};
