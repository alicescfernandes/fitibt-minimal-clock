import clock from 'clock';
import { display } from 'display';
import document from 'document';
import * as util from '../common/utils';
import * as messaging from 'messaging';
import { battery } from 'power';
import { HeartRateSensor } from 'heart-rate';
import { preferences } from 'user-settings';
import { me } from 'appbit';

//icons by https://www.deviantart.com/ncrystal/art/Google-Now-Weather-Icons-597652261

// Update the clock every minute
clock.granularity = 'minutes';

// Get a handle on the <text> element
const time_element = document.getElementById('time');
const date_element = document.getElementById('date');
const hour_element = document.getElementById('hour');
const weather_element = document.getElementById('weather_icon');
const battery_level_element = document.getElementById('bat_level');
const heart_rate_element = document.getElementById('heart_rate');
let deviceStarted = false;
const hrm = new HeartRateSensor();

let parseWeatherData = (evt) => {
	let weatherData = JSON.parse(evt.data);
	if (weatherData.cod === 200) {
		weather_element.href = `images/${weatherData.weather[0].icon}.png`;
	}
};

let startCompanionConnection = (evt) => {
	messaging.peerSocket.send('clock_ready');
	deviceStarted = true;
};

let closeCompanionConnection = (evt) => {
	messaging.peerSocket.send('clock_close');
};

function renderFace() {
	if (!display.aodActive && display.on) {
		weather_element.style.display = 'inline';
		heart_rate_element.style.display = 'inline';
		battery_level_element.x = 65;
		battery_level_element.y = 32;

		if (deviceStarted === true) {
			startCompanionConnection();
		} else {
			messaging.peerSocket.addEventListener('open', startCompanionConnection);
		}
		messaging.peerSocket.addEventListener('message', parseWeatherData);

		hrm.start();
	} else {
		if (display.aodActive) {
			weather_element.style.display = 'none';
			heart_rate_element.style.display = 'none';

			battery_level_element.x = 90;
			battery_level_element.y = 32;

			messaging.peerSocket.removeEventListener('open', startCompanionConnection);
			messaging.peerSocket.removeEventListener('message', parseWeatherData);
			closeCompanionConnection();
		}

		hrm.stop();
	}
}

if (display.aodAvailable && me.permissions.granted('access_aod')) {
	display.aodAllowed = true;
}
renderFace();
display.addEventListener('change', renderFace);

//Change heart rate sensor
hrm.addEventListener('reading', () => {
	heart_rate_element.text = `${hrm.heartRate === null ? '❤️' : hrm.heartRate + ' ❤️'}`;
});

hrm.addEventListener('activate', () => {
	heart_rate_element.text = `${hrm.heartRate === null ? '❤️' : hrm.heartRate + ' ❤️'}`;
});

hrm.addEventListener('error', () => {
	heart_rate_element.text = '❤️';
});

//Change the time
clock.ontick = (evt) => {
	let date = evt.date;
	let month = util.localeMonth(date.getMonth());
	let weekDay = util.localeWeekDay(date.getDay());
	let day = date.getDate();
	let today = evt.date;
	let hours = today.getHours();
	let mins = util.zeroPad(today.getMinutes());

	if (preferences.clockDisplay === '12h') {
		time_element.x = 336 / 2 - 25;

		if (hours > 12) {
			hour_element.text = 'PM';
			hours = hours % 12;
		} else {
			hour_element.text = 'AM';
		}
	} else {
		hour_element.text = '';
		time_element.x = 336 / 2;
	}

	let displayHours = util.zeroPad(hours);

	time_element.text = `${displayHours}:${mins}`;
	date_element.text = `${weekDay} ${month} ${day}`;
	battery_level_element.text = Math.floor(battery.chargeLevel) + '%';

	if (battery.chargeLevel < 10) {
		battery_level_element.style.fill = 'red';
	}
};
