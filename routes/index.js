var express = require('express');
var router = express.Router();
const gtfs = require('gtfs');

// require routes controller
var routes = require("../controllers/RoutesController.js");

//Show default page
router.get('/', routes.home);

//Get stop times
router.get('/result', routes.getNextTimes);


module.exports = router;
