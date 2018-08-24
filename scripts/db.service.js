class DbService {
  static openDatabase() {
    if (!'serviceWorker' in navigator) {
      return Promise.resolve();
    }
    return idb.open('weather-app-db', 1, function (upgradeDb) {
      console.log("HELLLLOOO DB CONECTED!!!!!")
      var store = upgradeDb.createObjectStore('selectedCities', { keyPath: 'key' });
      store.createIndex('label', 'label');
    });
  }
  saveSelectedCities() {

  }
}