'use strict';

const express = require('express');
const router = express.Router();

router.use('/events', require('./events.js'));
router.use('/random', require('./random.js'));

module.exports = router;
