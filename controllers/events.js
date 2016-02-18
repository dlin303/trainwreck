'use strict';

//3rd
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('This is the events resource');
});

router.get('/hello_world', (req, res) => {
  sendHelloWorld();
  res.send('Sending Hello World From The Other Sideeeeee');
});

function sendHelloWorld() {
  // Twilio module
  var client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  client.messages.create({
    to: "+18606904954",
    from: "+18606501845",
    body: "Hello From The Other Sideeeeee",
  }, function(err, message) {
    console.log(message.sid);
  });
}

module.exports = router;
