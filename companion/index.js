import { me as companion } from 'companion';
import * as util from '../common/utils';
import * as messaging from 'messaging';
import { settingsStorage } from 'settings';
import { geolocation } from 'geolocation';
let API_KEY = '';

const MILLISECONDS_PER_MINUTE = 1000 * 60;
function getSetings() {
	let city = undefined;
	let key = API_KEY;
	let useGeolocation = false;

	if (settingsStorage.getItem('city')) {
		city = JSON.parse(settingsStorage.getItem('city')).name;
	}

	if (settingsStorage.getItem('key')) {
		key = JSON.parse(settingsStorage.getItem('key')).name;
	}

	if (settingsStorage.getItem('geolocation')) {
		useGeolocation = settingsStorage.getItem('geolocation');
	}

	return { city, key, useGeolocation };
}

function locationSuccess(position, key) {
	util.fetchWeatherByLatLng(key, position.coords.latitude, position.coords.longitude).then((res) => {
		if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
			messaging.peerSocket.send(JSON.stringify(res));
		}
	});
}

function locationError(city, key) {
	let isValidString = util.validateString(city);

	if (isValidString === false) return;

	util.fetchWeatherBySearch(key, city).then((res) => {
		if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
			messaging.peerSocket.send(JSON.stringify(res));
		}
	});
}

function fetchWeather() {
	console.log('fetchWeather');
	let { city, key, useGeolocation } = getSetings();

	if (useGeolocation === 'true') {
		console.log('fetchWeather');

		geolocation.getCurrentPosition(
			(evt) => locationSuccess(evt, key),
			(evt) => locationError(city, key),
			{ enableHighAccuracy: false, maximumAge: 20 * (60 * 1000), timeout: 60 * 1000 }
		);
	} else {
		let isValidString = util.validateString(city);

		if (isValidString === false) return;

		util.fetchWeatherBySearch(key, city).then((res) => {
			if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
				messaging.peerSocket.send(JSON.stringify(res));
			}
		});
	}
}

function init() {
	if (companion.permissions.granted('access_internet') && companion.permissions.granted('run_background')) {
		companion.wakeInterval = 60 * MILLISECONDS_PER_MINUTE;

		if (companion.launchReasons.wokenUp) {
			fetchWeather();
		}

		messaging.peerSocket.addEventListener('message', (evt) => {
			if (evt.data.event === 'clock_ready') {
				API_KEY = evt.data.key;
				console.log(API_KEY);
				fetchWeather();
				companion.addEventListener('wakeinterval', fetchWeather);
			}
			if (evt.data.event === 'clock_close') {
				companion.removeEventListener('wakeinterval', fetchWeather);
			}
		});

		// The companion was started due to settings changes
		if (companion.launchReasons.settingsChanged) {
			fetchWeather();
		}

		// Event fires when a setting is changed
		settingsStorage.addEventListener('change', (evt) => {
			fetchWeather();
		});
	}
}

init();
