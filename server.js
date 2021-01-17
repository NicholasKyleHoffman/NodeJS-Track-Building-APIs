var express = require('express');            
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Vehicle = require('./app/models/vehicle');

// Configure app for bodyParser()
// lets us grab data from the body of POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Set up port for server to listen on
var port = process.env.PORT || 3000;

// #1) Connect to DB Server: ( in cmd prompt type: mongod to start MongoDB server - listening on Port 27017 )
mongoose.connect('mongodb://localhost:27017/codealong');

// API Routes - using express for routing
var router = express.Router();

// Routes will all be prefixed with /api
app.use('/api', router);

// MIDDLEWARE -
// Middleware can be very useful for doing validations. We can log
// things from here or stop the request from continuing in the event
// that the request is not safe.
// middleware to use for all requests
router.use(function(req, res, next) {
  console.log('FYI...There is some processing currently going down...');
  next();
});

// Test Route - GET - test route in POSTMAN once #1) mongod and #2) nodemon server.js (npm install -g nodemon || allows hot reloading upon file save/changes -- **run in NodeJS CMD prompt**)
router.get('/', function(req, res) {
  res.json({message: 'Welcome to our API!'});
});

router.route('/vehicles')
  .post(function(req, res) {
    var vehicle = new Vehicle(); // new instance of a vehicle
    vehicle.make = req.body.make;
    vehicle.model = req.body.model;
    vehicle.color = req.body.color;

    vehicle.save(function(err) {
      if (err) {
        res.send(err); // ** if there's an error, exit & throw error message - same with all other routes**
      }
      res.json({message: 'Vehicle was successfully manufactured'}); // **ELSE, show success message - same with all other routes**
    });
  })

  .get(function(req, res) {
    Vehicle.find(function(err, vehicles) {
      if (err) {
        res.send(err);
      }
      res.json(vehicles);
    });
  });

router.route('/vehicle/:vehicle_id')
  .get(function(req, res) {
    Vehicle.findById(req.params.vehicle_id, function(err, vehicle) {
      if (err) {
        res.send(err);
      }
      res.json(vehicle);
    });
  });

router.route('/vehicle/make/:make')
  .get(function(req, res) {
    Vehicle.find({make:req.params.make}, function(err, vehicle) {
      if (err) {
        res.send(err);
      }
      res.json(vehicle);
    });
  });

router.route('/vehicle/color/:color')
  .get(function(req, res) {
    Vehicle.find({color:req.params.color}, function(err, vehicle) {
      if (err) {
        res.send(err);
      }
      res.json(vehicle);
    });
  });

// Fire up server
app.listen(port);
// Print friendly message to console --- ** this will display in the NodeJS cmd prompt once running: cmd = nodemon server.js **
console.log('Server listening on port ' + port); 
