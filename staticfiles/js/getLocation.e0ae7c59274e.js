// GPS LOCATION...
let latitude = 0
let longitude = 0
let last_sent_lat = 0
let last_sent_lon = 0
schedule_id = document.currentScript.getAttribute('schedule_id')

// CHECK IF GPS IS AVAILABLE
if ('geolocation' in navigator) {
	const options = {
		enableHighAccuracy: true,
		timeout: 10000,
		maximumAge: 1000,
	}
	navigator.geolocation.watchPosition(onSuccess, onError)
} else {
	// send message to back end that we could not get the location from this user
	console.log('No Location obtained')
}

function onSuccess(position) {
	latitude = position.coords.latitude
	longitude = position.coords.longitude
}
function onError() {
	LocationErrorMessage()
	alert('Please give your browser access to GPS.')
	// give the user limited usage untill thay allow gps
	// make a ajax request to a endpoint to mark the driver has not enabeled gps
}
// run one when file is loaded
const myTimeout = setTimeout(evaluate_cords, 5000)
function myStopFunction() {
	clearTimeout(myTimeout)
}
// TRY TO SEND THE UPDATED GPS LOCATION EVERY 1 MIN
timer = setInterval(evaluate_cords, 60000)

// COMPARE THE NEW AND OLD CORDS, AND ONLY SEND THE NEW LOCATION IF THE CORDS ARE DIFFERENT
function evaluate_cords(params) {
	if (last_sent_lat == 0 && longitude != 0) {
		//console.log('sending from 0 ')
		sendRequest()
	} else if (
		latitude.toString().substring(0, 8) == last_sent_lat.toString().substring(0, 8) &&
		longitude.toString().substring(0, 8) == last_sent_lon.toString().substring(0, 8)
	) {
		//console.log('did not change')
		// cords did not change much so don't send updated location
	} else {
		//console.log('sending for second time ')
		sendRequest()
	}
}
// https://10.0.0.56:80/routs/update_drivers_location/
function sendRequest() {
	const xhttp = new XMLHttpRequest()
	xhttp.open(
		'GET',
		''.concat(
			`https://routerapp.onrender.com/routs/update_drivers_location/`,
			latitude,
			'/',
			longitude,
			'/',
			schedule_id
		),
		true
	)
	xhttp.send()
	last_sent_lat = latitude
	last_sent_lon = longitude
}

// send
function LocationErrorMessage() {
	const xhttp = new XMLHttpRequest()
	xhttp.open('GET', `https://routerapp.onrender.com/routs/drivers_location_error/`, true)
	xhttp.send()
}
