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
  setSelectedCities(cities) {
    this.selectedCities = cities;
  }
  saveSelectedCities(dbPromise) {
    dbPromise.then(function (db) {
      const tx = db.transaction('selectedCities', 'readwrite');
      const selCitiesStore = tx.objectStore('selectedCities');
      this.selectedCities.forEach(function (city) {
        selCitiesStore.put(city);
      })
      return tx.complete;
    }).then(function () {
      console.log('Cities added!')
    });
  }
}
