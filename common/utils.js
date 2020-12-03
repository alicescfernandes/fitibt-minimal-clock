import { gettext } from "i18n";

export function localeMonth(month){
  return gettext("m_"+month)
}

export function localeWeekDay(day){
  return gettext("w_"+day)
}

export function validateRange(value, min, max){
  if(Number.isInteger(min) === false) return false
  if(Number.isInteger(max) === false) return false
  if(Number.isInteger(value) === false) return false

  return value > min && value < max
}

export function validateString(s){

  return typeof s === "string" && s.length > 0;
}

// Add zero in front of numbers < 10
export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

export function fetchWeatherByLatLng(api, lat, lng){
  return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${api}`).then((res) => res.json())
}

export function fetchWeatherBySearch(api, q){
  return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${api}`).then((res) => res.json())
}


