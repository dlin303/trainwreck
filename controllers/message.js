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

function getReplyMessage(textMessage) {
  return witService.getIntent(textMessage)
    .then(result => intentRouter.getIntent(result))
    .then(outcomes => intentRouter.processOutcomes(outcomes));
}


router.post('/', (req, res) => {
  if (!req.body.text) {
    sendServerError(HttpStatus.BAD_REQUEST, 
      "Must specify 'text' post param");
      return;
  }

  getReplyMessage(req.body.text)
    .then(message => sendSuccess(res, message.text))
    .catch(err => sendServerError(res, undefined, err));
});

router.post('/get_message', (req, res) => {
  if (!req.body.Body) {
    console.error('Received request without Body message');
  } else if (!req.body.From) {
    console.error('Received request without From phone number');
  } else {
    console.log(`Replying to request [ ${req.body.Body} ] from ${req.body.From} ...`);

    getReplyMessage(req.body.Body)
      .then(message =>
        twilioService.sendTextMessage(message.text, req.body.From)
      )
      .catch(err => 
        console.error(`Error received from processing [ ${req.body.Body} ] from ${req.body.From}`)
      );

    console.log(`Reply sent to ${req.body.From}.`);
  }
});

router.get('/send_message', (req, res) => {
  if (!req.body.text) {
    sendServerError(res, HttpStatus.BAD_REQUEST,
      "Must specify 'textMessage' post param");
    return;
  }

  twilioService.sendTextMessage(req.body.text, '+18606904954');
  res.send(req.body.text);
});

module.exports = router;
