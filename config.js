'use strict';

//Secret stuffs here. like access tokens and api keys

const Secrets = {
  WIT_ACCESS_TOKEN: process.env.WIT_ACCESS_TOKEN,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_SENDER_NUMBER: process.env.TWILIO_SENDER_NUMBER,
  MEETUP_TOKEN: process.env.MEETUP_TOKEN
};

module.exports = Secrets;

