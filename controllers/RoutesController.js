/*
*
RoutesController.js: This controller contains all code to get Patco stops
*
*/

const gtfs = require('gtfs');

//Time formatting function. Converst date object into a string that can be compared to GTFS stop times
//Also converts date to EST if a date wasn't provided by user. 
function timeNow(searchTime) {
	
	const d = searchTime ? new Date(searchTime) : new Date(); 
	
	//Timezone offset UTC - 5 (-4 for daylight savings TODO: automate the offset based on daylight savings time)
	if(!searchTime){
		d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000 - (5) * 60 * 60 * 1000);
	}

	const hours = d.getHours(); 
	const min = d.getMinutes(); 
	const sec = d.getSeconds(); 

	if(min > 9){
		return hours + ":" + min +  ":" + sec;
	}else{
		return hours + ":0" + min +  ":" + sec;
	} 
}

const getNextTimes = function(req, res) {

	res.setHeader('Content-Type', 'application/json');
	const data = req.body;

	//Get day of week to select correct service_id
	let id = data.time ? new Date(data.time) : new Date();

	// Set day id to corresponding GTFS schedule 
	switch(id.getDay()) {
		case 6:
			id = 37;
			break;
		case 7:
			id = 38;
			break;
		default:
			id = 39;
	}

	gtfs.getStoptimes({
		agency_key: 'patco',
		service_id: id,
		route_id: data.direction,
		}, {
		_id: 0
		}, {
		sort: {stop_id: 1}
		})
		.then(stoptimes => {
			
			// Use searched time or get current time & and format if necessary
			let time = data.time ? timeNow(data.time) + '0' : timeNow();
			
			// Add a 0 before time if it less than 7 characters to allow for valid comparison
			if (time.length === 7 ) {
				time = "0" + time;
			}

			let validTimes = [];      // Array to store times that greater than the current time

			for (let j=0; j < stoptimes.length; j++) {
				//If stop ids match and the time is in the future push to the valid times array
				if(stoptimes[j].stop_id === data.station && stoptimes[j].departure_time >= time){	
					validTimes.push(stoptimes[j].departure_time.substring(0, 5));
				}
			}

			//Loop to format strings in 12 hour clock format
			for (let i = 0; i < 2; i++) {

				let num = parseInt(validTimes[i].substring(0,2));

				if (num >= 12){	
					//format string to PM if time is 1:00 PM or later
					if (num > 12){					
						validTimes[i] = (num-12).toString() + ":" + validTimes[i].substring(3, 5) + " PM";
					}
					//format string as 12 PM if time is exactly 12
					else{
						validTimes[i] = validTimes[i] + " PM";
					}
				}
				//Format time as AM if time is AM
				else{
					validTimes[i] += " AM"; 
				}
			}

			//Array of next two times to send to client
			const times = [validTimes[0], validTimes[1]];
			
			let stopName = "";
			//Set stop to string of stop's name
			switch(data.station){
				case "1" : stopName = "Lindenwold";
				break;
				case "2" : stopName = "Ashland";
				break;
				case "3" : stopName = "Woodcrest";
				break;
				case "4" : stopName = "Haddonfield";
				break;
				case "5" : stopName = "Westmont";
				break;
				case "6" : stopName ="Collingswood";
				break;
				case "7" : stopName = "Ferry Ave";
				break;
				case "8" : stopName = "Broadway";
				break;
				case "9" : stopName = "City Hall";
				break;
				case "10" : stopName = "8th & Market";
				break;
				case "11" : stopName = "9/10 & Locust";
				break;
				case "12" : stopName = "12/13 & Locust";
				break;
				default : stopName = "15/16 & Locust";
				break;				
			}

			//Set direction to string of destination name
			let destination = "";
			switch(data.direction){
				case "1" : destination = "Lindenwold, NJ";
				break;
				default : destination = "Philadelphia, PA";
				break;
			}
			
			//Send data to client
			const result = {stopName : stopName, destination : destination, times : times};
			res.send(result);
		})
		.catch(err => {
			console.error(err);
		});	
};

module.exports.getNextTimes = getNextTimes;

