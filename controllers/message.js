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

//biz
const intentRouter = require('../business/intentRouter'); 

router.post('/', (req, res) => {
  if (!req.body.text) {
    sendServerError(HttpStatus.BAD_REQUEST, 
      "Must specify 'text' post param");
      return;
  }

  witService.getIntent(req.body.text)
    .then(result => intentRouter.getIntent(result))
    .then(outcomes => intentRouter.processOutcomes(outcomes))
    .then(message => sendSuccess(res, message.text))
    .catch(err => sendServerError(res, undefined, err));
});

module.exports = router;
