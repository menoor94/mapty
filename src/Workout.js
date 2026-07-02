"use strict";

export { Workout, Running, Cycling };

class Workout {
  date = new Date();
  id = (Date.now() + " ").slice(-10);
  constructor(coords, duration, distance) {
    this.coords = coords;
    this.duration = duration;
    this.distance = distance;
  }

  _setDescription(workout) {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', "October", "November", "December"]

    this.description = `${this.type} on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
    console.log(this.type);
  }
}

class Running extends Workout {
  type = "Running";
  constructor(coords, duration, distance, cadence) {
    super(coords, duration, distance);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    //Pace in KM
    return (this.pace = this.duration / this.distance);
  }
}

class Cycling extends Workout {
  type = "Cycling";
  constructor(coords, duration, distance, elev) {
    super(coords, duration, distance);
    this.elev = elev;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    //KM/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}
