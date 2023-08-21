const getEnv = (key: string, value: undefined | string) => {
  if (!value) throw `❗️ Environment variable (${key}) not present`;
  return value;
};

export const PORT = 3000;

export const TWILIO_ACCOUNT_SID = getEnv('TWILIO_ACCOUNT_SID', process.env['TWILIO_ACCOUNT_SID']);
export const TWILIO_AUTH_TOKEN = getEnv('TWILIO_AUTH_TOKEN', process.env['TWILIO_AUTH_TOKEN']);
export const TWILIO_VERIFY_SID = getEnv('TWILIO_VERIFY_SID', process.env['TWILIO_VERIFY_SID']);
