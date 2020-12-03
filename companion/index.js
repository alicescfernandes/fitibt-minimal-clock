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
    console.log(3)

    companion.wakeInterval = 60 * MILLISECONDS_PER_MINUTE;

    function updateWeather() {

      let isValidString = util.validateString(city);
      console.log(city,isValidString)

      if (isValidString === false) return;

      util.fetchWeatherBySearch(key,city).then((res) => {
        console.log("fetching", )
        console.log(JSON.stringify(res))
        console.log(messaging.peerSocket.readyState === messaging.peerSocket.OPEN,messaging.peerSocket.readyState )
        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
          console.log("sent")
          messaging.peerSocket.send(JSON.stringify(res));
        }
      })
    }

    if (companion.launchReasons.wokenUp || companion.launchReasons.settingsChanged) {
      updateWeather();
    }

    messaging.peerSocket.addEventListener("message", (evt) => {
      if (evt.data === "clock_ready") {
        updateWeather();
        companion.addEventListener("wakeinterval", updateWeather);
      }

    });


    // The companion was started due to settings changes
    if (companion.launchReasons.settingsChanged) {
      console.log("companion.launchReasons.settingsChanged")
      if (settingsStorage.getItem("city")) {
        city = JSON.parse(settingsStorage.getItem("city")).name;
      }

      if (settingsStorage.getItem("key")) {
        key = JSON.parse(settingsStorage.getItem("key")).name;
      }
      updateWeather();

    }


    // Event fires when a setting is changed
    settingsStorage.addEventListener("change", (evt) => {
            
      if (settingsStorage.getItem("city")) {
        city = JSON.parse(settingsStorage.getItem("city")).name;
      }

      if (settingsStorage.getItem("key")) {
        key = JSON.parse(settingsStorage.getItem("key")).name;
      }

      console.log(99)
      updateWeather();
    });


  }
}

init();