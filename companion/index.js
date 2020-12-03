import { me as companion } from "companion";
import * as util from "../common/utils";
import * as messaging from "messaging";
import { API_KEY } from "../common/constants"
import { settingsStorage } from "settings";

let city = undefined;
let key = API_KEY;

if (settingsStorage.getItem("city")) {
  city = JSON.parse(settingsStorage.getItem("city")).name;
}

if (settingsStorage.getItem("key")) {
  key = JSON.parse(settingsStorage.getItem("key")).name;
}


const MILLISECONDS_PER_MINUTE = 1000 * 60;

function init() {

  if (companion.permissions.granted("access_internet") && companion.permissions.granted("run_background")) {

    companion.wakeInterval = 60 * MILLISECONDS_PER_MINUTE;

    function fetchWeather() {

      let isValidString = util.validateString(city);

      if (isValidString === false) return;

      util.fetchWeatherBySearch(key,city).then((res) => {
        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
          messaging.peerSocket.send(JSON.stringify(res));
        }
      })
    }

    function updateWeather(){
      if (settingsStorage.getItem("city")) {
        city = JSON.parse(settingsStorage.getItem("city")).name;
      }

      if (settingsStorage.getItem("key")) {
        key = JSON.parse(settingsStorage.getItem("key")).name;
      }
      fetchWeather();
    }

    if (companion.launchReasons.wokenUp) {
      fetchWeather();
    }

    messaging.peerSocket.addEventListener("message", (evt) => {
      if (evt.data === "clock_ready") {
        fetchWeather();
        companion.addEventListener("wakeinterval", fetchWeather);
      }

    });


    // The companion was started due to settings changes
    if (companion.launchReasons.settingsChanged) {
      updateWeather()
    }


    // Event fires when a setting is changed
    settingsStorage.addEventListener("change", (evt) => {
      updateWeather();
    });


  }
}

init();