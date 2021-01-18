# ⌚ Fitibt Minimal Clock Face ![status](https://api.travis-ci.org/alicescfernandes/fitibt-minimal-clock.svg?branch=master)

A clock face compatible with Fitbit Sense and Versa 3 that shows a couple of info. It was made by eye so don't mind the position of the UI elements and some weather icons on the clock  
![image](face.png)
![image](face_12h.png)

You can install it [here](https://gallery.fitbit.com/details/9c63e95d-d584-48cb-b315-f83e0737aa2a)  
Or here [https://gallery.fitbit.com/details/9c63e95d-d584-48cb-b315-f83e0737aa2a](https://gallery.fitbit.com/details/9c63e95d-d584-48cb-b315-f83e0737aa2a). 
The builds are done via Travis CI and published on the [releases page](https://github.com/alicescfernandes/fitibt-minimal-clock/releases/)

## TODO:
- [x] ✅ AOD (https://dev.fitbit.com/blog/2019-12-19-announcing-fitbit-os-sdk-4.1/#always-on-display-api)
- [ ] Finish localization (like all languages) (https://dev.fitbit.com/build/guides/localization/)
- [x] ✅ Add suport for a 12h hour watches 
- [x] ✅ Builds with Travis CI
- [ ] Better error handling
- [x] ✅ ~~Lat Lng in settings~~ Add support for geo-location
- [ ] Validate inputs on setttings page (https://dev.fitbit.com/build/reference/settings-api/#components)
- [x] ✅ change weather to city country
- [ ] check if old value is equal to new value on change event
## BUGS:
- ~~Invalid longitude and latitude values~~

## Configurations & Functionality

### Configurations
The app provides some configurations specifically for the weather:
- City, Country: You can specify a city to get the weather from, such as `Lisbon, Portugal`
- Open Weather API: If you have an API key, then you can add your own. The app uses a "public" API key, that can be blocked if it reaches the maximum requests
- Use geolocation: You can toggle this check to use the geolocation from the watch. This will override the "City, Country" setting. If for some reason it's not possible to get the coordinates, then the app will fallback to the "City, Country" setting so i advise you to fill both.

### Functionality
- Compatible with 12h and 24h clocks
- The app fetches weather info every hour.
- **If for some reason it's not possible to get the coordinates, then the app will fallback to the "City, Country" setting so i advise you to fill both.**
## Resources

### Weather Icons
The weather icons come from this [page](https://www.deviantart.com/ncrystal/art/Google-Now-Weather-Icons-597652261) 

### Weather data
It's provided by the Open Weather Map API
<img src="https://www.google-analytics.com/collect?v=1&amp;t=event&amp;tid=UA-100869248-2&amp;cid=555&amp;ec=github&amp;ea=pageview&amp;el=fitbit-minimal&amp;ev=1" alt=""> 
