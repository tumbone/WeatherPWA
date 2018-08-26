class MainController {
  constructor() {
    this.state = new StateService();
    this.dbPromise = DbService.openDatabase();
    this.forecastOrchestrator = new ForecastOrchestrator(this.state);
  }
  registerSW() {
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
      if (cities.length > 0) {
        cities.forEach(function (city) {
          MainController.forecastOrchestrator.getForecast(city.key, city.label, MainController.state.initialWeatherForecast);
        });
      } else {
        MainController.forecastOrchestrator.updateForecastCard(MainController.state.initialWeatherForecast);
        MainController.state.selectedCities = [
          { key: MainController.state.initialWeatherForecast.key, label: MainController.state.initialWeatherForecast.label }
        ];
        MainController.saveSelectedCities(MainController.dbPromise);
      }
    });
  }
  saveSelectedCities() {
    const MainController = this;
    this.dbPromise.then(function (db) {
      const tx = db.transaction('selectedCities', 'readwrite');
      const selCitiesStore = tx.objectStore('selectedCities');
      MainController.state.selectedCities.forEach(function (city) {
        selCitiesStore.put(city);
      })
      return tx.complete;
    }).then(function () {
      console.log('Cities added!')
    });
  }
  // Toggles the visibility of the add new city dialog.
  toggleAddDialog(visible) {
    if (visible) {
      this.state.addDialog.classList.add('dialog-container--visible');
    } else {
      this.state.addDialog.classList.remove('dialog-container--visible');
    }
  };




} 