var request = require("request")
  , AlexaSkill = require('./AlexaSkill')
  , APP_ID = 'amzn1.ask.skill.f7251573-1696-4af6-b867-04fd9ffe4bd1';

var error = function (err, response, body) {
  console.log('ERROR [%s]', err);
};

var getJsonFromUnity = function (direction, callback) {
  
  var command = "go " + direction;

  var options = {
    method: 'GET',
    url: 'http://three-pac.herokuapp.com/',
    qs: { command: command },
    headers:
      {
        'postman-token': '230914f7-c478-4f13-32fd-e6593d8db4d1',
        'cache-control': 'no-cache'
      }
  };

  var error_log = "";

  request(options, function (error, response, body) {
    if (!error) {
      error_log = direction;
    } else {
      error_log = "There was a mistake";
    }
    callback(error_log);
  });
}

var handleUnityRequest = function (intent, session, response) {
  getJsonFromUnity(intent.slots.direction.value, function (data) {
    response.ask("done");
  });
};

var Unity = function () {
  AlexaSkill.call(this, APP_ID);
};

Unity.prototype = Object.create(AlexaSkill.prototype);
Unity.prototype.constructor = Unity;

Unity.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
  console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId
    + ", sessionId: " + session.sessionId);
};

Unity.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
  // This is when they launch the skill but don't specify what they want.

  var output = 'Welcome to 3pac. You can move the Pac-Man by saying "left", "right" "front", or "back".';

  var reprompt = 'Which direction do you want to go?';

  response.ask(output, reprompt);

  console.log("onLaunch requestId: " + launchRequest.requestId
    + ", sessionId: " + session.sessionId);
};

Unity.prototype.intentHandlers = {
  GetUnityIntent: function (intent, session, response) {
    handleUnityRequest(intent, session, response);
  },

  HelpIntent: function (intent, session, response) {
    var speechOutput = 'Left, right, front, or back?';
    response.ask(speechOutput);
  }
};

exports.handler = function (event, context) {
  var skill = new Unity();
  skill.execute(event, context);
};
