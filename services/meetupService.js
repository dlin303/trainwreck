const MEETUP_ACCESS_TOKEN = require('../config').MEETUP_TOKEN;

const rp = require('request-promise');

const meetupService = {
  findGroups: (zip) => {
    const options = {
      uri: 'http://api.dev.meetup.com/find/groups',
      qs: {
          key: MEETUP_ACCESS_TOKEN,
          sign: 'true',
          'photo-host': 'public',
          page: '20',
          zip
      },
      json: true // Automatically parses the JSON string in the response
    };

    return rp(options).promise();
  },

  findEvents: (zip) => {
    const options = {
      uri: 'http://api.dev.meetup.com/2/open_events',
      qs: {
        key: MEETUP_ACCESS_TOKEN,
        sign: 'true',
        zip
      },

      json: true
    };

    return rp(options).promise();
  }
};

module.exports = meetupService;
