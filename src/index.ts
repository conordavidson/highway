import * as Express from 'express';

import * as Config from 'lib/config';
import * as Middleware from 'lib/middleware';
import * as Accounts from 'controllers/accounts';
import * as Sessions from 'controllers/sessions';

const app = Express.default();

app.get('/', (_req, res) => {
  res.json({ highway: 'ok' });
});

app.put('/accounts', [Middleware.authenticated], Accounts.update);
app.post('/sessions', Sessions.create);

app.listen(Config.PORT, () => {
  console.log(`⚡️ Highway is running at http://localhost:${Config.PORT}`);
});
