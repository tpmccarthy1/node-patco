var express = require('express');
var router = express.Router();

// require routes controller
var RoutesController = require("../controllers/RoutesController.js");

//Get next stop time
router.get('/result', RoutesController.getNextTimes);


module.exports = router;
