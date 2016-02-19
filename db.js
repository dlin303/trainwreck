const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/stored_states');

const db = mongoose.connection;

const userInfoSchema = mongoose.Schema({
  number: String,
  lastEventId: String,
  lastGroupId: String
});

const UserInfo = mongoose.model('UserInfo', userInfoSchema);

const upsertUserInfo = function(number, lastEventId, lastGroupId) {
  var testUserInfo = new UserInfo({ number: '5556', lastEventId: '123456', lastGroupId: '098765' });
  UserInfo.findOne({number: number}, function(err, userInfo) {
    if(!err) {
        if(!userInfo) {
            userInfo = new UserInfo();
            userInfo.number = number;
        }

        if (lastEventId !== undefined) {
          userInfo.lastEventId = lastEventId;
        }
        if (lastGroupId !== undefined) {
          userInfo.lastGroupId = lastGroupId;
        }
        userInfo.save(function(err) {
            if(!err) {
                console.log("saved: ", userInfo.number);
            }
            else {
                console.log("Error: could not save user info " + userInfo.number);
            }
        });
    }
  });
}

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("connected to db");
});

module.exports = {UserInfo, upsertUserInfo};
