'use strict'
class State {
  constructor() {
    this.isLoading = true;
    this.visibleCards = {};
    this.selectedCities = [];
    this.spinner = document.querySelector('.loader');
    this.cardTemplate = document.querySelector('.cardTemplate');
    this.container = document.querySelector('.main');
    this.addDialog = document.querySelector('.dialog-container');
    this.daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  }
}
