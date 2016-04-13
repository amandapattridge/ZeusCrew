var Q = require('q');
var Journey = require('./journeyModel.js');

var findJourney = Q.nbind(Journey.findOne, Journey);
var createJourney = Q.nbind(Journey.create, Journey);

module.exports = {
  saveJourney: function (req, res, next) {
    var start = req.body.start;
    var end = req.body.end;
    var waypoints = [];

    for (var i = 0; i < req.body.waypoints.length; i++) {
      waypoints.push([req.body.waypoints[i].name, req.body.waypoints[i].location]);
    }

    findJourney({wayPoints: waypoints})
      .then(function (waypoint) {
        if (!waypoint) {
          return createJourney({
            startPoint: start,
            endPoint: end,
            wayPoints: waypoints
          });
        } else {
          next(new Error('Journey already exist!'));
        }
      })
      .catch(function (error) {
        next(error);
      });
  },

  getAll: function (req, res, next) {
  Journey.find({})
    .then(function (data) {
      res.status(200).send(data);
    })
    .catch(function(error) {
      next(error);
    });
  }
};
