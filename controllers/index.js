'use strict';

const express = require('express');
const router = express.Router();

router.use('/message', require('./message.js'));

module.exports = router;
