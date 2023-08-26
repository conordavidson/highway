import * as Config from 'lib/config';
import * as Errors from 'lib/errors';
import * as Twilio from 'twilio';

export const client = Twilio.default(Config.TWILIO_ACCOUNT_SID, Config.TWILIO_AUTH_TOKEN);

export const sendSmsOtp = (phoneNumber: string) => {
  return client.verify.v2
    .services(Config.TWILIO_VERIFY_SID)
    .verifications.create({ to: phoneNumber, channel: 'sms' });
};

export const confirmSmsOtp = async (phoneNumber: string, otp: string) => {
  try {
    return await client.verify.v2.services(Config.TWILIO_VERIFY_SID).verificationChecks.create({
      to: phoneNumber,
      code: otp,
    });
  } catch (error: any) {
    if (error.status === 404)
      throw Errors.InvalidRequest.new({
        otp: 'Invalid',
      });
    throw Errors.ServerError.new('SMS OTP Confirmation Failed');
  }
};
