'use strict';

//3rd
const Promise = require('bluebird');
const util = require('util');
const _ = require('underscore');

//util
const intents = require('./intents');
const HttpStatus = require('../util/Httpstatus');
const Err = require('../util/Err');
const Message = require('../util/Message');
const db = require('../db');

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
  processOutcomes: (outcomes, opts) => {
    return intentRouter.processIntent(outcomes[0], opts);
  },

  /**
   * Processes a single outcome and it's entities.
   */
  processIntent: (outcome, opts) => {
    console.log(util.inspect(outcome, false, null));
    const intent = outcome.intent;
    if (intent === intents.NEARBY_EVENTS) {
      return intentRouter.nearbyEventsIntent(outcome.entities, opts);
    } else if (intent === intents.ZIP_GROUPS) {
      return intentRouter.zipGroupIntent(outcome.entities, opts);
    } else if (intent === intents.ZIP_GROUP) {
      return intentRouter.zipGroupIntent(outcome.entities, { single: true });
    } else if (intent === intents.RSVP) {
      return intentRouter.rsvp();
    } else {
      return new Message("Hi I don't know what you're saying");
    }
  },


  //nearby events is dumb. It just responds by asking for your zip code
  nearbyEventsIntent: (entities, opts) => {
    if (opts && opts.phone) {
      //do stuff here
      console.log("phone number", opts.phone);
    }

    const loc = entities.number;
    if (!loc) {
      return Promise.resolve(new Message('Did you forget to provide a zip code?'));
    }

    const zipCode = loc[0].value;
    return meetupService.findEvents(zipCode)
      .then(data => {
        const rsvpableEvent = intentRouter.filterEvents(data.results);
        upsertUserInfo(opts.phone, rsvpableEvent.id);
        return intentRouter._eventsToMessage(rsvpableEvent.id);
      });
  },

  zipGroupIntent: (entities, opts) => {
    const loc = entities.number;
    if (!loc) {
      return Promise.reject(new Message('Darn. Could not understand your zip code'));
    }

    //let's just grab the first zip code we find
    const zipCode = loc[0].value;
    return meetupService.findGroups(zipCode)
      .then(data => {
        var savedGroup = data[0];
        upsertUserInfo(opts.phone, null, savedGroup.id);
        return intentRouter._groupToMessage(data, opts)
      });
  },

  //rsvp person to the last known eventId
  rsvp: () => {
    const dummyUserInfo = { lastEventId: 227316958 };
    return meetupService.rsvp(dummyUserInfo)
      .then(() => new Message("You've RSVP'd!"));
  },

  //for now just return 1 group
  _groupToMessage: (groupsList, opts) => {
    if (opts && opts.single) {
      const group = groupsList[0];
      return new Message(group.name);
    }

    const groups = groupsList
      .map(g => g.name)
      .join("\n\n");

    return new Message(groups);
  },

  _eventsToMessage: (event) => {
    return new Message(event.name);
  },

  filterEvents: (eventsList) => {
    return _.find(eventsList, (e) => { return e.rsvpable; });
  }

};

module.exports = intentRouter;
