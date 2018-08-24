class MainController {
  constructor() {
    this.state = new StateService();
    this.dbPromise = DbService.openDatabase();
    this.forecastOrchestrator = new ForcastOrchastrator();
  }
  static registerSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('./sw.js')
        .then(function () {
          console.log('Service Worker registered!');
        })
    }
  }
  static startUp() {
    this.dbPromise.then(function (db) {
      const tx = db.transaction('selectedCities');
      const selCitiesStore = tx.objectStore('selectedCities');
      const keyIndex = selCitiesStore.index('label');
      return keyIndex.getAll();
    }).then(function (cities) {
      if (cities.length > 0) {
        cities.forEach(function (city) {
          forecastOrchestrator.getForecast(city.key, city.label);
        });
      } else {
        forecastOrchastrator.updateForecastCard(initialWeatherForecast);
        this.state.selectedCities = [
          { key: initialWeatherForecast.key, label: initialWeatherForecast.label }
        ];
        this.state.saveSelectedCities();
      }
    });
  }
}