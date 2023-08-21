import 'dotenv/config';

import * as Express from 'express';
import * as Config from 'lib/config';
import * as Middleware from 'lib/middleware';
import * as CurrentUser from 'controllers/currentUser';
import * as AuthTokens from 'controllers/authTokens';
import * as SmsVerifications from 'controllers/smsVerifications';

const app = Express.default();

const baseMiddleware = [Express.json(), Middleware.initContext];
const authenticatedMiddleware = [...baseMiddleware, Middleware.authenticate];

app.get('/', (_req, res) => {
  res.json({ highway: 'ok' });
});

app.put('/current-user', authenticatedMiddleware, CurrentUser.update);
app.post('/auth-tokens', baseMiddleware, AuthTokens.create);
app.post('/sms-verifications', baseMiddleware, SmsVerifications.create);

app.use(Middleware.handleErrors);

app.listen(Config.PORT, () => {
  console.log(`🛣️ Highway is running at http://localhost:${Config.PORT}`);
});
