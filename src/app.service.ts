import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
var fetch = require('node-fetch');
//var https = require('follow-redirects').https;
var fs = require('fs');
const axios = require('axios');
const https = require('https');
// const fetch = require('node-fetch');
@Injectable()
export class AppService {
  private twilioClient: Twilio;

  constructor(private readonly configService: ConfigService) {
    const accountSid = configService.get('TWILIO_ACCOUNT_SID');
    const authToken = configService.get('TWILIO_AUTH_TOKEN');

    this.twilioClient = new Twilio(accountSid, authToken);
  }

  getHello(): string {
    return 'Hello World!';
  }

  async sendOtp(phoneNumber: string) {
    // const serviceSid = this.configService.get(
    //   'TWILIO_VERIFICATION_SERVICE_SID',
    // );
    // let msg = 'this is verify code to reset your password';
    // await this.twilioClient.verify.v2
    //   .services(serviceSid) //
    //   .verifications.create({ to: phoneNumber, channel: 'sms' })
    //   .then((verification) => (msg = verification.status));
    // return { msg: msg };

    // var options = {
    //   method: 'POST',
    //   hostname: 'l34ygr.api.infobip.com',
    //   path: '/sms/2/text/advanced',
    //   headers: {
    //     Authorization:
    //       'App e8d34a838d14ec8e400ed32148f5f203-0d687224-3bdc-4d30-9674-2c8cd4628c9b',
    //     'Content-Type': 'application/json',
    //     Accept: 'application/json',
    //   },
    //   maxRedirects: 20,
    // };
    //--------------------------------
    // var req = https.request(options, function (res) {
    //   var chunks = [];

    //   res.on('data', function (chunk) {
    //     chunks.push(chunk);
    //   });

    //   res.on('end', function (chunk) {
    //     var body = Buffer.concat(chunks);
    //     console.log(body.toString());
    //   });

    //   res.on('error', function (error) {
    //     console.error(error);
    //   });
    // });

    // var postData = JSON.stringify({
    //   messages: [
    //     {
    //       destinations: [{ to: '201142852305' }],
    //       from: 'ServiceSMS',
    //       text: 'Hello,\n\nThis is a test message from Infobip. Have a nice day!',
    //     },
    //   ],
    // });

    // req.write(postData);

    // req.end();

    //-------------------------
    var numbers = '&numbers=' + '12013514000';
    var message = '&message=' + 'This is your message';
    var apiKey = 'apikey=' + 'NDE2YTMzMzg0YTM5MzQ2NjY4MzQ0MTZkNDQ0YTc2NTc=';
    var sender = '&sender=' + 'TXTLCL';

    var url =
      'https://api.textlocal.in/send/?' + apiKey + numbers + message + sender;
    //   var options = {
    //   "async": true,
    //   "crossDomain": true,
    //   "method": "GET"
    // }
    //   var response = feUrlFetchApp.fetch(url, options).getContentText();
    //   return response;

    //   const URL = "https://login.XXXXXXXXXXXXX.com.br/api/login"
    //-----------
    // fetch(url, {
    //   body: "{'my_json_data': 'login data'}",
    //   method: 'POST',
    // })
    //   .then((res) => res.text())
    //   .then((body) => console.log(JSON.parse(body)));
    //--------------------------------

    //const domain = 'https://atlas.microsoft.com';

    //create axios instance
    return axios.create({
      baseURL: url,
      timeout: 60000, //optional
      httpsAgent: new https.Agent({ keepAlive: true }),
      headers: { 'Content-Type': 'application/xml' },
    });
  }

  async verifyOtp(phoneNumber: string, code: string) {
    // const serviceSid = this.configService.get(
    //   'TWILIO_VERIFICATION_SERVICE_SID',
    // );
    // let msg = '';
    // await this.twilioClient.verify.v2
    //   .services(serviceSid)
    //   .verificationChecks.create({ to: phoneNumber, code: code })
    //   .then((verification) => (msg = verification.status));
    // return { msg: msg };
  }
}
