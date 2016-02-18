'use strict';

//3rd
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('This is the events resource');
});

module.exports = router;
