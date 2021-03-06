'use strict';

//3rd
const express = require('express');
const router = express.Router();

//util
const HttpStatus = require('../util/HttpStatus');
const sendServerError = require('../util/sendServerError');
const sendSuccess = require('../util/sendSuccess');

//services
const witService = require('../services/witService');
const twilioService = require('../services/twilioService');

//biz
const intentRouter = require('../business/intentRouter'); 

function getReplyMessage(textMessage, opts) {
  return witService.getIntent(textMessage)
    .then(result => intentRouter.getIntent(result))
    .then(outcomes => intentRouter.processOutcomes(outcomes, opts));
}


router.post('/', (req, res) => {
  if (!req.body.text) {
    sendServerError(HttpStatus.BAD_REQUEST, 
      "Must specify 'text' post param");
      return;
  }

  const opts = { phone: req.body.From };
  getReplyMessage(req.body.text, opts)
    .then(message => sendSuccess(res, message.text))
    .catch(err => sendServerError(res, undefined, err));
});

router.post('/get_message', (req, res) => {
  if (!req.body.Body) {
    console.error('Received request without Body message');
  } else if (!req.body.From) {
    console.error('Received request without From phone number');
  } else {
    const opts = { phone: req.body.From };
    getReplyMessage(req.body.Body, opts)
      .then(message => {
          console.log(`Replying to request [ ${req.body.Body} ] from ${req.body.From} with [ ${message.text} ] ...`);
          twilioService.sendTextMessage(message.text, req.body.From);
          console.log(`Reply sent to ${req.body.From}.`);
          sendSuccess(res, undefined);
        }
      )
      .catch(err => {
        console.error(`Error received from processing [ ${req.body.Body} ] from ${req.body.From}`);
        sendServerError(res, undefined, err);
      });
  }
});

router.get('/send_message', (req, res) => {
  if (!req.body.text) {
    sendServerError(res, HttpStatus.BAD_REQUEST,
      "Must specify 'text' post param");
    return;
  }

  twilioService.sendTextMessage(req.body.text, '+18606904954');
  res.send(req.body.text);
});

module.exports = router;
