'use strict';

// util
const HttpStatus = require('./HttpStatus');

module.exports = function sendSuccess(res, json, status) {
 res.status(status ? status : HttpStatus.OK);
 res.json(json);
}

