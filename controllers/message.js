'use strict';

//3rd
const express = require('express');
const router = express.Router();

//util
const HttpStatus = require('../util/HttpStatus');
const sendServerError = require('../util/sendServerError');
const sendSuccess = require('../util/sendSuccess');

const Secrets = require('../config');

//services
const witService = require('../services/witService');
const twilioService = require('../services/twilioService');

router.post('/', (req, res) => {
  if (!req.body.text) {
    sendServerError(HttpStatus.BAD_REQUEST, 
      "Must specify 'text' post param");
      return;
  }

  witService.getIntent(req.body.text)
    .then(result => sendSuccess(res, result))
    .catch(err => sendServerError(res, undefined, err));
});

router.post('/get_message', (req, res) => {
  if (!req.body.Body) {
    console.error('Received request without Body message');
  } else if (!req.body.From) {
    console.error('Received request without From phone number');
  } else {
    console.log(`Replying to request [ ${req.body.Body} ] from ${req.body.From} ...`);
    twilioService.sendTextMessage(`Re: ${req.body.Body}`, req.body.From);
    console.log(`Reply sent to ${req.body.From}.`);
  }
});

router.get('/send_message', (req, res) => {
  if (!req.body.text) {
    sendServerError(HttpStatus.BAD_REQUEST,
      "Must specify 'textMessage' post param");
    return;
  }

  twilioService.sendTextMessage(req.body.text, '+18606904954');
  res.send(req.body.text);
});

module.exports = router;
