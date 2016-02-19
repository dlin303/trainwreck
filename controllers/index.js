'use strict';

const express = require('express');
const router = express.Router();
const dbinit = require('./db');

router.use('/message', require('./message.js'));

module.exports = router;
