"use strict";

//Menoor lat lng = 34.5060703531652 47.962886095047004

const form = document.getElementById("workout-form");
const formContainer = document.getElementById("form-container");
const distance = document.getElementById("distance");
const workoutType = document.getElementById("workout-type");
const workoutCadence = document.getElementById("workout-cadence");
const workoutDuration = document.getElementById("workout-duration");
const workoutElev = document.getElementById("workout-elev");
let mapEvent, map;

class Workout {
  date = new Date();
  id = (Date.now() + " ").slice(-10);
  constructor(coords, duration, distance) {
    this.coords = coords;
    this.duration = duration;
    this.distance = distance;
  }
}

class Running extends Workout {
  constructor(coords, duration, distance, cadence) {
    super(coords, duration, distance);
    this.cadence = cadence;
    this.calcPace();
  }

  calcPace() {
    //Pace in KM
    return (this.pace = this.duration / this.distance);
  }
}

class Cycling extends Workout {
  constructor(coords, duration, distance, elev) {
    super(coords, duration, distance);
    this.elev = elev;
    this.calcSpeed();
  }

  calcSpeed() {
    //KM/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}
// console.log(new Running([12.42, 41.14], 12, 3, 300));
// console.log(new Cycling([12.42, 41.14], 12, 4, 30));

//////////////////////////////////
//App class
class App {
  #map;
  #mapEvent;

  constructor() {
    this._getPosition();
    form.addEventListener("submit", this._newWorkout.bind(this));
    workoutType.addEventListener("change", this._toggleElevationField);
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          console.error("could not do it");
        },
      );
    }
  }

  _loadMap(pos) {
    const { latitude } = pos.coords;
    const { longitude } = pos.coords;
    const coords = [latitude, longitude];

    this.#map = L.map("map").setView(coords, 15);

    L.tileLayer(
      "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
      {
        attribution:
          "&copy; OpenStreetMap contributors, Tiles style by CyclOSM hosted by OpenStreetMap France",
      },
    ).addTo(this.#map);

    this.#map.on("click", this._showForm.bind(this));
  }
  _showForm(e) {
    this.#mapEvent = e;
    formContainer.classList.remove("hidden");
    distance.focus();
  }

  _newWorkout(e) {
    e.preventDefault();

    workoutType.value = "Running";
    workoutCadence.value = workoutDuration.value = distance.value = "";

    let type;
    workoutType.value === "Running"
      ? (type = "running-popup")
      : (type = "cycling-popup");

    const { lat, lng } = this.#mapEvent.latlng;
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          minWidth: 90,
          maxWidth: 150,
          autoClose: false,
          closeOnClick: false,
          className: type,
        }),
      )
      .setPopupContent(workoutType.value)
      .openPopup();
  }

  _toggleElevationField() {
    workoutCadence.closest(".form--row").classList.toggle("hidden");
    workoutElev.closest(".form--row").classList.toggle("hidden");
  }
}

const app = new App();
