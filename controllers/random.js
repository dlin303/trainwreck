'use strict';

//3rd
const express = require('express');
const router = express.Router();

//services
const witService = require('../services/witService');

router.get('/', (req, res) => {
  res.send('This is the random resource');
});

router.get('/:text', (req, res) => {
  witService.getIntent(req.params.text)
    .then(result => res.send(result))
    .catch(err => res.send(err));
});

module.exports = router;
