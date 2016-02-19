'use strict';

// Twilio Service for Sending and Receiving text messages
const twilio = require('twilio');
const Promise = require('bluebird');
const Secrets = require('../config');

const twilioService = {
  sendTextMessage: (textMessage, recipientNumber) => {
  	var twilioClient = twilio(Secrets.TWILIO_ACCOUNT_SID, Secrets.TWILIO_AUTH_TOKEN);

  	twilioClient.messages.create({
  		to: recipientNumber,
  		from: Secrets.TWILIO_SENDER_NUMBER,
  		body: ":)\n\n" + textMessage,
  	}, function(err, message) {
  		console.log(message.sid);
  	});
  }
};

module.exports = twilioService;