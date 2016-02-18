'use strict';

//Secret stuffs here. like access tokens and api keys

const Secrets = {
  WIT_ACCESS_TOKEN: process.env.WIT_ACCESS_TOKEN,
  TWILIO_AUTH_TOKEN: process.env.TWILLIO_AUTH_TOKEN,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID
};

module.exports = Secrets;

