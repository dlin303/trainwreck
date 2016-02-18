'use strict';

//3rd
const Promise = require('bluebird');

//util
const intents = require('./intents');
const HttpStatus = require('../util/Httpstatus');
const Err = require('../util/Err');
const Message = require('../util/Message');
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
    const intent = outcome.intent;
    if (intent === intents.NEARBY_EVENTS) {
      return intentRouter.nearbyEventsIntent(outcome.entities);
    } else {
      return new Message("Hi I don't know what you're saying");
    }
  },


  //nearby events is dumb. It just responds by asking for your zip code
  nearbyEventsIntent: () => {
    return new Promise((resolve, reject) => {
      console.log("hiyoo");
      resolve(new Message("Where might you be good person?"));
    });
  }

};

module.exports = intentRouter;
