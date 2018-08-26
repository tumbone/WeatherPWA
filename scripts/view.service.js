class ViewService {
  constructor(state) {
    this.StateService = state;
  }
  viewCardUpdate(data = this.StateService.initialWeatherForecast) {
    const dataLastUpdated = new Date(data.created);
    const sunrise = data.channel.astronomy.sunrise;
    const sunset = data.channel.astronomy.sunset;
    const current = data.channel.item.condition;
    const humidity = data.channel.atmosphere.humidity;
    const wind = data.channel.wind;

    let card = this.StateService.visibleCards[data.key];
    if (!card) {
      card = this.StateService.cardTemplate.cloneNode(true);
      card.classList.remove('cardTemplate');
      card.querySelector('.location').textContent = data.label;
      card.removeAttribute('hidden');
      this.StateService.container.appendChild(card);
      this.StateService.visibleCards[data.key] = card;
    }

    // Verifies the data provide is newer than what's already visible
    // on the card, if it's not bail, if it is, continue and update the
    // time saved in the card
    const cardLastUpdatedElem = card.querySelector('.card-last-updated');
    let cardLastUpdated = cardLastUpdatedElem.textContent;
    if (cardLastUpdated) {
      cardLastUpdated = new Date(cardLastUpdated);
      // Bail if the card has more recent data then the data
      if (dataLastUpdated.getTime() < cardLastUpdated.getTime()) {
        return;
      }
    }
    cardLastUpdatedElem.textContent = data.created;

    card.querySelector('.description').textContent = current.text;
    card.querySelector('.date').textContent = current.date;
    card.querySelector('.current .icon').classList.add(this.StateService.getIconClass(current.code));
    card.querySelector('.current .temperature .value').textContent =
      Math.round(current.temp);
    card.querySelector('.current .sunrise').textContent = sunrise;
    card.querySelector('.current .sunset').textContent = sunset;
    card.querySelector('.current .humidity').textContent =
      Math.round(humidity) + '%';
    card.querySelector('.current .wind .value').textContent =
      Math.round(wind.speed);
    card.querySelector('.current .wind .direction').textContent = wind.direction;
    const nextDays = card.querySelectorAll('.future .oneday');
    let today = new Date();
    today = today.getDay();
    for (let i = 0; i < 7; i++) {
      const nextDay = nextDays[i];
      const daily = data.channel.item.forecast[i];
      if (daily && nextDay) {
        nextDay.querySelector('.date').textContent =
          this.StateService.daysOfWeek[(i + today) % 7];
        nextDay.querySelector('.icon').classList.add(this.StateService.getIconClass(daily.code));
        nextDay.querySelector('.temp-high .value').textContent =
          Math.round(daily.high);
        nextDay.querySelector('.temp-low .value').textContent =
          Math.round(daily.low);
      }
    }
    if (this.StateService.isLoading) {
      this.StateService.spinner.setAttribute('hidden', true);
      this.StateService.container.removeAttribute('hidden');
      this.StateService.isLoading = false;
    }
  };
}
