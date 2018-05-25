/*

RoutesController.js: This controller contains all code to get Patco stops

*/

var mongoose = require("mongoose");
var express = require('express');
const gtfs = require('gtfs');


//create controller for CRUD operations
var routeController = {};


// Show list of all stops function.
routeController.home = function(req, res){
		res.render("../views/index");

};

//Time formatter function
function timeNow(){
		var d = new Date(); // for now
		var hours = d.getHours(); // => 9
		var min = d.getMinutes(); // =>  30
		var sec = d.getSeconds(); // => 51

		if(min > 9){
		return hours + ":" + min +  ":" + sec;
		}else{
			return hours + ":0" + min +  ":" + sec;
		} 
}

routeController.getNextTimes = function(req, res){
		
		//Get day of week to select correct service_id
		var id = new Date();
		switch(id.getDay()){
    		case 6:
	        	id = 30;
	        	break;
		    case 7:
		        id = 31;
		        break;
		    default:
		        id = 32
		}

		var stop = req.query.station;       //Get stop id from user request
		var routeId = req.query.direction;  //Get direction from user request

		gtfs.getStoptimes({
			  agency_key: 'patco',
			  service_id: id,
			  route_id: routeId
			}, {
			  _id: 0
			}, {
			  sort: {stop_id: 1}
			})
			.then(stoptimes => {

				var time = timeNow();    //Get time string using using TimeNow() function
				
				var validTimes = [];      // Array to store times that greater than the current time

				for(j=0; j < stoptimes.length; j++){
					
					//If time is less than 10:00 AM, remove leading 0 to allow for valid comparison
					if(stoptimes[j].departure_time < "10:00"){
						stoptimes[j].departure_time = stoptimes[j].departure_time.substring(1, 5); 
						
					}
					//If stop ids match and the time is in the future push to the valid times array
					if(stoptimes[j].stop_id == stop && stoptimes[j].departure_time >= time){
						validTimes.push(stoptimes[j].departure_time);
					}
				}

	

				//Loop to format strings in 12 hour clock format
				for(var z =0; z < 2; z++){
					var num = parseInt(validTimes[z].substring(0,2));
					if(num > 12){						
						validTimes[z] = (num-12).toString() + ":" + validTimes[z].substring(3, 5) + " PM";
					}
				}

				//Array of next two times to send to client
				var result = [validTimes[0], validTimes[1]];

				//Render the result on client
				res.render("./result", {result: result});
			})

		
	}

		


//export park controller as modul/e
module.exports = routeController;
