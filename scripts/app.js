// Copyright 2016 Google Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

(() => {
  'use strict'
  const App = new MainController();
  App.registerSW();
  App.startUp();

  // Refresh all of the forecasts
  document.getElementById('butRefresh').addEventListener('click', () => App.forecastOrchestrator.updateForecasts());
  // Open/show the add new city dialog
  document.getElementById('butAdd').addEventListener('click', () => App.toggleAddDialog(true));
  // Add the newly selected city
  document.getElementById('butAddCity').addEventListener('click', () => {
    const select = document.getElementById('selectCityToAdd');
    const selected = select.options[select.selectedIndex];
    const key = selected.value;
    const label = selected.textContent;
    // TODO init the app.selectedCities array here
    if (!App.state.selectedCities) {
      App.state.selectedCities = [];
    }
    App.forecastOrchestrator.getForecast(key, label, App.state.initialWeatherForecast);
    // TODO push the selected city to the array and save here
    App.state.selectedCities.push({ key: key, label: label });
    App.saveSelectedCities();
    App.toggleAddDialog(false);
  });
  // Close the add new city dialog
  document.getElementById('butAddCancel').addEventListener('click', () => App.toggleAddDialog(false));

})();