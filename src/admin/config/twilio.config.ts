import { registerAs } from '@nestjs/config';

export default registerAs('twilio', () => ({
  accountSid: 'AC55a59221acb23a5aa6f046740bb73317',
  authToken: '270ff32fe16828869dc30e0c6926fa9e',
}));
