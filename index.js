'use strict';

//3rd party
const express = require('express');
const app = express();
const rp = require('request-promise');

const port = 3000;
const Secrets = require('./config');

app.get('/', (req, res) => {
  rp('http://www.google.com')
    .then(response => res.send(response))
    .catch(err => res.send(err));
});

app.listen(port, () => {
  if (!Secrets.WIT_ACCESS_TOKEN) {
    console.log('Wit access token not set');
  }
  console.log(`app started on port: ${port}`);
}); 

app.use(require('./controllers'));
