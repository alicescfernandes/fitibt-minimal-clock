import clock from "clock";
import document from "document";
import * as util from "../common/utils";
import * as messaging from "messaging";
import { battery } from "power";
import { HeartRateSensor } from "heart-rate";

//icons by https://www.deviantart.com/ncrystal/art/Google-Now-Weather-Icons-597652261

// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
const myLabel = document.getElementById("time");
const date_element = document.getElementById("date");
const weather_element = document.getElementById("weather_icon");
const battery_level_element = document.getElementById("bat_level")
const heart_rate_element = document.getElementById("heart_rate")

const hrm = new HeartRateSensor();

//Change heart rate sensor
hrm.addEventListener("reading", () => {
  heart_rate_element.text = `${hrm.heartRate === null ? "❤️" : hrm.heartRate + " ❤️"}`;
});

hrm.addEventListener("activate", () => {
  heart_rate_element.text = `${hrm.heartRate === null ? "❤️" : hrm.heartRate + " ❤️"}`;
});

hrm.addEventListener("error", () => {
  heart_rate_element.text = "❤️";
});

hrm.start()

clock.ontick = (evt) => {
  let date = evt.date
  let month = util.localeMonth(date.getMonth());
  let weekDay = util.localeWeekDay(date.getDay());
  let day = date.getDate();
  let today = evt.date;
  let hours = today.getHours();
  let mins = util.zeroPad(today.getMinutes());
  
  let displayHours = util.zeroPad(hours);

  
  myLabel.text = `${displayHours}:${mins}`;
  date_element.text = `${weekDay} ${month} ${day}`
  battery_level_element.text = Math.floor(battery.chargeLevel) + "%";
  
  if(battery.chargeLevel < 10){
    battery_level_element.style.fill = "red";
  }
  
}

messaging.peerSocket.addEventListener("open", (evt) => {
  messaging.peerSocket.send("clock_ready");
 });

messaging.peerSocket.addEventListener("message", (evt) => {
  let weatherData = JSON.parse(evt.data);
  if(weatherData.cod === 200){
    weather_element.href = `images/${weatherData.weather[0].icon}.png`
  }
});
