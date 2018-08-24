'use strict'
class StateService {
  constructor() {
    this.isLoading = true;
    this.visibleCards = {};
    this.selectedCities = [];
    this.spinner = document.querySelector('.loader');
    this.cardTemplate = document.querySelector('.cardTemplate');
    this.container = document.querySelector('.main');
    this.addDialog = document.querySelector('.dialog-container');
    this.daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    this.initialWeatherForecast = {
      key: '2459115',
      label: 'New York, NY',
      created: '2016-07-22T01:00:00Z',
      channel: {
        astronomy: {
          sunrise: "5:43 am",
          sunset: "8:21 pm"
        },
        item: {
          condition: {
            text: "Windy",
            date: "Thu, 21 Jul 2016 09:00 PM EDT",
            temp: 56,
            code: 24
          },
          forecast: [
            { code: 44, high: 86, low: 70 },
            { code: 44, high: 94, low: 73 },
            { code: 4, high: 95, low: 78 },
            { code: 24, high: 75, low: 89 },
            { code: 24, high: 89, low: 77 },
            { code: 44, high: 92, low: 79 },
            { code: 44, high: 89, low: 77 }
          ]
        },
        atmosphere: {
          humidity: 56
        },
        wind: {
          speed: 25,
          direction: 195
        }
      }
    };
  }
  getIconClass(weatherCode) {
    // Weather codes: https://developer.yahoo.com/weather/documentation.html#codes
    weatherCode = parseInt(weatherCode);
    switch (weatherCode) {
      case 25: // cold
      case 32: // sunny
      case 33: // fair (night)
      case 34: // fair (day)
      case 36: // hot
      case 3200: // not available
        return 'clear-day';
      case 0: // tornado
      case 1: // tropical storm
      case 2: // hurricane
      case 6: // mixed rain and sleet
      case 8: // freezing drizzle
      case 9: // drizzle
      case 10: // freezing rain
      case 11: // showers
      case 12: // showers
      case 17: // hail
      case 35: // mixed rain and hail
      case 40: // scattered showers
        return 'rain';
      case 3: // severe thunderstorms
      case 4: // thunderstorms
      case 37: // isolated thunderstorms
      case 38: // scattered thunderstorms
      case 39: // scattered thunderstorms (not a typo)
      case 45: // thundershowers
      case 47: // isolated thundershowers
        return 'thunderstorms';
      case 5: // mixed rain and snow
      case 7: // mixed snow and sleet
      case 13: // snow flurries
      case 14: // light snow showers
      case 16: // snow
      case 18: // sleet
      case 41: // heavy snow
      case 42: // scattered snow showers
      case 43: // heavy snow
      case 46: // snow showers
        return 'snow';
      case 15: // blowing snow
      case 19: // dust
      case 20: // foggy
      case 21: // haze
      case 22: // smoky
        return 'fog';
      case 24: // windy
      case 23: // blustery
        return 'windy';
      case 26: // cloudy
      case 27: // mostly cloudy (night)
      case 28: // mostly cloudy (day)
      case 31: // clear (night)
        return 'cloudy';
      case 29: // partly cloudy (night)
      case 30: // partly cloudy (day)
      case 44: // partly cloudy
        return 'partly-cloudy-day';
    }
  }
  setSelectedCities(cities) {
    this.selectedCities = cities;
  }
  saveSelectedCities(dbPromise) {
    const stateService = this;
    dbPromise.then(function (db) {
      const tx = db.transaction('selectedCities', 'readwrite');
      const selCitiesStore = tx.objectStore('selectedCities');
      stateService.selectedCities.forEach(function (city) {
        selCitiesStore.put(city);
      })
      return tx.complete;
    }).then(function () {
      console.log('Cities added!')
    });
  }
}
