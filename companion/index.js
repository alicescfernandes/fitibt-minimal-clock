import { me as companion } from 'companion';
import * as util from '../common/utils';
import * as messaging from 'messaging';
import { API_KEY } from '../common/constants';
import { settingsStorage } from 'settings';
import { geolocation } from 'geolocation';
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
	let { city, key, useGeolocation } = getSetings();

	if (useGeolocation === 'true') {
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
			if (evt.data === 'clock_ready') {
				fetchWeather();
				companion.addEventListener('wakeinterval', fetchWeather);
			}
			if (evt.data === 'clock_close') {
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
