import { me as companion } from "companion";
import * as util from "../common/utils";
import * as messaging from "messaging";
import { battery } from "power";
import { settingsStorage } from "settings";
import {API_KEY} from "../common/constants"

let lat = -1;
let lng = -1;
let key = API_KEY; 

if(settingsStorage.getItem("lat")){
 lat = JSON.parse(settingsStorage.getItem("lat")).name;  
}

if(settingsStorage.getItem("lng")){
  lng = JSON.parse(settingsStorage.getItem("lng")).name;
}

if(settingsStorage.getItem("key")){
  key = JSON.parse(settingsStorage.getItem("key")).name;  
}


const MILLISECONDS_PER_MINUTE = 1000 * 60;

function init() {

  if (companion.permissions.granted("access_internet") && companion.permissions.granted("run_background")) {

    companion.wakeInterval = 60 * MILLISECONDS_PER_MINUTE;

    function updateWeather() {

      util.fetchWeather(key, parseInt(lat) || 0, parseInt(lng) || 0).then((res) => {
        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
          messaging.peerSocket.send(JSON.stringify(res));
        }
      })
    }

    if (companion.launchReasons.wokenUp) {
      updateWeather();
    }

    messaging.peerSocket.addEventListener("message", (evt) => {
      if (evt.data === "clock_ready") {
        updateWeather();
        companion.addEventListener("wakeinterval", updateWeather);
      }

    });

  }
}

// The companion was started due to settings changes
if (companion.launchReasons.settingsChanged) {
  init()
}

init();