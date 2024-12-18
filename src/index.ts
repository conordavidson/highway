import 'dotenv/config';

import * as AuthTokens from 'controllers/authTokens';
import * as Config from 'lib/config';
import * as CurrentUser from 'controllers/currentUser';
import * as Express from 'express';
import * as Plates from 'controllers/plates';
import * as Middleware from 'lib/middleware';
import * as SmsVerifications from 'controllers/smsVerifications';
import * as States from 'controllers/states';

const app = Express.default();

const baseMiddleware = [Express.json(), Middleware.initContext];
const authenticatedMiddleware = [...baseMiddleware, Middleware.authenticate];

app.get('/', (_req, res) => {
  res.json({ highway: 'ok' });
});

app.put('/current-user', authenticatedMiddleware, CurrentUser.update);
app.post('/auth-tokens', baseMiddleware, AuthTokens.create);
app.post('/sms-verifications', baseMiddleware, SmsVerifications.create);
app.get('/plates/:id', baseMiddleware, Plates.show);
app.get('/plates', baseMiddleware, Plates.index);
app.get('/states', baseMiddleware, States.index);

app.use(Middleware.handleErrors);

app.listen(Config.PORT, () => {
  console.log(`🛣️ Highway is running at http://localhost:${Config.PORT}`);
});
