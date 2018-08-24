class MainController {
  constructor() {
    this.state = new StateService();
    this.dbPromise = DbService.openDatabase();
    // this.forecastOrchestrator = new ForecastOrchestrator();
    this.value = "Main controller here";
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
  startUp() {
    const MainController = this;
    this.dbPromise.then(function (db) {
      const tx = db.transaction('selectedCities');
      const selCitiesStore = tx.objectStore('selectedCities');
      const keyIndex = selCitiesStore.index('label');
      return keyIndex.getAll();
    }).then(function (cities) {
      const forecastOrchestrator = new ForecastOrchestrator();
      if (cities.length > 0) {
        cities.forEach(function (city) {
          forecastOrchestrator.getForecast(city.key, city.label);
        });
      } else {
        forecastOrchestrator.updateForecastCard(MainController.state.initialWeatherForecast);
        StateService.selectedCities = [
          { key: MainController.state.initialWeatherForecast.key, label: MainController.state.initialWeatherForecast.label }
        ];
        MainController.state.saveSelectedCities(MainController.dbPromise);
      }
    });
  }
} 