'use strict';

//3rd
const Promise = require('bluebird');
const util = require('util');

//util
const intents = require('./intents');
const HttpStatus = require('../util/Httpstatus');
const Err = require('../util/Err');
const Message = require('../util/Message');

//services
const meetupService = require('../services/meetupService');
/**
example wit response.
entities can sometimes be an empty object

{
  "msg_id": "58ffae2b-37c0-4894-9b4a-9e84f5677b47",
  "_text": "I'm close to 94704",
  "outcomes": [{
    "_text": "I'm close to 94704",
    "confidence": 0.631,
    "intent": "zip",
    "entities": {
      "location": [{
        "type": "value",
        "value": "94704",
        "suggested": true
      }]
    }
  }]
}
*/

let thing_id;
const intentRouter = {
  getIntent: (witResponse) => {
    return new Promise((resolve, reject) => {
      if (!witResponse || witResponse.outcomes.length === 0) {
        return reject(new Err(HttpStatus.INTERNAL_SERVER_ERROR, 
          'No wit response outcomes'));
      }
      
      resolve(witResponse.outcomes);
    });
  },

  /**
   * Right now this is just a dumb wrapper to deal with the fact that we can have multiple 
   */
  processOutcomes: (outcomes) => {
    return intentRouter.processIntent(outcomes[0]);  
  },

  /**
   * Processes a single outcome and it's entities.
   */
  processIntent: (outcome) => {
    console.log(util.inspect(outcome, false, null));
    const intent = outcome.intent;
    if (intent === intents.NEARBY_EVENTS) {
      return intentRouter.nearbyEventsIntent(outcome.entities);
    } else if (intent === intents.ZIP_GROUPS) {
      return intentRouter.zipGroupIntent(outcome.entities);
    } else if (intent === intents.ZIP_GROUP) {
      return intentRouter.zipGroupIntent(outcome.entities, { single: true }); 
    } else {
      return new Message("Hi I don't know what you're saying");
    }
  },


  //nearby events is dumb. It just responds by asking for your zip code
  nearbyEventsIntent: (entities) => {
    const loc = entities.number;
    if (!loc) {
      return Promise.resolve(new Message('Did you forget to provide a zip code?'));
    }

    const zipCode = loc[0].value; 
    return meetupService.findEvents(zipCode)
      .then(data => {
        return intentRouter._eventsToMessage(data);
      });
  },

  //a zip code intent
  zipGroupIntent: (entities, opts) => {
    const loc = entities.location;
    if (!loc) {
      return Promise.reject(new Message('Darn. Could not understand your zip code')); 
    }

    //let's just grab the first zip code we find 
    const zipCode = loc[0].value; 
    return meetupService.findGroups(zipCode)
      .then(data => intentRouter._groupToMessage(data, opts));
  },

  //for now just return 1 group
  _groupToMessage: (groupsList, opts) => {
    if (opts && opts.single) {
      const group = groupsList[0];
      thing_id = group.id;
      return new Message(group.name);
    }

    const groups = groupsList
      .map(g => g.name) 
      .join("\n\n");

    return new Message(groups);
  },

  _eventsToMessage: (eventsList) => {
    const event = eventsList.results[0];
    thing_id = event.id;
    return new Message(event.name);
  }

};

module.exports = intentRouter;
