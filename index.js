'use strict';

//3rd party
const express = require('express');
const app = express();
const rp = require('request-promise');
const bodyParser = require('body-parser');

const port = 3000;
const Secrets = require('./config');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  rp('http://www.google.com')
    .then(response => res.send(response))
    .catch(err => res.send(err));
});

app.listen(port, () => {
  if (!Secrets.WIT_ACCESS_TOKEN) {
    console.log('Wit access token not set');
  }

  if (!Secrets.TWILIO_ACCOUNT_SID) {
    console.log('Twillio Account SID not set');
  }

  if (!Secrets.TWILIO_AUTH_TOKEN) {
    console.log('Twilio Auth Token not set');
  }

  if (!Secrets.TWILIO_SENDER_NUMBER) {
    console.log('Twilio Sender Number not set');
  }

  console.log(`app started on port: ${port}`);
}); 

app.use(require('./controllers'));
