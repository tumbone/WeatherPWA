'use strict'
class ForecastOrchestrator {
  constructor(state) {
    this.viewService = new ViewService(state);
    this.StateService = state;
  }

  getForecast(key, label, initialWeatherForecast) {
    const ForecastOrchestrator = this;
    const statement = 'select * from weather.forecast where woeid=' + key;
    const url = 'https://query.yahooapis.com/v1/public/yql?format=json&q=' + statement;
    // TODO add cache logic here
    if ('caches' in window) {
      /*
       * Check if the service worker has already cached this city's weather
       * data. If the service worker has the data, then display the cached
       * data while the app fetches the latest data.
       */
      caches.match(url).then((response) => {
        if (response) {
          response.json().then(function updateFromCache(json) {
            const results = json.query.results;
            results.key = key;
            results.label = label;
            results.created = json.query.created;
            ForecastOrchestrator.updateForecastCard(results);
          });
        }
      });
    }

    // Fetch the latest data.
    const request = new XMLHttpRequest();
    request.onreadystatechange = () => {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          const response = JSON.parse(request.response);
          const results = response.query.results;
          results.key = key;
          results.label = label;
          results.created = response.query.created;
          ForecastOrchestrator.updateForecastCard(results);
        }
      } else {
        // Return the initial weather forecast since no data is available.
        ForecastOrchestrator.updateForecastCard(initialWeatherForecast);
      }
    };
    request.open('GET', url);
    request.send();
  }
  updateForecastCard(data) {
    this.viewService.viewCardUpdate(data);
  }
  updateForecasts() {
    const ForecastOrchestrator = this;
    const keys = Object.keys(this.StateService.visibleCards);
    keys.forEach((key) => ForecastOrchestrator.getForecast(key));
  };
}