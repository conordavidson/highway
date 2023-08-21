import * as Db from 'lib/db';

const run = async () => {
  const userOne = await Db.client.user.create({
    data: {
      displayName: 'luckyduck',
      phone: '+12489722094',
    },
  });

  await Db.client.authToken.create({
    data: {
      userId: userOne.id,
    },
  });
};

run();
