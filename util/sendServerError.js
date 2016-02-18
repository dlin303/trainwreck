'use strict';

// util
const HttpStatus = require('./HttpStatus');

module.exports = function sendServerError(res, status, message) {
  status = (status === undefined) ? HttpStatus.INTERNAL_SERVER_ERROR : status;
  message = (message === undefined) ? 'An error occurred' : message;
  res.status(status);
  if (typeof message === 'string') {
    res.json({ error: message });
  } else {
    console.log("Encountered error", message);
    res.send(`Err: ${JSON.stringify(message)}`);
  }
}
