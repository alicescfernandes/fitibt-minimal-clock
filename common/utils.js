import { gettext } from "i18n";

export function localeMonth(month){
  return gettext("m_"+month)
}

export function localeWeekDay(day){
  return gettext("w_"+day)
}

// Add zero in front of numbers < 10
export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

export function fetchWeather(api, lat, lng){
  return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${api}`).then((res) => res.json())
}

