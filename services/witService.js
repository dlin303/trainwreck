'use strict';

//3rd
const wit = require('node-wit');
const Promise = require('bluebird');
const WIT_ACCESS_TOKEN = require('../config').WIT_ACCESS_TOKEN;

const witService = {
  getIntent: (text) => {
    return new Promise((resolve, reject) =>{
      wit.captureTextIntent(WIT_ACCESS_TOKEN, text, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      });
    });
  }
};

module.exports = witService;



